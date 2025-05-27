import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'next/router';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import Footer from '@/components/common/Footer';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import onboardingMemory from '@/lib/onboardingMemory';

export default function Step30ConditioningBeliefs() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [beliefs, setBeliefs] = useState('');
  const [releaseReady, setReleaseReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exampleSuggestions, setExampleSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step30ConditioningBeliefs').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    if (uid) {
      loadConditioningBeliefs();
      generateSmartExamples();
    }
  }, [uid]);

  const loadConditioningBeliefs = async () => {
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data?.conditionedBeliefs) {
          setBeliefs(data.conditionedBeliefs);
          onboardingMemory.conditionedBeliefs = data.conditionedBeliefs;
        }
        if (typeof data?.readyToReleaseBeliefs === 'boolean') {
          setReleaseReady(data.readyToReleaseBeliefs);
          onboardingMemory.readyToReleaseBeliefs = data.readyToReleaseBeliefs;
        }
      }
    } catch (err) {
      console.error('Error loading conditioning beliefs:', err);
    }
  };

  const generateSmartExamples = () => {
    const examples: string[] = [];
    const age = onboardingMemory.age || 30;
    const gender = onboardingMemory.gender || 'male';
    const relationshipStatus = onboardingMemory.relationshipStatus || 'single';
    const relationshipGoals = onboardingMemory.relationshipGoals || '';
    const westernZodiac = onboardingMemory.zodiacSign || '';
    const chineseZodiac = onboardingMemory.chineseZodiacSign || '';
    const personalityType = onboardingMemory.personalityType || '';
    const bigFiveAnswers = onboardingMemory.bigFiveAnswers || {};
    const coreValues = onboardingMemory.coreValues || [];
    const enneagramType = onboardingMemory.enneagramType || '';
    const mbtiType = onboardingMemory.mbtiType || '';
    const parenthoodReadiness = onboardingMemory.parenthoodReadiness || '';

    if (relationshipStatus === 'single') {
      examples.push('I must be fully healed before I can be loved.');
      examples.push('Love is for the lucky, not for me.');
    }
    if (relationshipGoals.includes('marriage')) {
      examples.push('Marriage is the only proof of love.');
    }
    if (westernZodiac === 'Aries') {
      examples.push('I must lead everything or I am weak.');
    }
    if (westernZodiac === 'Cancer') {
      examples.push('If I open up emotionally, I will get hurt.');
    }
    if (personalityType.includes('D')) {
      examples.push('Control equals safety.');
    }
    if (personalityType.includes('I')) {
      examples.push('If I’m not liked, I’m not worthy.');
    }
    if (bigFiveAnswers.neuroticism === 'Agree') {
      examples.push('I must avoid mistakes at all costs.');
    }
    if (bigFiveAnswers.agreeableness === 'Disagree') {
      examples.push('Trusting others leads to betrayal.');
    }
    if (coreValues.includes('Security')) {
      examples.push('If I’m financially unstable, I can’t be loved.');
    }
    if (coreValues.includes('Freedom')) {
      examples.push('Love will trap me or restrict my dreams.');
    }
    if (enneagramType.startsWith('4')) {
      examples.push('I must be special to deserve love.');
    }
    if (enneagramType.startsWith('3')) {
      examples.push('My achievements define my worth.');
    }
    if (mbtiType.startsWith('INT')) {
      examples.push('Showing emotions makes me weak.');
    }
    if (mbtiType.startsWith('ENFP')) {
      examples.push('Commitment will limit my freedom.');
    }
    if (parenthoodReadiness === 'yes') {
      examples.push("If I don't become a parent, I will fail at life.");
    }
    if (examples.length === 0) {
      examples.push('Love must be earned, not given freely.');
      examples.push('I must hide my flaws to be accepted.');
    }

    setExampleSuggestions(examples.slice(0, 5));
  };

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step30', values);
      await saveAnswerToFirestore(uid, 'Step30', values);
    }
    if (beliefs.trim().length < 10) {
      Alert.alert(
        'Add More',
        'Please share a little more about what you were conditioned to believe ❤️‍🩹'
      );
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
          conditionedBeliefs: beliefs,
          readyToReleaseBeliefs: releaseReady,
          onboardingStep: 30,
          'ARIA.dynamicProfile.conditionedBeliefs': beliefs,
          'ARIA.dynamicProfile.readyToReleaseBeliefs': releaseReady,
        },
        { merge: true }
      );

      onboardingMemory.conditionedBeliefs = beliefs;
      onboardingMemory.readyToReleaseBeliefs = releaseReady;
      onboardingMemory.conditioningBeliefsCaptured = true;
      onboardingMemory.lastStepCompleted = 30;
      onboardingMemory.conditionedBeliefsText = beliefs.trim();

      router.replace("/onboarding/" + 'Step31OpennessLevel', { uid }.toLowerCase() + "?uid=" + uid);
    } catch (error) {
      console.error('Error saving conditioned beliefs:', error);
      Alert.alert('Error', 'Could not save your insights. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getSmartCue = () => {
    if (!beliefs && !releaseReady) {
      return '🧠 Your beliefs are powerful scripts. ARIA will help you rewrite them with love.';
    }
    if (beliefs && !releaseReady) {
      return '🧩 Naming your conditioned beliefs is the beginning of your liberation.';
    }
    if (beliefs && releaseReady) {
      return '🕊️ You are ready to heal — ARIA will help you rewire love at the soul level.';
    }
    return '✨ Awareness is the first breath of freedom. You are already evolving.';
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
              <ProgressBar current={30} total={32} />
              <Text style={styles.progressText}>Step 30 of 32 — Conditioning Beliefs</Text>

              <Text style={styles.title}>
                What beliefs were you conditioned to hold about love, connection, or yourself?
              </Text>

              {exampleSuggestions.length > 0 && (
                <View style={styles.examplesContainer}>
                  <Text style={styles.examplesTitle}>
                    ✨ Belief Examples (based on your journey):
                  </Text>
                  {exampleSuggestions.map((example, index) => (
                    <Text key={index} style={styles.exampleText}>
                      • {example}
                    </Text>
                  ))}
                </View>
              )}

              <TextInput
                style={styles.textarea}
                value={beliefs}
                onChangeText={(text) => {
                  setBeliefs(text);
                  onboardingMemory.conditionedBeliefs = text;
                }}
                placeholder="Write your own beliefs here..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              <View style={styles.switchRow}>
                <Switch
                  value={releaseReady}
                  onValueChange={(value) => {
                    setReleaseReady(value);
                    onboardingMemory.readyToReleaseBeliefs = value;
                  }}
                  thumbColor={releaseReady ? '#ec4899' : '#ccc'}
                  trackColor={{ false: '#ddd', true: '#fbcfe8' }}
                />
                <Text style={styles.switchLabel}>
                  I’m ready to release these beliefs and rewire how I love.
                </Text>
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
          nextDisabled={beliefs.trim().length < 10}
          saving={saving}
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
    marginBottom: 16,
    textAlign: 'center',
    color: '#111827',
  },
  examplesContainer: {
    marginBottom: 20,
    backgroundColor: '#fef9f9',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fbcfe8',
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#db2777',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  textarea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 120,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
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
