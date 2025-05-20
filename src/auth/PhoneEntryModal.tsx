import React, { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  View,
  Text
} from 'react-native';
import { setupRecaptcha, sendOtp } from '../lib/authUtils';

interface PhoneEntryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPhoneVerified: (phone: string, confirmation: any) => void;
}

declare global {
  interface Window {
    recaptchaVerifier?: any;
    confirmationResult?: {
      confirm: (code: string) => Promise<any>;
    };
  }
}

const PhoneEntryModal: React.FC<PhoneEntryModalProps> = ({
  isVisible,
  onClose,
  onPhoneVerified
}) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanPhone = (phone: string) => phone.replace(/\D/g, '');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setupRecaptcha(); // ✅ always ensures reCAPTCHA is ready
    }
  }, []);

  const handleSendOTP = async () => {
    const cleanedPhone = cleanPhone(phone);
    if (!cleanedPhone || cleanedPhone.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number.');
      return;
    }

    setLoading(true);

    try {
      if (__DEV__) {
        console.log('Dev mode: Skipping OTP and reCAPTCHA');
        window.confirmationResult = {
          confirm: () => Promise.resolve({ user: { uid: 'test-user-id', phoneNumber: cleanedPhone } })
        };
        onPhoneVerified(cleanedPhone, window.confirmationResult);
        onClose();
      } else {
        const confirmation = await sendOtp(`+1${cleanedPhone}`);
        window.confirmationResult = confirmation;
        onPhoneVerified(cleanedPhone, confirmation);
        onClose();
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 12 }}>
          Enter your phone number
        </Text>
        <TextInput
          style={{ padding: 10, borderWidth: 1, marginBottom: 12, borderRadius: 8 }}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone number"
          keyboardType="phone-pad"
        />
        <TouchableOpacity
          onPress={handleSendOTP}
          style={{ padding: 12, backgroundColor: '#007bff', borderRadius: 8 }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', textAlign: 'center' }}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Firebase reCAPTCHA mount target */}
      <div id="recaptcha-container"></div>
    </Modal>
  );
};

export default PhoneEntryModal;
