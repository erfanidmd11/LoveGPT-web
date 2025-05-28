// src/utils/auth.ts
import { auth } from '@/lib/firebase';

export const getUserSession = () => {
  const user = auth.currentUser;

  if (!user) return null;

  const phone = (user as any).phone || null;
  const profileComplete = (user as any).profileComplete || false;
  const onboardingComplete = (user as any).onboardingComplete || false;

  return {
    phone,
    profileComplete,
    onboardingComplete,
  };
};
