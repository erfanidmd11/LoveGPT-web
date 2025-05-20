// src/utils/auth.ts
export const getUserSession = () => {
  // Simulate fetching session or user data (replace this with actual authentication logic)
  const user = getUserFromAuth();  // Replace with your actual user fetching logic (e.g., Firebase Auth)
  
  // Ensure that 'onboardingComplete' exists in the session object
  return {
    phone: user.phone,
    profileComplete: user.profileComplete,
    onboardingComplete: user.onboardingComplete || false,  // Add default value to handle undefined case
  };
};
