import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { sendInviteEmail } from '@/lib/mailgun/sendInviteEmail';
import { doc, setDoc, Timestamp, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateCode } from '@/utils/invite/generateInviteCode';

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const isValidReferralCode = (code: string): boolean =>
  /^LOVE-[A-Z0-9]{6}$/.test(code);

const generateUniqueCode = async (): Promise<string | null> => {
  let attempts = 0;
  while (attempts < 5) {
    const code = generateCode();
    const codeRef = doc(db, 'invitationCodes', code);
    const snapshot = await getDoc(codeRef);
    if (!snapshot.exists() && isValidReferralCode(code)) return code;
    attempts++;
  }
  return null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const senderUid = decodedToken.uid;
    const senderEmail = decodedToken.email;

    const { to, firstName } = req.body;
    if (!to || !firstName) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const inviteCode = await generateUniqueCode();
    if (!inviteCode) {
      return res.status(500).json({ error: 'Failed to generate invite code' });
    }

    // Fetch referring user info
    const senderRef = doc(db, 'users', senderUid);
    const senderSnap = await getDoc(senderRef);
    const senderData = senderSnap.exists() ? senderSnap.data() : {};

    const parentLevel = senderData?.referralLevel || 0;
    const referralLineage = Array.isArray(senderData?.referralLineage) ? senderData.referralLineage : [];
    referralLineage.push(senderUid);

    const inviteRef = doc(db, 'invitationCodes', inviteCode);
    const inviteData = {
      code: inviteCode,
      createdAt: Timestamp.now(),
      createdBy: senderEmail || 'admin',
      referredBy: senderUid,
      level: parentLevel + 1,
      referralLineage,
      usedCount: 0,
      maxUses: 1,
      status: 'active',
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 1 week
    };

    await setDoc(inviteRef, inviteData);
    await sendInviteEmail({ to, firstName, inviteCode });

    return res.status(200).json({ success: true, code: inviteCode });
  } catch (err: any) {
    console.error('❌ Invite API error:', err.message);
    return res.status(401).json({ error: 'Unauthorized or failed to process invite.' });
  }
}
