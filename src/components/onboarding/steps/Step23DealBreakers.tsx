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

const dealBreakerOptions = [
  'Smoking 🌬️',
  'Drinking heavily 🍻',
  'Open relationships 🧑‍🧑‍🧑',
  'No desire for kids ❌👶',
  'No religious/spiritual beliefs 🙏❌',
  'Excessive screen time 📱',
  'Different political views 🕳️',
  'Not wanting marriage 💍',
  'Financial irresponsibility 💸',
  'Dishonesty or lack of integrity ❌',
];

export default function Step23DealBreakers() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [selected, setSelected] = useState<{ value: string; severity: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step23DealBreakers').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    const loadDealBreakers = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.dealBreakers) {
            setSelected(data.dealBreakers);
            onboardingMemory.dealBreakers = data.dealBreakers;
          }
        }
      } catch (err) {
        console.error('Error loading deal breakers:', err);
      }
    };
    loadDealBreakers();
  }, [uid]);

  const isSelected = (option: string) => selected.some((item) => item.value === option);

  const getSeverity = (option: string) =>
    selected.find((item) => item.value === option)?.severity || 'hard';

  const toggleOption = async (option: string) => {
    const updated = isSelected(option)
      ? selected.filter((item) => item.value !== option)
      : [...selected, { value: option, severity: 'hard' }];

    setSelected(updated);
    onboardingMemory.dealBreakers = updated;

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            dealBreakers: updated,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving deal breaker:', error);
      }
    }
  };

  const toggleSeverity = async (option: string) => {
    const updated = selected.map((item) =>
      item.value === option
        ? { ...item, severity: item.severity === 'hard' ? 'soft' : 'hard' }
        : item
    );

    setSelected(updated);
    onboardingMemory.dealBreakers = updated;

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            dealBreakers: updated,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error updating severity:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step23', values);
      await saveAnswerToFirestore(uid, 'Step23', values);
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
          dealBreakers: selected,
          onboardingStep: 23,
        },
        { merge: true }
      );

      onboardingMemory.dealBreakers = selected;
      router.replace("/onboarding/" + 'Step24ConflictStyle', { uid }.toLowerCase() + "?uid=" + uid);
    } catch (error) {
      console.error('Error saving deal breakers:', error);
      Alert.alert('Error', 'Could not save your deal breakers. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getSmartCue = () => {
    if (!selected.length) {
      return '🌟 Knowing your non-negotiables helps ARIA guard your sacred boundaries while welcoming true love.';
    }
    if (selected.some((item) => item.severity === 'hard')) {
      return '🛡️ Your strongest boundaries are honored — ARIA will help you find someone who respects them fully.';
    }
    if (selected.every((item) => item.severity === 'soft')) {
      return '🌼 Your openness is brave — ARIA will guide you in balancing standards with grace.';
    }
    return '✨ Boundaries aren’t walls — they are doors that only the right heart can open.';
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
              <ProgressBar current={23} total={32} />
              <Text style={styles.progressText}>Step 23 of 32 — Deal Breakers</Text>

              <Text style={styles.title}>Are there things you simply cannot compromise on?</Text>

              <View style={styles.options}>
                {dealBreakerOptions.map((option) => (
                  <View key={option} style={styles.row}>
                    <TouchableOpacity
                      onPress={() => toggleOption(option)}
                      style={[styles.option, isSelected(option) && styles.selected]}
                    >
                      <Text style={[styles.optionText, isSelected(option) && styles.selectedText]}>
                        {option}
                      </Text>
                    </TouchableOpacity>

                    {isSelected(option) && (
                      <TouchableOpacity
                        onPress={() => toggleSeverity(option)}
                        style={[
                          styles.severityTag,
                          getSeverity(option) === 'hard' ? styles.hard : styles.soft,
                        ]}
                      >
                        <Text style={styles.severityText}>{getSeverity(option).toUpperCase()}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
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

        <Footer variant="onboarding" onNext={handleContinue} onBack={handleBack} nextDisabled={false} saving={saving} />
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
    marginBottom: 20,
    color: '#111827',
  },
  options: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 12,
    marginRight: 8,
  },
  selected: {
    backgroundColor: '#fecaca',
    borderColor: '#f87171',
  },
  optionText: {
    fontSize: 16,
    color: '#4B5563',
  },
  selectedText: {
    fontWeight: '600',
    color: '#b91c1c',
  },
  severityTag: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  hard: {
    backgroundColor: '#dc2626',
  },
  soft: {
    backgroundColor: '#facc15',
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
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
