import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Save locally for quick access
export const saveAnswer = (key: string, value: string | object): void => {
  if (typeof window !== 'undefined') {
    const storedValue = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(key, storedValue);
  }
};

// Save to Firestore
export async function saveAnswerToFirestore(userId: string, questionId: string, answer: any) {
  const ref = doc(db, 'answers', `${userId}_${questionId}`);
  await setDoc(ref, { answer, updatedAt: new Date() }, { merge: true });
}

// Load from Firestore
export async function getAnswer(userId: string, questionId: string) {
  const ref = doc(db, 'answers', `${userId}_${questionId}`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}
