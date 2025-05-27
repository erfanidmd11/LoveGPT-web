import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import StyledTextInput from '@/components/common/StyledTextInput';
import NavigationButtons from '@/components/common/NavigationButtons';
import { submitWaitlistRequest } from '../firebase/waitlist';
import { db } from '../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function WaitlistRequest() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    instagram: '',
    location: '',
    reason: '',
    heardFrom: '',
    referredBy: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.lastName) newErrors.lastName = 'Last name is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.reason) newErrors.reason = 'Please explain why you want to join';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const requestId = await submitWaitlistRequest(form);
      await setDoc(doc(db, 'waitlistRequests', requestId), {
        ...form,
        createdAt: new Date(),
      });

      Alert.alert(
        'You’re on our radar! 💌',
        `Your request has been received.\n\nWhen we’re ready to open more doors, you’ll be among the first to know. Keep an eye on your inbox — and don’t forget to check spam folders (sometimes ARIA’s magic lands there ✨).`
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not submit your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const token = process.env.NEXT_PUBLIC_IPINFO_TOKEN;
        const response = await fetch(`https://ipinfo.io/json?token=${token}`);
        const data = await response.json();
        const locationString = `${data.city}, ${data.region}, ${data.country}`;
        setForm((prev) => ({ ...prev, location: locationString }));
      } catch (error) {
        console.error('Failed to fetch location:', error);
        setForm((prev) => ({ ...prev, location: 'Location unavailable' }));
      }
    };

    fetchLocation();
  }, []);

  const placeholders: Record<string, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone Number',
    email: 'Email',
    instagram: 'Instagram, Facebook or X handle(s)',
    location: 'Location (auto-filled)',
    reason: 'Why do you want to join LoveGPT?',
    heardFrom: 'How did you hear about us?',
    referredBy: 'Who referred you? (optional)',
  };

  return (
    <Pressable onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>Join the Waitlist</Text>

            <View style={styles.ariaContainer}>
              <Image source={require('@/assets/aria-avatar.png')} style={styles.ariaAvatar} />
              <Text style={styles.ariaText}>
                You're in the right place ✨ Just because you weren’t invited (yet) doesn’t mean
                you're not important...
              </Text>
              <Text style={styles.ariaText}>
                Know someone already vibing inside? Don’t be shy — ask them for their invite. 🌟 ...
              </Text>
              <Text style={styles.ariaSignature}>— ARIA 🌸</Text>
            </View>

            {Object.keys(form).map((field) => (
              <View key={field} style={styles.inputWrapper}>
                <StyledTextInput
                  style={errors[field] && styles.errorInput}
                  placeholder={placeholders[field]}
                  value={form[field]}
                  onChangeText={(value: string) => handleChange(field, value)}
                  multiline={field === 'reason'}
                  numberOfLines={field === 'reason' ? 4 : 1}
                />
                {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
              </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
              <Text style={styles.buttonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <NavigationButtons
            onBack={() => window.history.back()}
            showNext={false}
          />
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fcfc',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#111',
  },
  ariaContainer: {
    backgroundColor: '#fff8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#f472b6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  ariaAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  ariaText: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  ariaSignature: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f472b6',
    fontStyle: 'italic',
  },
  inputWrapper: {
    marginBottom: 18,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: 'red',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
