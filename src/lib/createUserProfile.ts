import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getUserProfile } from './getUserProfile';
import { User } from 'firebase/auth';

export async function createUserProfile(user: User | null): Promise<void> {
  if (!user) return;

  const localProfile = getUserProfile();
  const userRef = doc(db, 'users', user.uid);

  // 🔁 Referral logic
  const inviteCode = localStorage.getItem('inviteCode');
  let referralInfo = {
    invitedBy: null,
    lineage: [],
    level: 0,
  };

  if (inviteCode) {
    const inviteRef = doc(db, 'invitationCodes', inviteCode);
    const inviteSnap = await getDoc(inviteRef);

    if (inviteSnap.exists()) {
      const inviteData = inviteSnap.data();
      referralInfo = {
        invitedBy: inviteData.createdBy || null,
        lineage: [...(inviteData.lineage || []), user.uid],
        level: (inviteData.level || 0) + 1,
      };
    }
  }

  await setDoc(userRef, {
    profile: {
      fullName: localStorage.getItem('userName') || user.displayName || 'User',
      dob: localStorage.getItem('userDOB') || null,
      location: localProfile.location || '',
      zodiac: localProfile.zodiacSign || '',
      loveLanguages: [localProfile.loveLanguage || ''],
      bio: '',
      gender: '', // Optional: Update from future input
      photos: [],
      lookingFor: localProfile.relationshipGoals || '',
      preferences: {},
    },
    personality: {
      personalityTraits: localProfile.personalityTraits || [],
      communicationStyle: localProfile.communicationStyle || '',
      attachmentStyle: localProfile.attachmentStyle || '',
    },
    readiness: {
      score: localProfile.matchReadinessScore || 0,
      lastUpdated: serverTimestamp(),
      AIInsights: '',
      redFlags: [],
    },
    values: {
      religion: '',
      kidsPlan: '',
      finances: '',
      careerBalance: '',
      parentingStyle: '',
      politicalView: '',
    },
    points: {
      total: 0,
      earnedFrom: {
        profileComplete: 0,
        quizzes: 0,
        referrals: 0,
        helpingOthers: 0,
      },
    },
    activity: {
      lastLogin: serverTimestamp(),
      lastMessageSent: null,
      matchedUserIds: [],
    },
    referral: referralInfo, // ✅ Include referral lineage here
  });
}
