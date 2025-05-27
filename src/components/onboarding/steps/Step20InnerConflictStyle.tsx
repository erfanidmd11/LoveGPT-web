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

const toneMap: Record<string, string> = {
  'I avoid thinking about it until it explodes.': 'gentle',
  'I journal, meditate, or process alone first.': 'reflective',
  'I need to talk it out immediately with someone trusted.': 'empathetic',
  'I take quick action just to end the discomfort.': 'direct',
  'I overthink until I paralyze myself.': 'analytical',
  'I seek external advice because I distrust my own feelings.': 'cautious',
};

export default function Step20InnerConflictStyle() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [selected, setSelected] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step20InnerConflictStyle').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    const loadConflictStyle = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.innerConflictStyle) {
            setSelected(data.innerConflictStyle);
            onboardingMemory.innerConflictStyle = data.innerConflictStyle;
            onboardingMemory.aiToneStyle = data.aiToneStyle;
          }
        }
      } catch (err) {
        console.error('Error loading inner conflict style:', err);
      }
    };
    loadConflictStyle();
  }, [uid]);

  const toggleSelection = async (value: string) => {
    setSelected(value);
    onboardingMemory.innerConflictStyle = value;
    onboardingMemory.aiToneStyle = toneMap[value];

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            innerConflictStyle: value,
            aiToneStyle: toneMap[value],
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving conflict style:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step20', values);
      await saveAnswerToFirestore(uid, 'Step20', values);
    }
    if (!selected) {
      Alert.alert('Choose One', 'Please select your typical inner conflict style.');
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
          innerConflictStyle: selected,
          aiToneStyle: toneMap[selected],
          onboardingStep: 20,
        },
        { merge: true }
      );

      onboardingMemory.innerConflictStyle = selected;
      onboardingMemory.aiToneStyle = toneMap[selected];

      router.replace("/onboarding/" + 'Step21CommunicationStyle', { uid }.toLowerCase() + "?uid=" + uid);
    } catch (error) {
      console.error('Error saving conflict style:', error);
      Alert.alert('Error', 'Could not save your answer. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getSmartCue = () => {
    if (!selected) {
      return '🌟 Understanding how you process inner tension helps ARIA support you with the gentlest wisdom.';
    }
    if (selected.includes('explode')) {
      return '🧨 Big emotions don’t scare ARIA — we’ll work together to release them safely.';
    }
    if (selected.includes('journal') || selected.includes('meditate')) {
      return '🧘‍♀️ Your reflective heart is your superpower — ARIA will guard your solitude.';
    }
    if (selected.includes('talk it out')) {
      return '💬 Dialogue heals you — ARIA will always meet you in honest conversation.';
    }
    if (selected.includes('quick action')) {
      return '⚡ You move fast to protect peace — ARIA will help you balance speed with patience.';
    }
    if (selected.includes('overthink')) {
      return '🔍 Your mind seeks understanding — ARIA will help you move beyond analysis into action.';
    }
    if (selected.includes('external advice')) {
      return '🧠 Seeking counsel is wise — ARIA will remind you your voice matters too.';
    }
    return '✨ Your style of conflict isn’t a flaw — it’s the starting point of your growth story.';
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
              <ProgressBar current={20} total={32} />
              <Text style={styles.progressText}>Step 20 of 32 — Inner Conflict Style</Text>

              <Text style={styles.title}>
                When you're conflicted inside yourself, what do you tend to do first?
              </Text>

              <View style={styles.options}>
                {Object.keys(toneMap).map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.option, selected === option && styles.selected]}
                    onPress={() => toggleSelection(option)}
                  >
                    <Text style={[styles.optionText, selected === option && styles.selectedText]}>
                      {option}
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
          nextDisabled={!selected}
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
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 20,
  },
  options: {
    marginBottom: 24,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 18,
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
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
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
