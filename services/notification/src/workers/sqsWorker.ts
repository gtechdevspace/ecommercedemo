import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { sendEmail } from '../utils/mailer';

dotenv.config();
const sqs = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1', endpoint: process.env.AWS_ENDPOINT });

export async function processMessage(body: any) {
  if (body.event === 'PAYMENT_SUCCEEDED' || body.event === 'PAYMENT_SUCCESS' || body.event === 'PAYMENT_Succeeded') {
    const data = body.data;
    await sendEmail('customer@example.com', 'Payment succeeded', `Payment for order ${data.order_id || data.orderId || data.stripe_id} succeeded`);
    logger.info('Processed PAYMENT_SUCCEEDED message', { data });
    return { status: 'ok' };
  }
  if (body.event === 'PAYMENT_FAILED') {
    const data = body.data;
    await sendEmail('customer@example.com', 'Payment failed', `Payment failed for order ${data.order_id || data.orderId || data.stripe_id}`);
    logger.info('Processed PAYMENT_FAILED message', { data });
    return { status: 'ok' };
  }

  if (body.event === 'ORDER_CREATED') {
    const data = body.data;
    await sendEmail('customer@example.com', 'Order placed', `Your order ${data.id} has been placed. Total: ${data.total}`);
    logger.info('Processed ORDER_CREATED message', { data });
    return { status: 'ok' };
  }

  if (body.event === 'ORDER_PAID') {
    const data = body.data;
    await sendEmail('customer@example.com', 'Order confirmed', `Payment received for order ${data.order_id}. We'll start fulfillment.`);
    logger.info('Processed ORDER_PAID message', { data });
    return { status: 'ok' };
  }

  if (body.event === 'INVENTORY_RELEASED') {
    const data = body.data;
    await sendEmail('customer@example.com', 'Order update', `Inventory was released for order ${data.orderId}`);
    logger.info('Processed INVENTORY_RELEASED message', { data });
    return { status: 'ok' };
  }

  logger.info('Unhandled message', body);
  return { status: 'ignored' };
}

export async function pollPaymentQueue() {
  const paymentQueueUrl = process.env.PAYMENT_QUEUE_URL;
  const orderQueueUrl = process.env.ORDER_QUEUE_URL;
  if (!paymentQueueUrl && !orderQueueUrl) throw new Error('At least one of PAYMENT_QUEUE_URL or ORDER_QUEUE_URL is required');

  while (true) {
    try {
      const urls = [paymentQueueUrl, orderQueueUrl].filter(Boolean) as string[];
      for (const queueUrl of urls) {
        const recv = new ReceiveMessageCommand({ QueueUrl: queueUrl, MaxNumberOfMessages: 5, WaitTimeSeconds: 10 });
        const res = await sqs.send(recv);
        if (!res.Messages) continue;
        for (const msg of res.Messages) {
          const body = JSON.parse(msg.Body || '{}');
          await processMessage(body);
          if (msg.ReceiptHandle) await sqs.send(new DeleteMessageCommand({ QueueUrl: queueUrl, ReceiptHandle: msg.ReceiptHandle }));
        }
      }
    } catch (err) {
      logger.error('Error polling queue', err);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}