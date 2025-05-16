import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
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

const resolutionOptions = [
  'Talk immediately and resolve it fully',
  'Take space, then come back calmly',
  'Write it out in a message first',
  "Let it go unless it's serious",
  'Go to therapy or ask for outside help',
];

export default function Step27ConflictResolution() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [selected, setSelected] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadConflictResolution = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.conflictResolution) {
            setSelected(data.conflictResolution);
            onboardingMemory.conflictResolution = data.conflictResolution;
          }
        }
      } catch (err) {
        console.error('Error loading conflict resolution:', err);
      }
    };
    loadConflictResolution();
  }, [uid]);

  const toggleSelection = async (value: string) => {
    setSelected(value);
    onboardingMemory.conflictResolution = value;

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            conflictResolution: value,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving conflict resolution:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (!selected) {
      Alert.alert('Choose One', 'Please choose your preferred conflict resolution method.');
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
          conflictResolution: selected,
          onboardingStep: 27,
        },
        { merge: true }
      );

      onboardingMemory.conflictResolution = selected;
      navigation.replace('Step28PartnershipDynamic', { uid }); // 🚀 Move to next step
    } catch (error) {
      console.error('Error saving conflict resolution:', error);
      Alert.alert('Error', 'Could not save your selection. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getSmartCue = () => {
    if (!selected) {
      return '🌟 How you repair after conflict reveals your emotional intelligence — ARIA listens to your rhythm.';
    }
    if (selected.includes('Talk immediately')) {
      return '💬 You face issues head-on — ARIA will help you choose partners who value directness with kindness.';
    }
    if (selected.includes('Take space')) {
      return '🌿 You know the power of breathing room — ARIA will guide you to connections that respect reflection.';
    }
    if (selected.includes('Write it out')) {
      return '📝 Writing offers clarity — ARIA will encourage partners who appreciate thoughtful communication.';
    }
    if (selected.includes('Let it go')) {
      return '🕊️ You choose peace over battles — ARIA will show you when to hold peace and when to speak up.';
    }
    if (selected.includes('therapy') || selected.includes('outside help')) {
      return '🧠 Seeking support is brave — ARIA honors your willingness to heal and grow.';
    }
    return '✨ Conflict isn’t failure — it’s a gateway to deeper love. ARIA walks it with you.';
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
              <ProgressBar current={27} total={32} />
              <Text style={styles.title}>How do you prefer to resolve a disagreement?</Text>

              <View style={styles.options}>
                {resolutionOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => toggleSelection(option)}
                    style={[styles.option, selected === option && styles.selected]}
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

        <Footer
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
