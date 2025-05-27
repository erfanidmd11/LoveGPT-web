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

const lifestyleOptions = [
  { value: 'balanced', label: '🌱 Balanced — I value both rest and productivity' },
  { value: 'hustle', label: "💼 Hustle — I'm highly driven and achievement-oriented" },
  { value: 'flow', label: '🧘‍♀️ Flow — I prioritize presence, peace, and wellbeing' },
  { value: 'adventure', label: '🌎 Adventure — I love travel, risk-taking, and pushing limits' },
  { value: 'grounded', label: '🏡 Rooted — I enjoy stability, tradition, and home life' },
  { value: 'visionary', label: '🔭 Visionary — I live by future goals and expansive dreams' },
];

export default function Step22Lifestyle() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [selected, setSelected] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step22Lifestyle').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    const loadLifestyle = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.lifestyleNow) {
            setSelected(data.lifestyleNow);
            onboardingMemory.lifestyleNow = data.lifestyleNow;
          }
        }
      } catch (err) {
        console.error('Error loading lifestyle preference:', err);
      }
    };
    loadLifestyle();
  }, [uid]);

  const toggleSelection = async (value: string) => {
    setSelected(value);
    onboardingMemory.lifestyleNow = value;

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            lifestyleNow: value,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving lifestyle choice:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step22', values);
      await saveAnswerToFirestore(uid, 'Step22', values);
    }
    if (!selected) {
      Alert.alert('Choose One', 'Please choose your current lifestyle before continuing.');
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
          lifestyleNow: selected,
          onboardingStep: 22,
        },
        { merge: true }
      );

      onboardingMemory.lifestyleNow = selected;
      router.replace("/onboarding/" + 'Step23DealBreakers', { uid }.toLowerCase() + "?uid=" + uid);
    } catch (error) {
      console.error('Error saving lifestyle:', error);
      Alert.alert('Error', 'Could not save your lifestyle preference. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getSmartCue = () => {
    if (!selected) {
      return '🌟 Your current rhythm shapes who you align best with — ARIA listens closely to your heartbeat.';
    }
    if (selected === 'balanced') {
      return '🌱 Balance keeps you grounded — ARIA will help you protect it while reaching for more.';
    }
    if (selected === 'hustle') {
      return '💼 Your fire for achievement is powerful — ARIA will help you fuel it without burning out.';
    }
    if (selected === 'flow') {
      return '🧘‍♀️ Your peace is priceless — ARIA will guide you to partners who move with grace, not chaos.';
    }
    if (selected === 'adventure') {
      return '🌎 Your spirit craves new horizons — ARIA will help you find companions who run wild with you.';
    }
    if (selected === 'grounded') {
      return '🏡 Roots and family nourish you — ARIA will honor your desire for deep belonging.';
    }
    if (selected === 'visionary') {
      return '🔭 You dream bigger than the horizon — ARIA will support your journey from vision to reality.';
    }
    return '✨ Every lifestyle holds magic — ARIA will help you live yours fully.';
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
              <ProgressBar current={22} total={32} />
              <Text style={styles.progressText}>Step 22 of 32 — Current Lifestyle</Text>

              <Text style={styles.title}>Which lifestyle best fits you right now?</Text>

              <Text style={styles.subtitle}>
                Choose the one that reflects your pace and priorities today.
              </Text>

              <View style={styles.options}>
                {lifestyleOptions.map(({ label, value }) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => toggleSelection(value)}
                    style={[styles.option, selected === value && styles.selected]}
                  >
                    <Text style={[styles.optionText, selected === value && styles.selectedText]}>
                      {label}
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
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
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
    fontSize: 16,
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
