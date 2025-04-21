// src/pages/api/sendInvite.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { adminDb } from '@/lib/firebaseAdminAuth';
import { sendInviteEmail } from '@/lib/mailgun/sendInviteEmail';
import { doc, setDoc, Timestamp, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateCode } from '@/utils/invite/generateInviteCode';

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

    const { to, firstName, inviteCode } = req.body;
    if (!to || !firstName || !inviteCode) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Fetch referring user if exists
    const senderRef = doc(db, 'users', senderUid);
    const senderSnap = await getDoc(senderRef);
    const senderData = senderSnap.exists() ? senderSnap.data() : {};

    // Save invite to Firestore
    const inviteRef = doc(db, 'invitationCodes', inviteCode);
    await setDoc(inviteRef, {
      code: inviteCode,
      createdAt: Timestamp.now(),
      createdBy: senderEmail || 'admin',
      referredBy: senderUid,
      level: 1, // default level
      usedCount: 0,
      maxUses: 1,
      status: 'active',
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 1 week
    });

    // Chain referral logic
    const parentLevel = senderData?.referralLevel || 0;
    const referralLineage = Array.isArray(senderData?.referralLineage) ? senderData.referralLineage : [];
    referralLineage.push(senderUid);

    await updateDoc(inviteRef, {
      level: parentLevel + 1,
      referralLineage,
    });

    // Send email via Mailgun
    await sendInviteEmail({ to, firstName, inviteCode });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('❌ Invite API error:', err.message);
    return res.status(401).json({ error: 'Unauthorized or failed to process invite.' });
  }
}
