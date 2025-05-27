// File: src/lib/email/sendMailgunEmail.ts

import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

export async function sendMailgunEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  if (!process.env.MAILGUN_DOMAIN) {
    throw new Error('Missing MAILGUN_DOMAIN env variable');
  }

  return await mg.messages.create(process.env.MAILGUN_DOMAIN, {
    from: `LoveGPT Admin <admin@thelovegpt.ai>`,
    to,
    subject,
    text,
    html,
  });
}
