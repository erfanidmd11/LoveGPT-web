import { doc, collection } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const submitWaitlistRequest = async (): Promise<string> => {
  return doc(collection(db, 'waitlist')).id;
};
