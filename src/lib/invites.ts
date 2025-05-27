import { db } from './firebase';
import {
  doc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Creates a new invitation code document in Firestore with optional metadata.
 */
export const createInviteCode = async (
  code: string,
  createdBy: string,
  options: {
    referredBy?: string;
    referralLineage?: string[];
    level?: number;
    maxUses?: number;
    expiresInDays?: number;
  } = {}
) => {
  const ref = doc(db, 'invitationCodes', code);

  const inviteData = {
    code,
    createdBy,
    createdAt: Timestamp.now(),
    referredBy: options.referredBy || null,
    referralLineage: options.referralLineage || [],
    level: options.level || 1,
    usedCount: 0,
    maxUses: options.maxUses ?? 1,
    status: 'active',
    expiresAt: options.expiresInDays
      ? Timestamp.fromDate(new Date(Date.now() + options.expiresInDays * 86400000))
      : null,
  };

  await setDoc(ref, inviteData);
};

/**
 * Marks an invitation code as used, stores who used it and when,
 * and logs the event for analytics or rewards tracking.
 */
export const markInviteCodeAsUsed = async (
  code: string,
  usedBy: string
) => {
  const ref = doc(db, 'invitationCodes', code);
  await updateDoc(ref, {
    used: true,
    usedBy,
    usedAt: Timestamp.now(),
  });

  await addDoc(collection(db, 'referralEvents'), {
    inviteCode: code,
    usedBy,
    usedAt: Timestamp.now(),
    type: 'inviteUsed',
  });
};

/**
 * Validates if an invitation code exists, is active, and has not been used or expired.
 */
export const validateInviteCode = async (code: string): Promise<boolean> => {
  const q = query(
    collection(db, 'invitationCodes'),
    where('code', '==', code),
    where('status', '==', 'active'),
    where('used', '!=', true)
  );
  const snap = await getDocs(q);

  if (snap.empty) return false;

  const docData = snap.docs[0].data();
  const now = Timestamp.now();

  if (docData.expiresAt && docData.expiresAt.toMillis() < now.toMillis()) {
    return false;
  }

  if (docData.maxUses && docData.usedCount >= docData.maxUses) {
    return false;
  }

  return true;
};
