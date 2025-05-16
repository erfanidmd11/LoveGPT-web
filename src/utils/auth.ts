// utils/auth.ts
import { getAuth, signOut } from 'firebase/auth';

export const getUserSession = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? { phone: user.phoneNumber, profileComplete: user.profileComplete } : null;
};

export const logout = () => {
  const auth = getAuth();
  signOut(auth).catch((error) => console.error('Logout failed', error));
};
