import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Generates a clean alphanumeric code (avoids ambiguous characters like 0/O, 1/I).
 */
export const generateCode = (length: number = 8): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

interface InviteCodeOptions {
  maxUses?: number;
  expiresAt?: Date | null;
  createdBy?: string;
  level?: number;
  lineage?: string[];
}

/**
 * Creates multiple invitation codes with Firestore documents.
 * @param count Number of codes to create (default: 10)
 * @param options Options to attach to each invite
 */
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
    const code = generateCode();
    const ref = doc(db, 'invitationCodes', code);

    const data = {
      code,
      createdAt: serverTimestamp(),
      createdBy,
      maxUses,
      usedCount: 0,
      status: 'active', // or 'inactive', 'filled'
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      level,
      lineage,
    };

    await setDoc(ref, data);
    codes.push(code);
  }

  console.log(`✅ Generated ${codes.length} invite codes:`);
  console.table(codes);
  return codes;
};
