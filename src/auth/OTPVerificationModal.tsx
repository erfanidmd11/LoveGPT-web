import React, { useState } from 'react';
import { Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert, View, Text } from 'react-native';
import { useHistory } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase/firebaseConfig';  // Ensure proper import for Firestore

interface OtpVerificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPhoneVerified: (phone: string, confirmation: any) => void; // Callback for when OTP is verified
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({ isVisible, onClose, onPhoneVerified }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>(''); 
  const history = useHistory();

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setStatus('Verifying OTP...');

    const confirmationResult = window.confirmationResult;

    try {
      // In dev mode, we skip OTP and use a test user
      if (__DEV__) {
        console.log('Dev mode: Skipping OTP and reCAPTCHA');
        
        // Automatically skip OTP validation in dev mode
        window.confirmationResult = { 
          confirm: () => Promise.resolve({ user: { uid: 'test-user-id', phoneNumber: '+15555555555' } })
        };
        onPhoneVerified('+15555555555', window.confirmationResult);
        onClose();  // Close the modal after the phone is verified
      } else {
        // In production, use OTP and reCAPTCHA
        const appVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
        window.recaptchaVerifier = appVerifier; // Store reCAPTCHA instance

        const confirmation = await signInWithPhoneNumber(auth, `+1${otp}`, appVerifier);
        window.confirmationResult = confirmation;
        onPhoneVerified(`+1${otp}`, confirmation); // Send the confirmation result to the parent component
        onClose(); // Close the modal
      }
    } catch (error: any) {
      setStatus('Error: ' + error.message);
      Alert.alert('Invalid OTP', 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 12 }}>
          Enter the code sent to your phone
        </Text>
        <TextInput
          style={{ padding: 10, borderWidth: 1, marginBottom: 12, borderRadius: 8 }}
          value={otp}
          onChangeText={setOtp}
          placeholder="6-digit OTP"
          maxLength={6}
        />
        <TouchableOpacity onPress={handleVerifyOtp} style={{ padding: 12, backgroundColor: '#007bff', borderRadius: 8 }}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', textAlign: 'center' }}>Verify OTP</Text>}
        </TouchableOpacity>
      </View>

      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </Modal>
  );
};

export default OtpVerificationModal;

