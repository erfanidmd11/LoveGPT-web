import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { getUserProfile } from "./getUserProfile"; // the file you already have

export async function createUserProfile(user) {
  if (!user) return;

  const localProfile = getUserProfile();

  const userRef = doc(db, "users", user.uid);

  await setDoc(userRef, {
    profile: {
      fullName: localStorage.getItem("userName") || user.displayName || "User",
      dob: localStorage.getItem("userDOB") || null,
      location: localProfile.location,
      zodiac: localProfile.zodiacSign,
      loveLanguages: [localProfile.loveLanguage],
      bio: "",
      gender: "", // You can add gender to localStorage later
      photos: [], // To be filled after image upload
      lookingFor: localProfile.relationshipGoals,
      preferences: {},
    },
    personality: {
      personalityTraits: localProfile.personalityTraits,
      communicationStyle: localProfile.communicationStyle,
      attachmentStyle: localProfile.attachmentStyle,
    },
    readiness: {
      score: localProfile.matchReadinessScore,
      lastUpdated: serverTimestamp(),
      AIInsights: "",
      redFlags: [],
    },
    values: {
      // You can expand these based on additional onboarding questions
      religion: "",
      kidsPlan: "",
      finances: "",
      careerBalance: "",
      parentingStyle: "",
      politicalView: "",
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
  });
}
