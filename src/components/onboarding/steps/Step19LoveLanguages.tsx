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
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import Footer from '@/components/common/Footer';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import onboardingMemory from '@/lib/onboardingMemory';

const loveLanguageOptions = [
  'Words of Affirmation',
  'Acts of Service',
  'Receiving Gifts',
  'Quality Time',
  'Physical Touch',
];

export default function Step19LoveLanguages() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadLoveLanguages = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.loveLanguages) {
            setSelected(data.loveLanguages);
            onboardingMemory.loveLanguages = data.loveLanguages; // Local sync
          }
        }
      } catch (err) {
        console.error('Error loading love languages:', err);
      }
    };
    loadLoveLanguages();
  }, [uid]);

  const toggleLanguage = async (lang: string) => {
    const updated = selected.includes(lang)
      ? selected.filter((l) => l !== lang)
      : selected.length < 2
        ? [...selected, lang]
        : selected;

    setSelected(updated);
    onboardingMemory.loveLanguages = updated;

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            loveLanguages: updated,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving love language selection:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (!selected.length) {
      Alert.alert('Select One', 'Please select at least one love language.');
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
          loveLanguages: selected,
          onboardingStep: 19,
        },
        { merge: true }
      );

      onboardingMemory.loveLanguages = selected;
      navigation.replace('Step20InnerConflictStyle', { uid });
    } catch (error) {
      console.error('Error saving love languages:', error);
      Alert.alert('Error', 'Could not save your love languages. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getSmartCue = () => {
    if (!selected.length) {
      return '🌟 Your love languages reveal how you receive emotional nourishment — ARIA listens closely.';
    }
    if (selected.includes('Words of Affirmation')) {
      return '💬 Words uplift your spirit — ARIA will help you seek partners whose words heal and inspire.';
    }
    if (selected.includes('Acts of Service')) {
      return '🛠️ Actions mean more than promises — ARIA will guide you toward relationships grounded in deeds.';
    }
    if (selected.includes('Receiving Gifts')) {
      return '🎁 Small meaningful gifts touch your soul — ARIA will remind you that presence matters more than price.';
    }
    if (selected.includes('Quality Time')) {
      return '⏳ Your soul craves undivided attention — ARIA will help you guard sacred moments in a distracted world.';
    }
    if (selected.includes('Physical Touch')) {
      return '🤝 Safe, affectionate touch grounds you — ARIA will help you find partners who honor your need for connection.';
    }
    return '✨ Every language of love is valid — ARIA is fluent in yours.';
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
              <ProgressBar current={19} total={32} />
              <Text style={styles.progressText}>Step 19 of 32 — Love Languages</Text>

              <Text style={styles.title}>Which Love Languages Resonate Most With You?</Text>

              <Text style={styles.subtitle}>
                Choose up to 2 that matter most to receive from a partner.
              </Text>

              <View style={styles.grid}>
                {loveLanguageOptions.map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => toggleLanguage(lang)}
                    style={[styles.tag, selected.includes(lang) && styles.selected]}
                  >
                    <Text style={[styles.tagText, selected.includes(lang) && styles.selectedText]}>
                      {lang}
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
          nextDisabled={!selected.length}
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
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  tag: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    margin: 6,
  },
  selected: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  tagText: {
    fontSize: 15,
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
