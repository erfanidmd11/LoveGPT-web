// src/components/Onboarding.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { registerReferral } from '@/lib/referrals'; // ✅ use shared referral chain builder

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [referralCode, setReferralCode] = useState('');
  const [userId, setUserId] = useState(''); // 🔒 Replace with actual UID in real usage

  useEffect(() => {
    // Extract referral code from location.state (e.g. passed during navigation)
    if (location.state && location.state.referralCode) {
      setReferralCode(location.state.referralCode);
    }

    // TODO: Replace with actual authenticated user's UID
    // Example: setUserId(auth.currentUser?.uid || '');
  }, [location.state]);

  const handleReferralSubmit = async () => {
    if (!referralCode) {
      Alert.alert('Please enter a referral code.');
      return;
    }

    try {
      // Look up user by referral code
      const queryRef = doc(db, 'referralCodes', referralCode); // 🔁 or use mapping
      const snap = await getDoc(queryRef);

      if (!snap.exists()) {
        Alert.alert('Invalid referral code.');
        return;
      }

      const referrerId = snap.data().userId;
      if (!referrerId) {
        Alert.alert('Invalid referral reference.');
        return;
      }

      // ✅ Register the referral (builds up to 5-level chain)
      await registerReferral(userId, referrerId);

      Alert.alert('Referral code applied successfully!');
      navigate('/next-step');
    } catch (error) {
      console.error('Referral error:', error);
      Alert.alert('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Onboarding Process</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Referral Code"
        value={referralCode}
        onChangeText={setReferralCode}
      />
      <Button title="Submit" onPress={handleReferralSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
});

export default Onboarding;
