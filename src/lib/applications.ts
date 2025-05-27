import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export interface InviteApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  handle: string;
  isMatchIntent: boolean;
  referredBy?: string;
}

export async function submitInviteApplication(data: InviteApplicationData) {
  // Basic validation – make sure nothing critical is missing
  if (
    !data.firstName ||
    !data.lastName ||
    !data.email ||
    !data.phone ||
    !data.handle ||
    data.isMatchIntent === undefined
  ) {
    throw new Error('Missing required fields');
  }

  return await addDoc(collection(db, 'inviteApplications'), {
    ...data,
    level: 1,
    status: 'pending',
    createdAt: Timestamp.now(),
  });
}
