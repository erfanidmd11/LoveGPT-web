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
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import Footer from '@/components/common/Footer';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import onboardingMemory from '@/lib/onboardingMemory';

export default function Step13Enneagram() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);

  const enneagramQuestions = [
    { key: 'fear', text: 'I fear being vulnerable or appearing weak.' },
    { key: 'desire', text: 'I crave being seen and valued for my authentic self.' },
    { key: 'selfImage', text: 'I often define my worth through achievement or caring for others.' },
    { key: 'growthFocus', text: 'I strive to balance independence with emotional connection.' },
    { key: 'reaction', text: 'When stressed, I either withdraw emotionally or act impulsively.' },
    {
      key: 'supportNeed',
      text: 'I feel safest when I know emotional support is readily available.',
    },
  ];

  useEffect(() => {
    const loadEnneagramAnswers = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.enneagramAnswers) {
            setAnswers(data.enneagramAnswers);
            onboardingMemory.enneagramAnswers = data.enneagramAnswers; // Local sync
          }
        }
      } catch (err) {
        console.error('Error loading Enneagram answers:', err);
      }
    };
    loadEnneagramAnswers();
  }, [uid]);

  const toggleAnswer = async (questionKey: string, value: string) => {
    const updatedAnswers = {
      ...answers,
      [questionKey]: value,
    };
    setAnswers(updatedAnswers);
    onboardingMemory.enneagramAnswers = updatedAnswers; // ✅ Update local memory

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            enneagramAnswers: updatedAnswers,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving Enneagram answer:', error);
      }
    }
  };

  const handleContinue = async () => {
    const allAnswered = enneagramQuestions.every((q) => answers[q.key]);
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
          enneagramAnswers: answers,
          onboardingStep: 13,
        },
        { merge: true }
      );

      onboardingMemory.enneagramAnswers = answers; // ✅ Save locally
      navigation.replace('Step14DISC', { uid });
    } catch (error) {
      console.error('Error saving Enneagram data:', error);
      Alert.alert('Error', 'Could not save your answers. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getSmartCue = () => {
    if (!Object.keys(answers).length) {
      return '🌟 Understanding your core motivations gives ARIA a deeper window into your heart.';
    }
    if (answers.fear === 'Agree') {
      return '🛡️ Vulnerability is not weakness — ARIA will teach you how to trust without fear.';
    }
    if (answers.desire === 'Agree') {
      return '💖 Your craving to be seen authentically will become your greatest gift.';
    }
    if (answers.selfImage === 'Agree') {
      return '🏆 Achievements and caring are beautiful — but ARIA will help you separate self-worth from doing.';
    }
    if (answers.growthFocus === 'Agree') {
      return '🌱 Independence and emotional connection can co-exist — ARIA will help you master the dance.';
    }
    if (answers.reaction === 'Agree') {
      return '🔥 Your reactions to stress reveal where you’re being invited to grow next.';
    }
    if (answers.supportNeed === 'Agree') {
      return '🤝 Seeking emotional support is strength — not weakness — ARIA will ensure you are never alone.';
    }
    return '✨ True self-awareness is the foundation for lifelong transformation.';
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
              <ProgressBar current={13} total={32} />
              <Text style={styles.progressText}>Step 13 of 32 — Enneagram</Text>

              <Text style={styles.title}>Explore Your Inner Drives</Text>

              {enneagramQuestions.map((q) => (
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

        <Footer
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
