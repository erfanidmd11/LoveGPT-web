import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'next/router';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import Footer from '@/components/common/Footer';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import onboardingMemory from '@/lib/onboardingMemory';

const options = [
  { label: 'Very Open – I love trying new things and exploring unknowns', value: 'very' },
  { label: 'Open – I enjoy variety but need a little comfort zone', value: 'moderate' },
  { label: 'Selective – I prefer what I know and trust', value: 'selective' },
  { label: 'Cautious – New situations make me uneasy', value: 'low' },
];

export default function Step31OpennessLevel() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [openness, setOpenness] = useState('');

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step31OpennessLevel').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    if (uid) {
      loadOpennessLevel();
    }
  }, [uid]);

  const loadOpennessLevel = async () => {
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data?.opennessLevel) {
          setOpenness(data.opennessLevel);
          onboardingMemory.opennessLevel = data.opennessLevel;
        }
      }
    } catch (err) {
      console.error('Error loading openness level:', err);
    }
  };

  const handleSelect = (value: string) => {
    setOpenness(value);
    onboardingMemory.opennessLevel = value;
  };

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step31', values);
      await saveAnswerToFirestore(uid, 'Step31', values);
    }
    if (!openness) {
      Alert.alert('Choose One', 'Please select how open you consider yourself.');
      return;
    }

    if (!uid) {
      Alert.alert('Error', 'Missing user ID. Cannot save.');
      return;
    }

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          opennessLevel: openness,
          onboardingStep: 31,
          'ARIA.dynamicProfile.opennessLevel': openness,
        },
        { merge: true }
      );

      onboardingMemory.opennessLevel = openness;
      onboardingMemory.lastStepCompleted = 31;

      router.replace("/onboarding/" + 'Step32ProfileSetup', { uid }.toLowerCase() + "?uid=" + uid); // ✅ Move to Step 32
    } catch (error) {
      console.error('Error saving openness level:', error);
      Alert.alert('Error', 'Could not save your response. Try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getSmartCue = () => {
    if (!openness) {
      return '🌱 Openness affects your ability to welcome love, change, and destiny. ARIA will help you blossom.';
    }
    if (openness === 'very') {
      return '🚀 Your spirit is adventurous! ARIA will match you with opportunities for deep, transformative growth.';
    }
    if (openness === 'moderate') {
      return '🧠 You enjoy balance — familiar roots with a spark of adventure. ARIA will guide you carefully.';
    }
    if (openness === 'selective') {
      return '🛡️ Your heart treasures trust. ARIA will help you expand your horizons safely and wisely.';
    }
    if (openness === 'low') {
      return '🕊️ Caution is wisdom. ARIA will support you gently as you stretch into new possibilities at your own pace.';
    }
    return '✨ Openness shapes your next chapter. ARIA will be your steady guide.';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 220 }}>
            <View style={styles.container}>
              <ProgressBar current={31} total={32} />
              <Text style={styles.progressText}>Step 31 of 32 — Openness to Experience</Text>

              <Text style={styles.title}>
                How open are you to new experiences, perspectives, and people?
              </Text>

              <View style={styles.options}>
                {options.map(({ label, value }) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => handleSelect(value)}
                    style={[styles.option, openness === value && styles.selected]}
                  >
                    <Text style={[styles.optionText, openness === value && styles.selectedText]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.ariaContainer}>
          <AnimatedValueCue message={getSmartCue()} />
        </View>

        <Footer variant="onboarding"
          onNext={handleContinue}
          onBack={handleBack}
          nextDisabled={!openness}
          saving={false}
          nextLabel="Next"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111827',
  },
  options: {
    marginBottom: 24,
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: '#fbcfe8',
    borderColor: '#ec4899',
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
  },
  selectedText: {
    color: '#db2777',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  ariaContainer: {
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 10,
  },
});
