import React, { useState, useEffect } from 'react';
import PhoneEntryModal from './PhoneEntryModal'; // Modal for phone entry
import OtpVerificationModal from './OtpVerificationModal'; // Modal for OTP verification
import InvitationModal from './InvitationModal'; // Modal for invitation code
import { useHistory } from 'react-router-dom';
import { getUserSession } from '@/utils/auth';  // Assume you have a helper function to fetch the logged-in user session

const AuthFlow: React.FC = () => {
  const history = useHistory();
  const [phoneModalVisible, setPhoneModalVisible] = useState(true); // Start with the phone entry modal
  const [otpModalVisible, setOtpModalVisible] = useState(false); // OTP modal will be hidden initially
  const [invitationModalVisible, setInvitationModalVisible] = useState(false); // Invitation code modal

  // Function to handle transitions between modals
  const handlePhoneModalClose = (phone: string) => {
    setPhoneModalVisible(false);
    setOtpModalVisible(true); // Show OTP modal after phone entry
    // Optionally pass phone number to OTP modal
  };

  const handleOtpModalClose = async (confirmation: any, phone: string) => {
    setOtpModalVisible(false);
    
    // Assuming after OTP confirmation, we check user status
    const userSession = getUserSession(); // Fetch current user session
    if (userSession) {
      // If user is logged in and onboarding is complete, redirect to dashboard
      if (userSession.onboardingComplete) {
        history.push('/dashboard'); // Navigate to the dashboard
      } else {
        // Otherwise, continue with onboarding or prompt for the invitation code
        setInvitationModalVisible(true); // Show Invitation Modal
      }
    } else {
      // If the user is new, show the invitation code modal
      setInvitationModalVisible(true);
    }
  };

  const handleInvitationModalClose = (inviteCode: string) => {
    setInvitationModalVisible(false);
    
    // After invitation code is entered or validated, navigate to the appropriate step
    if (inviteCode) {
      history.push('/onboarding/step1'); // Navigate to the first onboarding step
    } else {
      history.push('/dashboard'); // If the user doesn't need to enter a code, go to dashboard
    }
  };

  // Check user session on initial load (if needed)
  useEffect(() => {
    const userSession = getUserSession();
    if (userSession) {
      // Check if user is logged in and already has completed onboarding
      if (userSession.onboardingComplete) {
        history.push('/dashboard'); // Navigate directly to the dashboard
      } else {
        setOtpModalVisible(true); // If user is logged in but onboarding is not complete, show OTP modal
      }
    }
  }, []);

  return (
    <div>
      <PhoneEntryModal
        isVisible={phoneModalVisible}
        onClose={handlePhoneModalClose}  // Close phone entry and show OTP modal
      />
      <OtpVerificationModal
        isVisible={otpModalVisible}
        onClose={handleOtpModalClose}  // After OTP verification, decide next step
      />
      <InvitationModal
        isVisible={invitationModalVisible}
        onClose={handleInvitationModalClose}  // After invitation code submission, navigate to appropriate step
      />
    </div>
  );
};

export default AuthFlow;
