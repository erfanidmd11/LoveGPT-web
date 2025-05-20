import React, { useState, useEffect } from 'react';
import { Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert, View, Text } from 'react-native';
import { setupRecaptcha, sendOtp, confirmOtp } from '../lib/authUtils';

interface OtpVerificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPhoneVerified: (phone: string, confirmation: any) => void;
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({ isVisible, onClose, onPhoneVerified }) => {
  const [otp, setOtp] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+15555551111'); // Firebase test number
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setupRecaptcha();
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      Alert.alert('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setStatus('Sending OTP...');

    try {
      const confirmation = await sendOtp(phoneNumber);
      window.confirmationResult = confirmation;
      setStatus('OTP sent. Enter the code.');
    } catch (error: any) {
      console.error('OTP Error:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP');
      setStatus('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    setStatus('Verifying...');

    try {
      const result = await confirmOtp(otp);
      onPhoneVerified(phoneNumber, result);
      onClose();
    } catch (error: any) {
      console.error('OTP Verification Error:', error);
      Alert.alert('Error', error.message || 'Verification failed');
      setStatus('Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10 }}>
          Enter your phone number
        </Text>
        <TextInput
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+15555551111"
          keyboardType="phone-pad"
        />
        <TouchableOpacity onPress={handleSendOtp} style={{ marginBottom: 20, backgroundColor: '#007bff', padding: 12 }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Send OTP</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 18, marginBottom: 8 }}>Enter OTP</Text>
        <TextInput
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          value={otp}
          onChangeText={setOtp}
          placeholder="123456"
          keyboardType="number-pad"
        />

        <TouchableOpacity onPress={handleVerifyOtp} style={{ backgroundColor: '#28a745', padding: 12 }}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', textAlign: 'center' }}>Verify</Text>}
        </TouchableOpacity>

        <Text style={{ marginTop: 10, color: 'gray' }}>{status}</Text>
      </View>

      <div id="recaptcha-container"></div>
    </Modal>
  );
};

export default OtpVerificationModal;
