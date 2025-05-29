// scripts/generateInviteCodes.ts

import admin from 'firebase-admin';
import { db } from '@/lib/firebaseAdmin'; // server-safe

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const generateCode = (length: number = 6): string => {
  return 'LOVE-' + Array.from({ length }, () =>
    CHARSET[Math.floor(Math.random() * CHARSET.length)]
  ).join('');
};

const isValidReferralCode = (code: string): boolean => {
  return /^LOVE-[A-Z0-9]{6}$/.test(code);
};

interface InviteCodeOptions {
  maxUses?: number;
  expiresAt?: Date | null;
  createdBy?: string;
  level?: number;
  lineage?: string[];
}

export const generateInviteCodes = async (
  count: number = 10,
  options: InviteCodeOptions = {}
): Promise<string[]> => {
  const {
    maxUses = 0,
    expiresAt = null,
    createdBy = 'admin',
    level = 0,
    lineage = [],
  } = options;

  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    let code = generateCode();
    let attempts = 0;

    while (attempts < 5) {
      const ref = db.collection('invitationCodes').doc(code);
      const snapshot = await ref.get();

      if (!snapshot.exists) break;
      code = generateCode();
      attempts++;
    }

    if (!isValidReferralCode(code)) {
      console.warn(`❌ Invalid format for generated code: ${code}`);
      continue;
    }

    await db.collection('invitationCodes').doc(code).set({
      code,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy,
      maxUses,
      usedCount: 0,
      status: 'active',
      expiresAt: expiresAt || null,
      level,
      lineage,
    });

    codes.push(code);
  }

  console.log(`✅ Successfully generated ${codes.length} code(s):`);
  console.table(codes);
  return codes;
};

// Optional: run automatically when executed
if (require.main === module) {
  generateInviteCodes(5, {
    maxUses: 3,
    createdBy: 'system',
  }).catch(console.error);
}
