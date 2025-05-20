import React, { useState, useEffect } from 'react';
import PhoneEntryModal from './PhoneEntryModal';  // Modal for phone entry
import OtpVerificationModal from './OtpVerificationModal';  // Modal for OTP verification
import InvitationModal from './InvitationModal';  // Modal for invitation code
import { useNavigate } from 'react-router-dom';  // Use React Router v6 for navigation
import { getUserSession } from '@/utils/auth';  // Helper function to fetch the logged-in user session
import { saveUserProgress } from '@/utils/userProgress';  // Utility to save user progress (if needed)

const AuthFlow: React.FC = () => {
  const navigate = useNavigate();  // Use `useNavigate` hook for React Router v6
  const [phoneModalVisible, setPhoneModalVisible] = useState(true);  // Start with the phone entry modal
  const [otpModalVisible, setOtpModalVisible] = useState(false);  // OTP modal will be hidden initially
  const [invitationModalVisible, setInvitationModalVisible] = useState(false);  // Invitation code modal
  const [phone, setPhone] = useState('');  // Store the phone number

  // Handle the transition from phone entry to OTP modal
  const handlePhoneModalClose = () => {
    setPhoneModalVisible(false);
    setOtpModalVisible(true);  // Show OTP modal after phone entry
  };

  // Handle OTP modal close and user session validation
  const handleOtpModalClose = async () => {
    setOtpModalVisible(false);  // Close OTP modal after OTP validation

    const userSession = getUserSession();  // Fetch current user session
    if (userSession) {
      if (userSession.onboardingComplete) {
        saveUserProgress(userSession.phone, 'pending18');  // Save the user progress before navigating
        navigate('/dashboard', { replace: true });  // Navigate to the dashboard if onboarding is complete
      } else {
        setInvitationModalVisible(true);  // Show Invitation Modal if onboarding is not complete
      }
    } else {
      setInvitationModalVisible(true);  // If the user is new, show the Invitation Modal
    }
  };

  // Handle Invitation Modal close and decide the next action
  const handleInvitationModalClose = () => {
    // Close the invitation modal without using the invite code
    setInvitationModalVisible(false);

    // Navigate to the appropriate step after invitation code submission
    navigate('/onboarding/step1', { replace: true });  // Adjust this if you need to go to a different route
  };

  // Handle phone verified from the modal
  const handlePhoneVerified = (phone: string, confirmation: any) => {
    // Handle phone verification (e.g., store confirmation result, etc.)
    setPhone(phone);
    handlePhoneModalClose();  // Close the phone modal and move to the OTP modal
  };

  // Check user session on initial load
  useEffect(() => {
    const userSession = getUserSession();
    if (userSession) {
      if (userSession.onboardingComplete) {
        navigate('/dashboard', { replace: true });  // Navigate directly to the dashboard if onboarding is complete
      } else {
        setOtpModalVisible(true);  // If user is logged in but onboarding isn't complete, show OTP modal
      }
    }
  }, [navigate]);  // Add `navigate` to the dependency array to ensure correct re-render

  return (
    <div>
      <PhoneEntryModal
        isVisible={phoneModalVisible}
        onClose={handlePhoneModalClose}  // Close phone entry and show OTP modal
        onPhoneVerified={handlePhoneVerified}  // Pass the verified phone number and confirmation to proceed
      />
      <OtpVerificationModal
        isVisible={otpModalVisible}
        onClose={handleOtpModalClose}  // After OTP verification, decide next step (no args passed to onClose)
        onPhoneVerified={handlePhoneVerified}  // Pass the phone verification result to proceed
      />
      <InvitationModal
        isVisible={invitationModalVisible}
        onClose={handleInvitationModalClose}  // After invitation code submission, navigate to appropriate step
      />
    </div>
  );
};

export default AuthFlow;
