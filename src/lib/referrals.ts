import { db } from './firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Registers a referral relationship by storing the referrer ID and building a 5-level chain.
 */
export const registerReferral = async (userId: string, referrerId: string) => {
  const userRef = doc(db, 'users', userId);
  const referrerRef = doc(db, 'users', referrerId);

  const referrerSnap = await getDoc(referrerRef);
  if (!referrerSnap.exists()) throw new Error('Invalid referrer ID');

  const referralChain = referrerSnap.data()?.referralChain || [];
  const newChain = [referrerId, ...referralChain.slice(0, 4)];

  await updateDoc(userRef, {
    referrerId,
    referralChain: newChain,
    referralLineage: newChain,
    referralLevel: newChain.length,
  });
};

/**
 * Retrieves the referral chain for a given user.
 */
export const getReferralChain = async (userId: string): Promise<string[]> => {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data()?.referralChain || [] : [];
};

/**
 * Retrieves a user's referral lineage and level for use when generating invites.
 */
export const getReferralLineage = async (
  referrerId: string
): Promise<{ lineage: string[]; level: number }> => {
  const snap = await getDoc(doc(db, 'users', referrerId));
  const data = snap.exists() ? snap.data() : {};

  const lineage = Array.isArray(data?.referralLineage)
    ? [...data.referralLineage, referrerId]
    : [referrerId];

  const level = (data?.referralLevel || 0) + 1;

  return { lineage, level };
};

/**
 * Retrieves all users referred by the root user, including their level in the tree (up to 5 levels deep).
 */
export const getReferralTree = async (
  rootUserId: string
): Promise<{ userId: string; level: number }[]> => {
  const queue: { userId: string; level: number }[] = [{ userId: rootUserId, level: 0 }];
  const result: { userId: string; level: number }[] = [];
  const visited = new Set<string>([rootUserId]);

  while (queue.length > 0) {
    const { userId, level } = queue.shift()!;
    if (level >= 5) continue;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referrerId', '==', userId));
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const referredId = docSnap.id;
      if (!visited.has(referredId)) {
        visited.add(referredId);
        result.push({ userId: referredId, level: level + 1 });
        queue.push({ userId: referredId, level: level + 1 });
      }
    }
  }

  return result;
};
