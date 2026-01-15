import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { Pool } from 'pg';
import logger from '../utils/logger';
import { createPool } from '../db/pg';
import { publishOrderUpdated } from '../producer/snsClient';

const sqs = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1', endpoint: process.env.AWS_ENDPOINT });
const pool = createPool();

export async function pollPaymentQueue() {
  const queueUrl = process.env.PAYMENT_QUEUE_URL;
  if (!queueUrl) throw new Error('PAYMENT_QUEUE_URL is required');

  while (true) {
    try {
      const recv = new ReceiveMessageCommand({ QueueUrl: queueUrl, MaxNumberOfMessages: 5, WaitTimeSeconds: 10 });
      const res = await sqs.send(recv);
      if (!res.Messages) continue;
      for (const msg of res.Messages) {
        const body = JSON.parse(msg.Body || '{}');
        logger.info('Order worker got payment message', body);
        try {
          if (body.event === 'PAYMENT_SUCCEEDED') {
            const orderId = body.data.order_id;
            await pool.query('UPDATE orders SET status = $1, updated_at = now() WHERE id = $2', ['paid', orderId]);
            logger.info('Marked order paid', { orderId });
            // publish order updated event for other systems
            if (process.env.ORDER_TOPIC_ARN) {
              await publishOrderUpdated(process.env.ORDER_TOPIC_ARN, { event: 'ORDER_PAID', data: { order_id: orderId } });
            }
          } else if (body.event === 'PAYMENT_FAILED') {
            const orderId = body.data.order_id;
            await pool.query('UPDATE orders SET status = $1, updated_at = now() WHERE id = $2', ['payment_failed', orderId]);
            logger.info('Marked order payment_failed', { orderId });
            if (process.env.ORDER_TOPIC_ARN) {
              await publishOrderUpdated(process.env.ORDER_TOPIC_ARN, { event: 'ORDER_PAYMENT_FAILED', data: { order_id: orderId } });
            }
          }
        } catch (err) {
          logger.error('Failed processing payment message in order worker', err);
        }

        if (msg.ReceiptHandle) await sqs.send(new DeleteMessageCommand({ QueueUrl: queueUrl, ReceiptHandle: msg.ReceiptHandle }));
      }
    } catch (err) {
      logger.error('Error polling payment queue', err);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}
