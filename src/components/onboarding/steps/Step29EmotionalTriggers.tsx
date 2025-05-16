import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import Footer from '@/components/common/Footer';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import onboardingMemory from '@/lib/onboardingMemory';

const triggerOptions = [
  'Abandonment or Rejection',
  'Criticism or Judgment',
  'Being Ignored or Not Heard',
  'Feeling Controlled',
  'Conflict or Confrontation',
  'Failure or Disapproval',
  'Being Compared',
  'Feeling Unworthy or Not Enough',
];

const emotionalInsights = {
  'Abandonment or Rejection':
    'You seek security and belonging. ARIA will help you find lasting emotional safety.',
  'Criticism or Judgment':
    'Your sensitivity is a gift. ARIA will protect your self-worth from harshness.',
  'Being Ignored or Not Heard':
    'Your voice deserves honor. ARIA will amplify your needs in future bonds.',
  'Feeling Controlled':
    'Your freedom matters. ARIA will help you build partnerships based on trust and respect.',
  'Conflict or Confrontation':
    'You value peace. ARIA will teach you loving ways to handle differences.',
  'Failure or Disapproval':
    'You deserve unconditional love. ARIA will guide you to relationships where you thrive.',
  'Being Compared': 'You are one of a kind. ARIA will help you embrace your uniqueness in love.',
  'Feeling Unworthy or Not Enough':
    'You are already whole. ARIA will mirror back your deep intrinsic value.',
};

export default function Step29EmotionalTriggers() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadEmotionalTriggers = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data?.emotionalTriggers)) {
            setSelected(data.emotionalTriggers);
            onboardingMemory.emotionalTriggers = data.emotionalTriggers;
          }
        }
      } catch (err) {
        console.error('Error loading emotional triggers:', err);
      }
    };
    loadEmotionalTriggers();
  }, [uid]);

  const toggleSelection = (trigger: string) => {
    let updated = [...selected];
    if (updated.includes(trigger)) {
      updated = updated.filter((t) => t !== trigger);
    } else {
      updated.push(trigger);
    }
    setSelected(updated);
    onboardingMemory.emotionalTriggers = updated;
  };

  const handleContinue = async () => {
    if (!uid) {
      Alert.alert('Error', 'Missing user ID. Cannot save.');
      return;
    }

    setSaving(true);

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          emotionalTriggers: selected,
          onboardingStep: 29,
          'ARIA.dynamicProfile.emotionalTriggers': selected,
        },
        { merge: true }
      );

      onboardingMemory.emotionalTriggers = selected;
      navigation.replace('Step30ConditioningBeliefs', { uid }); // 🚀 move to Step30
    } catch (error) {
      console.error('Error saving emotional triggers:', error);
      Alert.alert('Error', 'Could not save your selection. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getSmartCue = () => {
    if (selected.length === 0) {
      return '🌟 Emotional triggers are keys to healing. ARIA listens to your heart’s whispers.';
    }

    const insights = selected.slice(0, 2).map((trigger) => emotionalInsights[trigger]);
    return (
      insights.join(' ') ||
      '🧠 Awareness is power — ARIA will support your emotional mastery journey.'
    );
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
              <ProgressBar current={29} total={32} />
              <Text style={styles.title}>What emotional triggers do you recognize?</Text>

              <View style={styles.options}>
                {triggerOptions.map((trigger) => (
                  <TouchableOpacity
                    key={trigger}
                    onPress={() => toggleSelection(trigger)}
                    style={[styles.option, selected.includes(trigger) && styles.selected]}
                  >
                    <Text
                      style={[styles.optionText, selected.includes(trigger) && styles.selectedText]}
                    >
                      {trigger}
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

        <Footer
          onNext={handleContinue}
          onBack={handleBack}
          nextDisabled={selected.length === 0}
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
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
    backgroundColor: '#fde68a',
    borderColor: '#f59e0b',
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
  },
  selectedText: {
    color: '#b45309',
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
