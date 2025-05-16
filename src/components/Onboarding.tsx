import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { validateReferralCode } from '../firebase/admin'; // ✅ if available

export default function Onboarding() {
  const navigation = useNavigation();
  const route = useRoute();
  const { phone } = route.params;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');

  // Handles the form submission
  const handleSubmit = async () => {
    if (!fullName || !email) {
      Alert.alert('Missing Info', 'Please enter your name and email.');
      return;
    }

    const userRef = doc(db, 'users', phone);

    try {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        Alert.alert('Error', 'User not found in Firestore.');
        return;
      }

      // Optional: Validate referral code if entered
      let referredBy = null;
      if (referralCode) {
        const valid = await validateReferralCode(referralCode.trim().toLowerCase());
        if (!valid) {
          Alert.alert('Invalid Code', 'Referral code is not valid.');
          return;
        }
        referredBy = referralCode.trim().toLowerCase();
      }

      const firstName = fullName.trim().split(' ')[0];
      const lastName = fullName.trim().split(' ').slice(1).join(' ') || '';

      await updateDoc(userRef, {
        fullName,
        email,
        firstName,
        lastName,
        referredBy,
        onboardingComplete: true,
      });

      Alert.alert('Success', 'Profile completed!');
      navigation.replace('UserDashboard', { phone });
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong.');
    }
  };

  return (
    <Pressable onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View>
          <Text style={styles.title}>Complete Your Profile</Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#555"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#555"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Referral Code (optional)"
            placeholderTextColor="#555"
            style={styles.input}
            autoCapitalize="none"
            value={referralCode}
            onChangeText={setReferralCode}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1.2,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#111',
  },
  button: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
