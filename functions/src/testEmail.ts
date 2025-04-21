import Mailgun from 'mailgun.js';
import formData from 'form-data';

// ✅ Load environment variables properly
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY!;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN!;

if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
  throw new Error("❌ Mailgun credentials missing. Check MAILGUN_API_KEY and MAILGUN_DOMAIN.");
}

// ✅ Create mailgun instance properly
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
  url: 'https://api.mailgun.net',
});

// ✅ Send a test email
mg.messages.create(MAILGUN_DOMAIN, {
  from: `LoveGPT <noreply@${MAILGUN_DOMAIN}>`,
  to: ['you@example.com'], // ✅ Replace with your actual email
  subject: 'Test Email from LoveGPT',
  text: 'This is a test email sent using Mailgun and mailgun.js!',
}).then(msg => {
  console.log('✅ Email sent:', msg);
}).catch(err => {
  console.error('❌ Failed to send email:', err);
});
