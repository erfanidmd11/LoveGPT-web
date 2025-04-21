import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Checks whether a phone number already exists in the Firestore 'users' collection.
 * @param phoneNumber - The full phone number in E.164 format (e.g. +1234567890)
 * @returns Promise<boolean> - Returns true if phone number exists, otherwise false.
 */
export const checkIfPhoneExists = async (phoneNumber: string): Promise<boolean> => {
  if (!phoneNumber) return false;

  try {
    const q = query(collection(db, 'users'), where('phoneNumber', '==', phoneNumber));
    const result = await getDocs(q);
    return !result.empty;
  } catch (err) {
    console.error('🔥 Error checking phone existence:', err);
    return false;
  }
};
