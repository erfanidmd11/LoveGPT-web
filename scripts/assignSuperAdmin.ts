import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// ✅ Initialize Firebase Admin
initializeApp({ credential: applicationDefault() });

// ✅ Call this function with your actual UID
const assignSuperAdmin = async (uid: string) => {
  await getAuth().setCustomUserClaims(uid, { superAdmin: true });
  console.log(`✅ Super admin claim added to UID: ${uid}`);
};

// ✅ REPLACE with the actual user UID
assignSuperAdmin('Dy5zmziPV4bsuPSecSdfsJKm6Rl1');
