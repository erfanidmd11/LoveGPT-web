import formData from 'form-data';
import Mailgun from 'mailgun.js';

interface InviteEmailParams {
  to: string;
  firstName: string;
  inviteCode: string;
}

export const sendInviteEmail = async ({ to, firstName, inviteCode }: InviteEmailParams) => {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (typeof window === 'undefined') {
    console.log('📦 MAILGUN_API_KEY Loaded?', !!apiKey);
    console.log('📦 MAILGUN_DOMAIN Loaded?', !!domain);
  }

  if (!apiKey || !domain) {
    throw new Error('❌ Missing Mailgun API credentials. Check your .env.local');
  }

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: 'api',
    key: apiKey,
  });

  try {
    const result = await mg.messages.create(domain, {
      from: `LoveGPT <noreply@${domain}>`,
      to,
      subject: `💌 You're Invited to LoveGPT`,
      html: `
        <h2>Hi ${firstName},</h2>
        <p>You've been invited to <strong>LoveGPT</strong> — your Emotional Operating System for Relationships.</p>
        <p>Your invite code is: <strong>${inviteCode}</strong></p>
        <p><a href="https://www.thelovegpt.ai/signup">Click here to join</a> and begin your journey.</p>
        <p style="margin-top:20px;">💖 — The LoveGPT Team</p>
      `,
    });

    console.log('📨 Invite email sent via Mailgun:', result);
  } catch (error: any) {
    console.error('🔥 Mailgun send error:', error?.message || error);
    throw error;
  }
};
