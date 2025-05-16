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

const communicationStyles = [
  { value: 'direct', label: '🔊 Direct — I speak my mind openly and confidently.' },
  { value: 'thoughtful', label: '📚 Thoughtful — I think carefully before responding.' },
  { value: 'playful', label: '🎭 Playful — I use humor and lightness to connect.' },
  { value: 'reserved', label: '🤫 Reserved — I express myself more through actions than words.' },
  { value: 'emotional', label: '💖 Emotional — I’m passionate and expressive.' },
  { value: 'diplomatic', label: '🕊️ Diplomatic — I prioritize peace and careful framing.' },
];

export default function Step21CommunicationStyle() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [selected, setSelected] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCommunicationStyle = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.communicationStyle) {
            setSelected(data.communicationStyle);
            onboardingMemory.communicationStyle = data.communicationStyle;
          }
        }
      } catch (err) {
        console.error('Error loading communication style:', err);
      }
    };
    loadCommunicationStyle();
  }, [uid]);

  const toggleSelection = async (value: string) => {
    setSelected(value);
    onboardingMemory.communicationStyle = value;

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            communicationStyle: value,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving communication style:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (!selected) {
      Alert.alert('Choose One', 'Please select your communication style.');
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
          communicationStyle: selected,
          onboardingStep: 21,
        },
        { merge: true }
      );

      onboardingMemory.communicationStyle = selected;
      navigation.replace('Step22Lifestyle', { uid });
    } catch (error) {
      console.error('Error saving communication style:', error);
      Alert.alert('Error', 'Could not save your communication style. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getSmartCue = () => {
    if (!selected) {
      return '🌟 Understanding your communication style helps ARIA mirror your voice and amplify your truth.';
    }
    if (selected === 'direct') {
      return '🔊 You speak with power — ARIA will teach you when to soften without losing strength.';
    }
    if (selected === 'thoughtful') {
      return '📚 Your thoughtful words are gifts — ARIA will encourage you to share your inner wisdom.';
    }
    if (selected === 'playful') {
      return '🎭 Your lightness disarms hearts — ARIA will help you weave humor into deeper connection.';
    }
    if (selected === 'reserved') {
      return '🤫 Your presence speaks louder than noise — ARIA will show you when to step into words bravely.';
    }
    if (selected === 'emotional') {
      return '💖 Your emotions are your compass — ARIA will teach you how to express them with clarity and care.';
    }
    if (selected === 'diplomatic') {
      return '🕊️ Your peacekeeping is precious — ARIA will remind you that your truth matters too.';
    }
    return '✨ Communication is not just speaking — it’s connecting, and ARIA listens carefully.';
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
              <ProgressBar current={21} total={32} />
              <Text style={styles.progressText}>Step 21 of 32 — Communication Style</Text>

              <Text style={styles.title}>How do you typically communicate?</Text>

              <View style={styles.optionList}>
                {communicationStyles.map((style) => (
                  <TouchableOpacity
                    key={style.value}
                    style={[styles.option, selected === style.value && styles.selected]}
                    onPress={() => toggleSelection(style.value)}
                  >
                    <Text
                      style={[styles.optionText, selected === style.value && styles.selectedText]}
                    >
                      {style.label}
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
  optionList: {
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
