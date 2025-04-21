import * as dotenv from 'dotenv';
dotenv.config();

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import Mailgun from 'mailgun.js';
import formData from 'form-data';

initializeApp();
const db = getFirestore();

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

export const sendWelcomeEmailV2 = onDocumentCreated('users/{userId}', async (event) => {
  const user = event.data?.data() as {
    email?: string;
    fullName?: string;
  };

  if (!user?.email) {
    console.warn('⛔ No email found on user document. Skipping...');
    return;
  }

  if (!MAILGUN_DOMAIN || !process.env.MAILGUN_API_KEY) {
    console.error('❌ Mailgun API key or domain is missing. Check .env.');
    return;
  }

  const message = {
    from: `LoveGPT <welcome@${MAILGUN_DOMAIN}>`,
    to: user.email,
    subject: '💌 Welcome to LoveGPT!',
    html: `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h2>Welcome to LoveGPT 💖</h2>
        <p>Hi ${user.fullName || 'Love Seeker'},</p>
        <p>Your journey toward conscious love starts here. ARIA is ready to support you every step of the way.</p>
        <p>— The LoveGPT Team</p>
      </div>
    `,
  };

  try {
    await mg.messages.create(MAILGUN_DOMAIN, message);
    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch (err: any) {
    console.error('🔥 Mailgun Error:', err.message || err);
  }
});
