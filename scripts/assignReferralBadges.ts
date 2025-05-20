// scripts/assignReferralBadges.ts
const admin = require('firebase-admin');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore();

const getReferralBadge = (count: number): string => {
  if (count >= 20) return '🧠 LoveGPT Luminary';
  if (count >= 10) return '💖 Matchmaker Elite';
  if (count >= 5) return "💌 Cupid's Assistant";
  if (count >= 3) return '💞 Spark Spreader';
  if (count >= 1) return '🌱 Seed Planter';
  return '';
};

async function assignBadges() {
  const usersSnapshot = await db.collection('users').get();

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const userData = userDoc.data();

    const referralsQuery = db
      .collection('invitationCodes')
      .where('referredBy', '==', userId);

    const referralsSnapshot = await referralsQuery.get();
    const referralCount = referralsSnapshot.size;
    const badge = getReferralBadge(referralCount);

    if (badge) {
      await db.collection('users').doc(userId).update({
        badges: [badge],
        referralCount,
      });

      await db.collection('referralBadgeEvents').add({
        userId,
        badge,
        referralCount,
        updatedAt: Timestamp.now(),
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });

      console.log(`✅ Updated ${userId} → ${badge}`);
    } else {
      console.log(`➖ No badge for ${userId} (0 referrals)`);
    }
  }

  console.log('🎯 Badge assignment complete.');
}

assignBadges().catch(console.error);
