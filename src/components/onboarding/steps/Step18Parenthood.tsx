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

export default function Step18Parenthood() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);

  const parenthoodQuestions = [
    { key: 'desireChildren', text: 'I want to have biological or adopted children someday.' },
    { key: 'adoptionOpen', text: 'I am open to non-traditional family paths like adoption.' },
    {
      key: 'cultureImportance',
      text: 'Passing on my culture and traditions is very important to me.',
    },
    {
      key: 'parentingStyle',
      text: 'I envision myself as a nurturing, structured, or independent parenting style.',
    },
    { key: 'flexibility', text: 'I can adapt my parenting dreams if life circumstances change.' },
    {
      key: 'partnerAlignment',
      text: 'Having a partner who shares my vision of family is crucial.',
    },
  ];

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step18Parenthood').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    const loadParenthoodAnswers = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.parenthoodAnswers) {
            setAnswers(data.parenthoodAnswers);
            onboardingMemory.parenthoodAnswers = data.parenthoodAnswers;
          }
        }
      } catch (err) {
        console.error('Error loading parenthood answers:', err);
      }
    };
    loadParenthoodAnswers();
  }, [uid]);

  const toggleAnswer = async (questionKey: string, value: string) => {
    const updatedAnswers = {
      ...answers,
      [questionKey]: value,
    };
    setAnswers(updatedAnswers);
    onboardingMemory.parenthoodAnswers = updatedAnswers; // Update local memory

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            parenthoodAnswers: updatedAnswers,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving parenthood answer:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step18', values);
      await saveAnswerToFirestore(uid, 'Step18', values);
    }
    const allAnswered = parenthoodQuestions.every((q) => answers[q.key]);
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
          parenthoodAnswers: answers,
          onboardingStep: 18,
        },
        { merge: true }
      );

      onboardingMemory.parenthoodAnswers = answers; // Save locally
      router.replace("/onboarding/" + 'Step19LoveLanguages', { uid }.toLowerCase() + "?uid=" + uid);
    } catch (error) {
      console.error('Error saving parenthood data:', error);
      Alert.alert('Error', 'Could not save your family vision. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getSmartCue = () => {
    if (!Object.keys(answers).length) {
      return '🌟 Understanding your dreams around family gives ARIA deeper insight into what home means to you.';
    }
    if (answers.desireChildren === 'Agree') {
      return '🍼 Dreaming of parenthood is a sacred fire — ARIA will help you build that legacy wisely.';
    }
    if (answers.adoptionOpen === 'Agree') {
      return '🌈 Your openness to non-traditional paths shows a heart ready for unconditional love.';
    }
    if (answers.cultureImportance === 'Agree') {
      return '🌍 Your traditions matter — ARIA will help you pass them forward with pride and grace.';
    }
    if (answers.parentingStyle === 'Agree') {
      return '🌱 Your parenting vision shapes the future — ARIA will help you nurture strong roots and wings.';
    }
    if (answers.flexibility === 'Agree') {
      return '🌻 Life changes — your flexibility is your superpower. ARIA will help you adapt with grace.';
    }
    if (answers.partnerAlignment === 'Agree') {
      return '💑 Shared family dreams create deep bonds — ARIA will help you protect and honor that vision.';
    }
    return '✨ Family is created by heart, dreams, and resilience — not just biology.';
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
              <ProgressBar current={18} total={32} />
              <Text style={styles.progressText}>Step 18 of 32 — Parenthood Vision</Text>

              <Text style={styles.title}>How You Envision Family & Parenthood</Text>

              {parenthoodQuestions.map((q) => (
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
