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

const dynamicOptions = [
  { label: '💞 I want an emotionally balanced, equal partnership.', value: 'equal-partnership' },
  {
    label: '🤱 I prefer to be the nurturer/caregiver in the relationship.',
    value: 'nurturer-role',
  },
  {
    label: '🛡️ I prefer to be the provider/protector in the relationship.',
    value: 'provider-role',
  },
  {
    label: '🌈 I want a fluid and evolving dynamic — we grow into roles together.',
    value: 'fluid-dynamic',
  },
  {
    label: '🧠 I want intellectual partnership — two minds building something great.',
    value: 'intellectual-partnership',
  },
  { label: '🌀 I’m still discovering what I need from a partner.', value: 'unsure' },
];

export default function Step28PartnershipDynamic() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [selected, setSelected] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPartnershipDynamic = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.partnershipDynamic) {
            setSelected(data.partnershipDynamic);
            onboardingMemory.partnershipDynamic = data.partnershipDynamic;
          }
        }
      } catch (err) {
        console.error('Error loading partnership dynamic:', err);
      }
    };
    loadPartnershipDynamic();
  }, [uid]);

  const toggleSelection = async (value: string) => {
    setSelected(value);
    onboardingMemory.partnershipDynamic = value;

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            partnershipDynamic: value,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving partnership dynamic:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (!selected) {
      Alert.alert(
        'Choose One',
        'Please choose the partnership dynamic that resonates with you most.'
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
          partnershipDynamic: selected,
          onboardingStep: 28,
        },
        { merge: true }
      );

      onboardingMemory.partnershipDynamic = selected;
      navigation.replace('Step29EmotionalTriggers', { uid }); // 🚀 Move to next step
    } catch (error) {
      console.error('Error saving partnership dynamic:', error);
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
      return '🌟 Your partnership dynamic reveals your emotional blueprint — ARIA listens deeply.';
    }
    if (selected.includes('equal')) {
      return '💞 You seek balance — ARIA will help you find a partner who stands beside you, not in front or behind.';
    }
    if (selected.includes('nurturer')) {
      return '🤱 Your care is powerful — ARIA will help you build relationships where giving and receiving flow equally.';
    }
    if (selected.includes('provider')) {
      return '🛡️ Your strength shields love — ARIA will guide you toward a partner who treasures your protection.';
    }
    if (selected.includes('fluid')) {
      return '🌈 Your flexibility is rare — ARIA will help you find a dynamic soul who grows with you.';
    }
    if (selected.includes('intellectual')) {
      return '🧠 You crave minds that dance — ARIA will connect you with builders of dreams and ideas.';
    }
    if (selected.includes('unsure')) {
      return '🌀 Curiosity is sacred — ARIA will walk with you as you unfold your authentic relational needs.';
    }
    return '✨ Partnership isn’t about roles — it’s about co-creation. ARIA is helping you design yours.';
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
              <ProgressBar current={28} total={32} />
              <Text style={styles.title}>What type of partnership feels best for you?</Text>

              <View style={styles.options}>
                {dynamicOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => toggleSelection(option.value)}
                    style={[styles.option, selected === option.value && styles.selected]}
                  >
                    <Text
                      style={[styles.optionText, selected === option.value && styles.selectedText]}
                    >
                      {option.label}
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: '#e0f2fe',
    borderColor: '#38bdf8',
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
  },
  selectedText: {
    color: '#0ea5e9',
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
