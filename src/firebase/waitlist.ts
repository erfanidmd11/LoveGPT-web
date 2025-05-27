import { doc } from 'firebase/firestore';

export const submitWaitlistRequest = async (): Promise<string> => {
  return doc().id; // Generates a unique Firestore-compatible ID
};
