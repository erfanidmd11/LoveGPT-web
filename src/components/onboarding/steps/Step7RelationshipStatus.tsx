import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
  Pressable,
} from 'react-native';
import { useRouter } from 'next/router';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import { saveAnswer } from '@/lib/saveAnswer'; // ✅
import Header from '@/components/Header';  // Import Header
import Footer from '@/components/Footer';  // Import Footer

const relationshipOptions = [
  'single',
  'in a relationship',
  'married',
  'separated',
  'divorced',
  'widowed',
  'it’s complicated',
];

export default function Step7RelationshipStatus() {
  const router = useRouter();
  const uid = router.query.uid as string;
  const uid = route?.params?.uid; // ✅ Get UID from route.params

  const [status, setStatus] = useState('');
  const [ageRange, setAgeRange] = useState({ min: '', max: '' });
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step7RelationshipStatus').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    (async () => {
      if (uid) {
        const userRef = doc(db, 'users', uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.firstName) setFirstName(data.firstName);
          if (data?.relationshipStatus) setStatus(data.relationshipStatus);
          if (data?.idealAgeRange) setAgeRange(data.idealAgeRange);
        }
      }
    })();
  }, [uid]);

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step7', values);
      await saveAnswerToFirestore(uid, 'Step7', values);
    }
    if (!status) {
      Alert.alert('Missing Info', 'Please select your relationship status.');
      return;
    }

    if (status === 'single') {
      if (!ageRange.min || !ageRange.max) {
        Alert.alert('Missing Info', 'Please enter your preferred age range for dating.');
        return;
      }

      const minAge = parseInt(ageRange.min, 10);
      const maxAge = parseInt(ageRange.max, 10);
      if (minAge >= maxAge || minAge < 18 || maxAge > 99) {
        Alert.alert('Invalid Range', 'Please enter a valid age range.');
        return;
      }
    }

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          relationshipStatus: status,
          ...(status === 'single' ? { idealAgeRange: ageRange } : {}),
          onboardingStep: 7,
        },
        { merge: true }
      );

      // 💾 Save locally too
      await saveAnswer('relationshipStatus', status);
      if (status === 'single') {
        await saveAnswer('idealAgeRange', ageRange);
      }

      router.replace("/onboarding/" + 'Step8Intentions', {
        uid, // ✅ Pass uid
        relationshipStatus: status, // ✅ Pass selected status
      }.toLowerCase() + "?uid=" + uid);
    } catch (error) {
      console.error('Error saving relationship status:', error);
      Alert.alert('Error', 'Could not save your answer. Try again.');
    }
  };

  const getPersonalizedCue = () => {
    if (!firstName)
      return 'Your relationship status today doesn’t define you — but it helps ARIA guide you more wisely toward love, connection, and self-growth.';

    switch (status) {
      case 'single':
        return `New beginnings, ${firstName}. 🌟 Let’s set your heart’s compass with honesty and joy.`;
      case 'married':
        return `Partnership is a dance, ${firstName}. 💃🕺 Let’s nurture what you've built — and help it thrive.`;
      case 'widowed':
        return `Your story holds tenderness, ${firstName}. 🌿 We'll honor your past while gently exploring new horizons.`;
      case 'divorced':
        return `Rising from change, ${firstName}. 🌅 You're creating a new chapter — on your terms.`;
      case 'separated':
        return `Transition brings opportunity, ${firstName}. 🌻 Let's rebuild with courage and hope.`;
      case 'in a relationship':
        return `Love is a living thing, ${firstName}. 🌱 Let's water it with intention and dreams.`;
      case 'it’s complicated':
        return `Complexity is a portal, ${firstName}. 🔮 Let's bring clarity where confusion lives.`;
      default:
        return `Your story matters, ${firstName}. 🌸 Your relationship status is part of your journey, not your identity.`;
    }
  };

  return (
    <Pressable onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header */}
        <Header />

        <ProgressBar current={7} total={25} />
        <Text style={styles.title}>What’s your current relationship status?</Text>

        <View style={styles.options}>
          {relationshipOptions.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.option, status === s && styles.selected]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.optionText, status === s && styles.selectedText]}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {status === 'single' && (
          <View style={styles.rangeInputs}>
            <TextInput
              style={styles.input}
              placeholder="Ideal minimum age"
              placeholderTextColor="#4b5563"
              keyboardType="numeric"
              value={ageRange.min}
              onChangeText={(val) => setAgeRange({ ...ageRange, min: val })}
              maxLength={2}
            />
            <TextInput
              style={styles.input}
              placeholder="Ideal maximum age"
              placeholderTextColor="#4b5563"
              keyboardType="numeric"
              value={ageRange.max}
              onChangeText={(val) => setAgeRange({ ...ageRange, max: val })}
              maxLength={2}
            />
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        {/* Back Button */}
        <BackButton />

        <AnimatedValueCue key={status} message={getPersonalizedCue()} />

        {/* Footer */}
        <Footer />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  options: {
    marginBottom: 20,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  selected: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  optionText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  rangeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ec4899',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
