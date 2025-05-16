// importUser.js

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function importUser() {
  const userId = "sampleUser123";
  const dob = "03/21/1995";

  // Calculate age
  const [month, day, year] = dob.split("/").map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  // Simulated readiness scoring
  const readinessProfile = {
    score: 72.3,
    stage: "Ready for Monogamous Relationship",
    insightSummary: "You're grounded and capable of investing in a deep, meaningful bond.",
    sourceContributions: {
      onboarding: 30,
      psychometrics: 20,
      ariaInsights: 12.3,
      engagement: 10,
    },
    lastUpdated: new Date().toISOString(),
  };

  await db.collection("users").doc(userId).set({
    firstName: "Jane",
    lastName: "Doe",
    dob: dob,
    age: age,
    phoneNumber: "+15551234567",
    email: "jane@example.com",
    gender: "Female",
    matchPreference: "Male",
    zodiac: {
      western: "Aries",
      chinese: "Ox",
    },
    relationshipStatus: "Single",
    intentions: ["Self-discovery", "Friendship"],
    readinessProfile: readinessProfile,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`✅ User ${userId} imported successfully`);
}

importUser().catch(console.error);
