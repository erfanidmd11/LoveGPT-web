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

export default function Step16BigFive() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);

  const bigFiveQuestions = [
    { key: 'openness', text: 'I enjoy new experiences and trying new things.' },
    { key: 'conscientiousness', text: 'I like to plan ahead and be organized.' },
    {
      key: 'extraversion',
      text: 'I gain energy from social interactions and being around people.',
    },
    { key: 'agreeableness', text: 'I am compassionate and cooperative toward others.' },
    { key: 'neuroticism', text: 'I often feel worried, anxious, or easily stressed.' },
  ];

  useEffect(() => {
    const loadBigFiveAnswers = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.bigFiveAnswers) {
            setAnswers(data.bigFiveAnswers);
            onboardingMemory.bigFiveAnswers = data.bigFiveAnswers; // Sync local memory
          }
        }
      } catch (err) {
        console.error('Error loading Big Five answers:', err);
      }
    };
    loadBigFiveAnswers();

    // Adding header dynamically
    navigation.setOptions({
      headerTitle: 'Big Five Personality',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ marginLeft: 15, color: '#007bff' }}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => alert('Profile Settings')}>
          <Text style={{ marginRight: 15, color: '#007bff' }}>Settings</Text>
        </TouchableOpacity>
      ),
    });
  }, [uid, navigation]);

  const toggleAnswer = async (questionKey: string, value: string) => {
    const updatedAnswers = {
      ...answers,
      [questionKey]: value,
    };
    setAnswers(updatedAnswers);
    onboardingMemory.bigFiveAnswers = updatedAnswers; // ✅ Keep local sync

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            bigFiveAnswers: updatedAnswers,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving Big Five answer:', error);
      }
    }
  };

  const handleContinue = async () => {
    const allAnswered = bigFiveQuestions.every((q) => answers[q.key]);
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
          bigFiveAnswers: answers,
          onboardingStep: 16,
        },
        { merge: true }
      );

      onboardingMemory.bigFiveAnswers = answers; // ✅ Local memory
      navigation.replace('Step17AIConsent', { uid }); // ✅ Go to next step
    } catch (error) {
      console.error('Error saving Big Five data:', error);
      Alert.alert('Error', 'Could not save your Big Five profile. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getSmartCue = () => {
    if (!Object.keys(answers).length) {
      return '🌟 Understanding your Big Five traits gives ARIA a full map of your emotional landscape.';
    }
    if (answers.openness === 'Agree') {
      return '🧠 Your curiosity is your magic — ARIA will help you keep wonder alive without losing focus.';
    }
    if (answers.conscientiousness === 'Agree') {
      return '📚 Your organization and discipline are your superpowers — ARIA will help you balance action with reflection.';
    }
    if (answers.extraversion === 'Agree') {
      return '🎉 Your energy lights up the room — ARIA will teach you how to recharge without losing your fire.';
    }
    if (answers.agreeableness === 'Agree') {
      return '🤝 Your kindness changes worlds — ARIA will help you protect your heart while staying open.';
    }
    if (answers.neuroticism === 'Agree') {
      return '🌧️ Your sensitivity is strength — ARIA will guide you to master it without letting it master you.';
    }
    return '✨ Knowing yourself deeply is how real love, success, and peace begin.';
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
              <ProgressBar current={16} total={32} />
              <Text style={styles.progressText}>Step 16 of 32 — Big Five Personality</Text>

              <Text style={styles.title}>Discover Your Emotional Blueprint</Text>

              {bigFiveQuestions.map((q) => (
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

