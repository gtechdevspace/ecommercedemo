import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { createPool } from '../db/pg';
import { reserveItems, InventoryError } from '../services/inventory.service';
import { publishInventoryEvent } from '../producer/snsClient';

dotenv.config();
const sqs = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1', endpoint: process.env.AWS_ENDPOINT });
const pool = createPool();

export async function pollInventoryQueue() {
  const queueUrl = process.env.INVENTORY_QUEUE_URL;
  const topicArn = process.env.INVENTORY_TOPIC_ARN;
  if (!queueUrl) throw new Error('INVENTORY_QUEUE_URL is required');
  if (!topicArn) logger.warn('INVENTORY_TOPIC_ARN not set — inventory events will not be published');

  while (true) {
    try {
      const recv = new ReceiveMessageCommand({ QueueUrl: queueUrl, MaxNumberOfMessages: 5, WaitTimeSeconds: 10 });
      const res = await sqs.send(recv);
      if (!res.Messages) continue;
      for (const msg of res.Messages) {
        const body = JSON.parse(msg.Body || '{}');
        logger.info('Inventory worker got message', body);
        if (body.event === 'ORDER_CREATED') {
          const order = body.data;
          try {
            const resv = await reserveItems(pool, order.id, order.items);
            if (topicArn) await publishInventoryEvent(topicArn, { event: 'INVENTORY_RESERVED', data: { orderId: order.id, result: resv } });
          } catch (err: any) {
            logger.error('Failed to reserve inventory for order', { orderId: order.id, err: err.message });
            if (topicArn) await publishInventoryEvent(topicArn, { event: 'INVENTORY_FAILED', data: { orderId: order.id, reason: err.message } });
          }
        }
        // Delete message
        if (msg.ReceiptHandle) {
          await sqs.send(new DeleteMessageCommand({ QueueUrl: queueUrl, ReceiptHandle: msg.ReceiptHandle }));
        }
      }
    } catch (err) {
      logger.error('Error polling inventory queue', err);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
} 
