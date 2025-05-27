import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Keyboard,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import NavigationButtons from '@/components/common/NavigationButtons';
import { useRouter } from 'next/router';

type SupportForm = {
  firstName: string;
  lastName: string;
  email: string;
  oldPhone: string;
  newPhone: string;
  explanation: string;
};

export default function SupportRequest() {
  const [form, setForm] = useState<SupportForm>({
    firstName: '',
    lastName: '',
    email: '',
    oldPhone: '',
    newPhone: '',
    explanation: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SupportForm, string>>>({});
  const router = useRouter();

  const handleChange = (field: keyof SupportForm, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof SupportForm, string>> = {};
    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.lastName) newErrors.lastName = 'Last name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.oldPhone) newErrors.oldPhone = 'Old phone number is required';
    if (!form.newPhone) newErrors.newPhone = 'New phone number is required';
    if (!form.explanation) newErrors.explanation = 'Please explain the reason';
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    Alert.alert('Request Sent', 'Your request to change phone number has been submitted.');
    // TODO: Send to backend or support team
  };

  const placeholders: Record<keyof SupportForm, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    oldPhone: 'Old Phone Number',
    newPhone: 'New Phone Number',
    explanation: 'Explanation (required)',
  };

  return (
    <Pressable onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>Request to Change Phone Number</Text>

            {(Object.keys(form) as (keyof SupportForm)[]).map((field) => (
              <View key={field} style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, errors[field] && styles.errorInput]}
                  placeholder={placeholders[field]}
                  placeholderTextColor="#555"
                  value={form[field]}
                  onChangeText={(value) => handleChange(field, value)}
                  multiline={field === 'explanation'}
                  numberOfLines={field === 'explanation' ? 4 : 1}
                />
                {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
              </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit Request</Text>
            </TouchableOpacity>
          </ScrollView>

          <NavigationButtons
            onBack={() => router.back()}
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
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 25,
    color: '#111',
  },
  inputWrapper: {
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1.3,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
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
