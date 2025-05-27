import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  VStack,
  useToast
} from '@chakra-ui/react';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { setupRecaptcha, sendOtp } from '@/lib/authUtils';

interface PhoneEntryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPhoneVerified: (phone: string, confirmation: any) => void;
}

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: any;
  }
}


const PhoneEntryModal: React.FC<PhoneEntryModalProps> = ({
  isVisible,
  onClose,
  onPhoneVerified
}) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const auth = getAuth();

  const isDev = process.env.NODE_ENV !== 'production';

  const cleanPhone = (phone: string) => phone.replace(/\D/g, '');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setupRecaptcha(); // setup Firebase Recaptcha (no-op in dev)
    }
  }, []);

  const handleSendOTP = async () => {
    const cleanedPhone = cleanPhone(phone);
    if (!cleanedPhone || cleanedPhone.length < 10) {
      toast({ status: 'error', description: 'Please enter a valid phone number.' });
      return;
    }

    setLoading(true);

    try {
      if (isDev) {
        console.log('Dev mode: Skipping OTP and reCAPTCHA');
        window.confirmationResult = {
          confirm: () => Promise.resolve({ user: { uid: 'test-user-id', phoneNumber: cleanedPhone } })
        };
        onPhoneVerified(cleanedPhone, window.confirmationResult);
        toast({ status: 'success', description: '✅ Dev login successful' });
        onClose();
      } else {
        const confirmation = await sendOtp(`+1${cleanedPhone}`);
        window.confirmationResult = confirmation;
        onPhoneVerified(cleanedPhone, confirmation);
        toast({ status: 'success', description: 'OTP sent!' });
        onClose();
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({ status: 'error', description: error.message || 'Failed to send OTP.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isVisible} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter Your Phone Number</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Input
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />
            <div id="recaptcha-container" />
            <Button
              onClick={handleSendOTP}
              isLoading={loading}
              colorScheme="pink"
              w="full"
            >
              Send OTP
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PhoneEntryModal;
