import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  Keyboard,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'next/router';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProgressBar from '@/components/common/ProgressBar';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import { saveAnswer, getAnswer, saveAnswerToFirestore } from '@/lib/saveAnswer';
import onboardingMemory from '@/lib/onboardingMemory';
import Footer from '@/components/common/Footer';

const personalityTraits = [
  'Empathetic', 'Growth-Oriented', 'Emotionally Intelligent', 'Loyal',
  'Communicative', 'Playful', 'Ambitious', 'Romantic', 'Self-Aware',
];

export default function Step11Personality() {
  const router = useRouter();
  const uid = router.query.uid as string;

  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTraits = async () => {
      if (!uid) return;
      try {
        if (onboardingMemory.personalityTraits?.length) {
          setSelectedTraits(onboardingMemory.personalityTraits);
        } else {
          const stored = await getAnswer(uid, 'Step11');
          if (stored && Array.isArray(stored.answer)) {
            setSelectedTraits(stored.answer);
            onboardingMemory.personalityTraits = stored.answer;
          } else {
            const userRef = doc(db, 'users', uid);
            const snap = await getDoc(userRef);
            if (snap.exists()) {
              const data = snap.data();
              if (data?.personalityTraits) {
                setSelectedTraits(data.personalityTraits);
                onboardingMemory.personalityTraits = data.personalityTraits;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading personality traits:', error);
      }
    };
    fetchTraits();
  }, [uid]);

  const toggleTrait = async (trait: string) => {
    let updatedTraits;
    if (selectedTraits.includes(trait)) {
      updatedTraits = selectedTraits.filter((t) => t !== trait);
    } else {
      updatedTraits = [...selectedTraits, trait];
    }
    setSelectedTraits(updatedTraits);
    onboardingMemory.personalityTraits = updatedTraits;
    saveAnswer('Step11', updatedTraits);
  };

  const handleContinue = async () => {
    if (!uid) {
      alert('Missing user ID. Cannot save.');
      return;
    }
    if (!selectedTraits.length) {
      alert('Please select at least one personality trait.');
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, 'users', uid), {
        personalityTraits: selectedTraits,
        onboardingStep: 11,
      }, { merge: true });

      await saveAnswerToFirestore(uid, 'Step11', selectedTraits);

      router.replace(`/onboarding/Step12ProfileReflection?uid=${uid}`);
    } catch (error) {
      console.error('Error saving personality traits:', error);
      alert('Could not save your traits. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getPersonalizedCue = () => {
    if (!selectedTraits.length)
      return '🌟 Select traits that best describe your authentic self. ARIA is listening.';
    if (selectedTraits.includes('Empathetic') && selectedTraits.includes('Self-Aware')) {
      return '💖 Your empathy and self-awareness make you a truly rare soul.';
    }
    if (selectedTraits.includes('Growth-Oriented') && selectedTraits.includes('Communicative')) {
      return '🌱 Your growth mindset and open communication will create deep bonds.';
    }
    if (selectedTraits.includes('Playful') && selectedTraits.includes('Romantic')) {
      return '🎈 You bring joy and magic into love — a beautiful combination!';
    }
    if (selectedTraits.includes('Ambitious')) {
      return '🚀 Your ambition drives you forward — just remember to enjoy the journey too.';
    }
    return `✨ You are shaping a beautiful emotional profile, ${selectedTraits.length} traits strong.`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <ProgressBar step={11} totalSteps={32} />
            <Text style={styles.progressText}>Step 11 of 32 — Personality</Text>
            <Text style={styles.title}>Describe Your Personality</Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
              <View style={styles.traitsContainer}>
                {personalityTraits.map((trait) => (
                  <TouchableOpacity
                    key={trait}
                    style={[
                      styles.traitButton,
                      selectedTraits.includes(trait) && styles.selectedTrait,
                    ]}
                    onPress={() => toggleTrait(trait)}
                  >
                    <Text
                      style={[
                        styles.traitText,
                        selectedTraits.includes(trait) && styles.selectedTraitText,
                      ]}
                    >
                      {trait}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <View style={styles.ariaContainer}>
          <AnimatedValueCue message={getPersonalizedCue()} />
        </View>
       <Footer
         onNext={handleContinue}
         onBack={handleBack}
         nextDisabled={!selectedTraits.length}
         saving={saving}
         variant="onboarding"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
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
    marginBottom: 4,
    textAlign: 'center',
    color: '#111827',
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
  },
  traitButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    margin: 6,
  },
  selectedTrait: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  traitText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  selectedTraitText: {
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
