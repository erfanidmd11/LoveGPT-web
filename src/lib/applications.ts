// lib/applications.ts
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface InviteApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  handle: string;
  isMatchIntent: boolean;
  referredBy?: string;
}

export async function submitInviteApplication(data: InviteApplicationData) {
  const { firstName, lastName, email, phone, handle } = data;

  if (!firstName || !lastName || !email || !phone || !handle) {
    throw new Error('Missing required fields');
  }

  return await addDoc(collection(db, 'inviteApplications'), {
    ...data,
    level: 1,
    status: 'pending',
    createdAt: Timestamp.now(),
  });
}
