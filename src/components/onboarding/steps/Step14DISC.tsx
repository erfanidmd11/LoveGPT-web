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

export default function Step14DISC() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);

  const discQuestions = [
    { key: 'dominance', text: 'I like to take charge and lead when working with others.' },
    { key: 'influence', text: 'I enjoy interacting with people and motivating them.' },
    { key: 'steadiness', text: 'I prefer consistency and stable environments.' },
    { key: 'compliance', text: 'I value following rules, standards, and accuracy.' },
    {
      key: 'stressReaction',
      text: 'When stressed, I either dominate situations or withdraw emotionally.',
    },
    {
      key: 'conflictResponse',
      text: 'During conflict, I prefer calm discussions over emotional outbursts.',
    },
  ];

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step14DISC').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    const loadDISCAnswers = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.discAnswers) {
            setAnswers(data.discAnswers);
            onboardingMemory.discAnswers = data.discAnswers; // Sync local
          }
        }
      } catch (err) {
        console.error('Error loading DISC answers:', err);
      }
    };
    loadDISCAnswers();
  }, [uid]);

  const toggleAnswer = async (questionKey: string, value: string) => {
    const updatedAnswers = {
      ...answers,
      [questionKey]: value,
    };
    setAnswers(updatedAnswers);
    onboardingMemory.discAnswers = updatedAnswers; // Update local memory

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            discAnswers: updatedAnswers,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving DISC answer:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step14', values);
      await saveAnswerToFirestore(uid, 'Step14', values);
    }
    const allAnswered = discQuestions.every((q) => answers[q.key]);
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
          discAnswers: answers,
          onboardingStep: 14,
        },
        { merge: true }
      );

      onboardingMemory.discAnswers = answers; // ✅ Save locally
      router.replace("/onboarding/" + 'Step15CoreValueIndex', { uid }.toLowerCase() + "?uid=" + uid);
    } catch (error) {
      console.error('Error saving DISC data:', error);
      Alert.alert('Error', 'Could not save your DISC profile. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getSmartCue = () => {
    if (!Object.keys(answers).length) {
      return '🌟 Understanding your behavior style helps ARIA guide you toward better love, leadership, and peace.';
    }
    if (answers.dominance === 'Agree') {
      return '🔥 You are a leader — ARIA will help you inspire without overpowering.';
    }
    if (answers.influence === 'Agree') {
      return '💬 Your influence is magnetic — ARIA will teach you to connect without burning out.';
    }
    if (answers.steadiness === 'Agree') {
      return '🌿 Your steady energy anchors others — ARIA will help you protect your peace in chaos.';
    }
    if (answers.compliance === 'Agree') {
      return '📚 You seek structure — ARIA will show you how to flow even inside changing environments.';
    }
    if (answers.stressReaction === 'Agree') {
      return '⚡ Your stress reactions are normal — ARIA will teach you how to stay centered under pressure.';
    }
    if (answers.conflictResponse === 'Agree') {
      return '🕊️ You value peace in conflict — ARIA will help you communicate your truth without fear.';
    }
    return '✨ Your DISC profile shows where your strengths shine brightest.';
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
              <ProgressBar current={14} total={32} />
              <Text style={styles.progressText}>Step 14 of 32 — DISC Assessment</Text>

              <Text style={styles.title}>Discover Your Behavior Style</Text>

              {discQuestions.map((q) => (
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
