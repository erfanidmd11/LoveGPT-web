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

const conflictOptions = [
  'I go silent or retreat',
  'I raise my voice or get defensive',
  'I over-explain or try to fix it fast',
  'I stay calm but shut down later',
  'I listen first, then respond with care',
];

export default function Step24ConflictStyle() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [selected, setSelected] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadConflictStyle = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.conflictStyle) {
            setSelected(data.conflictStyle);
            onboardingMemory.conflictStyle = data.conflictStyle;
          }
        }
      } catch (err) {
        console.error('Error loading conflict style:', err);
      }
    };
    loadConflictStyle();
  }, [uid]);

  const toggleSelection = async (value: string) => {
    setSelected(value);
    onboardingMemory.conflictStyle = value;

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            conflictStyle: value,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving conflict style:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (!selected) {
      Alert.alert('Choose One', 'Please choose how you typically respond to conflict.');
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
          conflictStyle: selected,
          onboardingStep: 24,
        },
        { merge: true }
      );

      onboardingMemory.conflictStyle = selected;
      navigation.replace('Step25AttachmentStyle', { uid });
    } catch (error) {
      console.error('Error saving conflict style:', error);
      Alert.alert('Error', 'Could not save your answer. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getSmartCue = () => {
    if (!selected) {
      return '🌟 Understanding how you move through conflict helps ARIA match you with someone whose emotional rhythm fits yours.';
    }
    if (selected.includes('silent') || selected.includes('retreat')) {
      return '🤫 You seek peace — ARIA will teach you how to find partners who honor quiet healing.';
    }
    if (selected.includes('raise my voice') || selected.includes('defensive')) {
      return '🔥 Your passion needs safe containers — ARIA will help you create relationships built on emotional safety.';
    }
    if (selected.includes('over-explain') || selected.includes('fix it')) {
      return '🛠️ Your heart works hard to keep love alive — ARIA will help you let go and trust more.';
    }
    if (selected.includes('stay calm') || selected.includes('shut down')) {
      return '🧊 Calm can hide sadness — ARIA will help you express your real feelings before freezing.';
    }
    if (selected.includes('listen first')) {
      return '👂 Listening is your superpower — ARIA will help you find partners who reciprocate your grace.';
    }
    return '✨ Conflict handled with awareness becomes connection, not division — ARIA walks this path with you.';
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
              <ProgressBar current={24} total={32} />
              <Text style={styles.title}>In conflict with others, how do you usually respond?</Text>

              <View style={styles.options}>
                {conflictOptions.map((option) => (
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
    marginBottom: 20,
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
