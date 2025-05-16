// lib/firebaseAdmin.ts

import admin from 'firebase-admin';

const serviceAccount = require('../serviceAccountKey.json'); // Adjust path if needed

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { admin, db };
