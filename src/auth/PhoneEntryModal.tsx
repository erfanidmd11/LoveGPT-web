import React, { useState, useEffect } from 'react';
import { Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert, View, Text } from 'react-native';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig'; // Firebase configuration

interface PhoneEntryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPhoneVerified: (phone: string, confirmation: any) => void; // Callback for when OTP is verified
}

const PhoneEntryModal: React.FC<PhoneEntryModalProps> = ({ isVisible, onClose, onPhoneVerified }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Clean the phone number to ensure it has the correct format
  const cleanPhone = (phone: string) => {
    return phone.replace(/\D/g, ''); // Remove all non-digit characters
  };

  const handleSendOTP = async () => {
    const cleanedPhone = cleanPhone(phone);

    // Validate phone number
    if (!cleanedPhone || cleanedPhone.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number.');
      return;
    }

    setLoading(true);

    try {
      if (__DEV__) {
        // In dev mode, skip OTP and reCAPTCHA, use test users
        console.log('Dev mode: Skipping OTP and reCAPTCHA');
        
        // Automatically skip OTP validation in dev mode
        window.confirmationResult = { 
          confirm: () => Promise.resolve({ user: { uid: 'test-user-id', phoneNumber: cleanedPhone } })
        };
        onPhoneVerified(cleanedPhone, window.confirmationResult);
        onClose();  // Close the phone entry modal
      } else {
        // In production, send OTP and use reCAPTCHA
        const appVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
        window.recaptchaVerifier = appVerifier; // Store reCAPTCHA instance

        const confirmation = await signInWithPhoneNumber(auth, `+1${cleanedPhone}`, appVerifier);
        window.confirmationResult = confirmation;
        onPhoneVerified(cleanedPhone, confirmation); // Call the callback when OTP is ready
        onClose(); // Close the phone entry modal
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Failed to send OTP');
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
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', textAlign: 'center' }}>Send OTP</Text>}
        </TouchableOpacity>
      </View>

      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </Modal>
  );
};

export default PhoneEntryModal;



