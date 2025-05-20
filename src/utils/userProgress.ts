// src/utils/userProgress.ts
import { db } from '../firebase/firebaseConfig';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const saveUserProgress = async (phone: string, step: string) => {
  try {
    const userRef = doc(db, 'users', phone);
    await updateDoc(userRef, {
      lastVisited: serverTimestamp(),
      currentStep: step,  // Save the current step in the user document
    });
  } catch (error) {
    console.error('Error saving user progress: ', error);
  }
};
