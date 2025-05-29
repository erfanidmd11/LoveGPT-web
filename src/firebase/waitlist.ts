// firebase/waitlist.ts
import { doc, collection, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { WaitlistForm } from '@/types/waitlist';

export const submitWaitlistRequest = async (formData: WaitlistForm): Promise<string> => {
  const ref = doc(collection(db, 'waitlistRequests'));
  await setDoc(ref, {
    ...formData,
    createdAt: new Date(),
  });
  return ref.id;
};
