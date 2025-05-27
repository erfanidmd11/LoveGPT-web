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
import { useRouter } from 'next/router';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import Footer from '@/components/common/Footer';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import onboardingMemory from '@/lib/onboardingMemory';

const philosophies = [
  {
    label: 'Saver 🐿️',
    description: 'I value budgeting and saving for the future. I avoid unnecessary expenses.',
  },
  {
    label: 'Spender 💸',
    description:
      'I believe money is meant to be enjoyed. I treat myself often and live in the moment.',
  },
  {
    label: 'Investor 📈',
    description: 'I see money as a tool for building long-term wealth. I take calculated risks.',
  },
  {
    label: 'Provider 🛡️',
    description:
      'I enjoy taking financial responsibility for my loved ones and offering stability.',
  },
  {
    label: 'Partnership 💖',
    description:
      'I believe in sharing financial roles and making joint money decisions with my partner.',
  },
  {
    label: 'Still figuring it out 🧔',
    description:
      "I'm working on finding the right balance with money that feels good and sustainable.",
  },
];

export default function Step26FinancialPhilosophy() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [selected, setSelected] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step26FinancialPhilosophy').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    const loadFinancialPhilosophy = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.financialPhilosophy) {
            setSelected(data.financialPhilosophy);
            onboardingMemory.financialPhilosophy = data.financialPhilosophy;
          }
        }
      } catch (err) {
        console.error('Error loading financial philosophy:', err);
      }
    };
    loadFinancialPhilosophy();
  }, [uid]);

  const toggleSelection = async (value: string) => {
    setSelected(value);
    onboardingMemory.financialPhilosophy = value;

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            financialPhilosophy: value,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving financial philosophy:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step26', values);
      await saveAnswerToFirestore(uid, 'Step26', values);
    }
    if (!selected) {
      Alert.alert('Choose One', 'Please choose your current financial philosophy.');
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
          financialPhilosophy: selected,
          onboardingStep: 26,
        },
        { merge: true }
      );

      onboardingMemory.financialPhilosophy = selected;
      router.replace("/onboarding/" + 'Step27ConflictResolution', { uid }.toLowerCase() + "?uid=" + uid); // 🚀 Move to next step
    } catch (error) {
      console.error('Error saving financial philosophy:', error);
      Alert.alert('Error', 'Could not save your selection. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getSmartCue = () => {
    if (!selected) {
      return '🌟 Money mindsets shape partnerships more than most realize — ARIA listens closely to how you value and nurture abundance.';
    }
    if (selected.includes('Saver')) {
      return '🐿️ Your carefulness builds security — ARIA will help you attract partners who respect stability.';
    }
    if (selected.includes('Spender')) {
      return '💸 You cherish life’s pleasures — ARIA will help you balance enjoyment with long-term security.';
    }
    if (selected.includes('Investor')) {
      return '📈 Your eyes see future growth — ARIA will help you find partners who can build legacies with you.';
    }
    if (selected.includes('Provider')) {
      return '🛡️ You protect and uplift — ARIA will help you choose partners who appreciate and reciprocate your generosity.';
    }
    if (selected.includes('Partnership')) {
      return '💖 True wealth is shared — ARIA will help you find teammates for love and life.';
    }
    if (selected.includes('Still figuring')) {
      return '🧔 Your journey toward financial peace is sacred — ARIA will honor your evolving path with patience.';
    }
    return '✨ Your financial philosophy isn’t about money — it’s about values, dreams, and future vision.';
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
              <ProgressBar current={26} total={32} />
              <Text style={styles.title}>What’s your financial philosophy?</Text>

              <View style={styles.options}>
                {philosophies.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    onPress={() => toggleSelection(item.label)}
                    style={[styles.option, selected === item.label && styles.selected]}
                  >
                    <Text
                      style={[styles.optionText, selected === item.label && styles.selectedText]}
                    >
                      {item.label}
                    </Text>
                    <Text style={styles.description}>{item.description}</Text>
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  selectedText: {
    color: '#047857',
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
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
