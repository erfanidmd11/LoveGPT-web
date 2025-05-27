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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'next/router';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import Footer from '@/components/common/Footer';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import onboardingMemory from '@/lib/onboardingMemory';

export default function Step15CoreValueIndex() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);

  const cviQuestions = [
    { key: 'problemSolver', text: 'I am driven to solve problems and make things work.' },
    { key: 'empowerOthers', text: 'I thrive when helping others grow and succeed.' },
    {
      key: 'systemBuilder',
      text: 'I find fulfillment in building systems that others can rely on.',
    },
    {
      key: 'visionary',
      text: 'I love creating visions for the future and inspiring others toward them.',
    },
    { key: 'guardian', text: 'I feel most fulfilled protecting people and values I care about.' },
    { key: 'adventurer', text: 'I seek adventure and growth, even if it means taking risks.' },
  ];

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step15CoreValueIndex').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    const loadCVIAnswers = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.cviAnswers) {
            setAnswers(data.cviAnswers);
            onboardingMemory.cviAnswers = data.cviAnswers; // Sync local
          }
        }
      } catch (err) {
        console.error('Error loading CVI answers:', err);
      }
    };
    loadCVIAnswers();
  }, [uid]);

  const toggleAnswer = async (questionKey: string, value: string) => {
    const updatedAnswers = {
      ...answers,
      [questionKey]: value,
    };
    setAnswers(updatedAnswers);
    onboardingMemory.cviAnswers = updatedAnswers; // Local memory sync

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            cviAnswers: updatedAnswers,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving CVI answer:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step15', values);
      await saveAnswerToFirestore(uid, 'Step15', values);
    }
    const allAnswered = cviQuestions.every((q) => answers[q.key]);
    if (!allAnswered) {
      Alert.alert('Missing Info', 'Please answer all questions to continue.');
      return;
    }

    if (!uid) {
      Alert.alert('Error', 'Missing user ID. Cannot save.');
      return;
    }

    setSaving(true);

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          cviAnswers: answers,
          onboardingStep: 15,
        },
        { merge: true }
      );

      onboardingMemory.cviAnswers = answers; // Save locally
      router.replace("/onboarding/" + 'Step16BigFive', { uid }.toLowerCase() + "?uid=" + uid); // Move to next step
    } catch (error) {
      console.error('Error saving CVI data:', error);
      Alert.alert('Error', 'Could not save your Core Value Index. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getSmartCue = () => {
    if (!Object.keys(answers).length) {
      return '🌟 Knowing your Core Values lets ARIA guide you toward your most fulfilled future.';
    }
    if (answers.problemSolver === 'Agree') {
      return '🛠️ You’re a born fixer — ARIA will guide you to meaningful challenges worth solving.';
    }
    if (answers.empowerOthers === 'Agree') {
      return `🌱 Helping others thrive is your soul's work — ARIA will ensure you grow while lifting others.`;
    }
    if (answers.systemBuilder === 'Agree') {
      return '🏛️ You build the invisible frameworks others live by — ARIA will help you scale your vision.';
    }
    if (answers.visionary === 'Agree') {
      return '🔭 Your dreams shape reality — ARIA will help you keep your inner fire alive through action.';
    }
    if (answers.guardian === 'Agree') {
      return '🛡️ Your loyalty creates safety — ARIA will help you protect without draining yourself.';
    }
    if (answers.adventurer === 'Agree') {
      return '🌍 Your craving for growth and risk-taking is a gift — ARIA will guide you to meaningful adventures.';
    }
    return '✨ Every answer you give becomes another piece of the map toward your best life.';
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
              <ProgressBar current={15} total={32} />
              <Text style={styles.progressText}>Step 15 of 32 — Core Value Index</Text>

              <Text style={styles.title}>Discover What Fuels Your Fulfillment</Text>

              {cviQuestions.map((q) => (
                <View key={q.key} style={styles.questionBlock}>
                  <Text style={styles.question}>{q.text}</Text>
                  {['Agree', 'Somewhat', 'Disagree'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.option, answers[q.key] === option && styles.selected]}
                      onPress={() => toggleAnswer(q.key, option)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          answers[q.key] === option && styles.selectedText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
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
          nextDisabled={!Object.keys(answers).length}
          saving={saving}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 20,
  },
  questionBlock: {
    marginBottom: 24,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  selected: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  optionText: {
    fontSize: 16,
    color: '#4B5563',
  },
  selectedText: {
    color: '#fff',
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
