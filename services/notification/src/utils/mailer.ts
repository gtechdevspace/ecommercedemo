import nodemailer from 'nodemailer';
import logger from './logger';

export const createTransporter = () => {
  // In production wire this to SES / SendGrid etc. For local dev use ethereal or log output.
  const transporter = nodemailer.createTransport({ jsonTransport: true });
  return transporter;
};

export async function sendEmail(to: string, subject: string, text: string) {
  const transporter = createTransporter();
  const info = await transporter.sendMail({ from: 'no-reply@example.com', to, subject, text });
  logger.info('Email sent', info);
  return info;
}
