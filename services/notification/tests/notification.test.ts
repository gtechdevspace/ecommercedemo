import { processPaymentMessage } from '../src/workers/sqsWorker';
import * as mailer from '../src/utils/mailer';

jest.mock('../src/utils/mailer');

describe('Notification worker', () => {
  it('sends email on PAYMENT_SUCCEEDED', async () => {
    (mailer.sendEmail as jest.Mock).mockResolvedValue({ messageId: '1' });
    const res = await processPaymentMessage({ event: 'PAYMENT_SUCCEEDED', data: { orderId: 777 } });
    expect(res.status).toBe('ok');
    expect(mailer.sendEmail).toHaveBeenCalled();
  });

  it('sends email on PAYMENT_FAILED', async () => {
    (mailer.sendEmail as jest.Mock).mockResolvedValue({ messageId: '2' });
    const res = await processPaymentMessage({ event: 'PAYMENT_FAILED', data: { orderId: 888 } });
    expect(res.status).toBe('ok');
    expect(mailer.sendEmail).toHaveBeenCalled();
  });
});