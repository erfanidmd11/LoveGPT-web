import { doc, collection } from 'firebase/firestore';
import { db } from './firebase'; // adjust path if needed

export const submitWaitlistRequest = async (): Promise<string> => {
  return doc(collection(db, 'waitlist')).id; // Generates a unique Firestore-compatible ID
};
