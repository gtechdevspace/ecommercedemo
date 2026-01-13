import axios from 'axios';
import { Pool } from 'pg';
import { SQSClient, ReceiveMessageCommand } from '@aws-sdk/client-sqs';

const orderApi = axios.create({ baseURL: process.env.ORDER_URL || 'http://localhost:4200' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ecommerce' });
const sqs = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1', endpoint: process.env.AWS_ENDPOINT || 'http://localhost:4566' });

async function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function pollForReservation(orderId: number, timeoutSec = 30) {
  const start = Date.now();
  while ((Date.now() - start) / 1000 < timeoutSec) {
    const res = await pool.query('SELECT * FROM reservations WHERE order_id = $1', [orderId]);
    if (res.rows.length > 0) return true;
    await sleep(1000);
  }
  return false;
}

async function pollQueueForEvent(queueUrl: string, expectedEvent: string, timeoutSec = 30) {
  const start = Date.now();
  while ((Date.now() - start) / 1000 < timeoutSec) {
    const cmd = new ReceiveMessageCommand({ QueueUrl: queueUrl, MaxNumberOfMessages: 5, WaitTimeSeconds: 5 });
    const res = await sqs.send(cmd as any);
    const msgs = res.Messages || [];
    for (const m of msgs) {
      try {
        let body: any = JSON.parse(m.Body || '{}');
        // SNS->SQS wraps our message in Message field
        if (body.Message) body = JSON.parse(body.Message);
        if (body.event === expectedEvent) return true;
      } catch (e) {
        // ignore parse
      }
    }
    await sleep(1000);
  }
  return false;
}

(async () => {
  try {
    console.log('Creating order...');
    const items = [{ product_id: 1001, qty: 1 }];
    const r = await orderApi.post('/api/orders', { user_id: 1, items, total: 9.99 });
    const order = r.data;
    console.log('Order created', order.id);

    // Check reservation (DB)
    const reserved = await pollForReservation(order.id, 60);
    if (!reserved) throw new Error('Inventory reservation not detected');
    console.log('Reservation detected');

    // Check that order-created message reached inventory queue
    const inventoryQueue = process.env.INVENTORY_QUEUE_URL || 'http://localhost:4566/000000000000/inventory-queue';
    const orderMsg = await pollQueueForEvent(inventoryQueue, 'ORDER_CREATED', 30);
    if (!orderMsg) throw new Error('ORDER_CREATED message not found in inventory queue');
    console.log('ORDER_CREATED found in inventory queue');

    // Check payment record (DB)
    const paymentDetected = await (async () => {
      const start = Date.now();
      while ((Date.now() - start) / 1000 < 60) {
        const pres = await pool.query('SELECT * FROM payments WHERE order_id = $1', [order.id]);
        if (pres.rows.length > 0) return pres.rows[0];
        await sleep(1000);
      }
      return null;
    })();
    if (!paymentDetected) throw new Error('Payment record not detected');
    console.log('Payment detected', paymentDetected.id);

    // Check payment topic delivered to payment queue
    const paymentQueue = process.env.PAYMENT_QUEUE_URL || 'http://localhost:4566/000000000000/payment-queue';
    const paymentMsg = await pollQueueForEvent(paymentQueue, 'PAYMENT_SUCCEEDED', 30);
    if (!paymentMsg) throw new Error('PAYMENT_SUCCEEDED message not found in payment queue');
    console.log('PAYMENT_SUCCEEDED found in payment queue');

    console.log('Integration test passed for order', order.id);
    process.exit(0);
  } catch (err: any) {
    console.error('Integration test failed', err.message || err);
    process.exit(2);
  } finally {
    await pool.end();
  }
})();