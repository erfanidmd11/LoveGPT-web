import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { getUserProfile } from './getUserProfile';
import { User } from 'firebase/auth';
import { validateInviteCode, markInviteCodeAsUsed } from './invites'; // ✅ shared logic
import { registerReferral } from './referrals'; // ✅ shared logic

export async function createUserProfile(user: User | null): Promise<void> {
  if (!user) return;

  const localProfile = getUserProfile();
  const userRef = doc(db, 'users', user.uid);

  const inviteCode = localStorage.getItem('inviteCode');
  let referralInfo = {
    invitedBy: null,
    lineage: [],
    level: 0,
  };

  if (inviteCode) {
    const isValid = await validateInviteCode(inviteCode);
    if (isValid) {
      await markInviteCodeAsUsed(inviteCode, user.uid);
      await registerReferral(user.uid, inviteCode); // will create referrer + chain

      referralInfo = {
        invitedBy: inviteCode,
        lineage: [], // This will now be managed in registerReferral
        level: 1,    // Optionally track direct level; chain itself is stored
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
      gender: '',
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
    referral: referralInfo, // ✅ still included, but now simplified
  });
}
