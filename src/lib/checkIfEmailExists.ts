import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Checks if a user with the provided email exists in the Firestore `users` collection.
 * @param email - The email address to look up
 * @returns Promise<boolean> - true if email exists, false otherwise
 */
export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};
