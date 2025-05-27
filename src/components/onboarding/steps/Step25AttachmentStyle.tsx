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

const attachmentStyles = [
  {
    label: 'Secure 💚',
    description:
      'I’m comfortable with intimacy and trust. I can communicate openly and handle conflict calmly.',
  },
  {
    label: 'Anxious 💛',
    description: 'I crave closeness but worry I’m not truly loved. I need reassurance often.',
  },
  {
    label: 'Avoidant 💙',
    description: 'I value independence. I tend to pull away when things get emotionally intense.',
  },
  {
    label: 'Fearful-Avoidant 💔',
    description:
      'I desire love but fear rejection. My reactions can feel inconsistent or confusing.',
  },
  {
    label: 'Not sure yet 🤔',
    description: 'I’m still exploring how I attach in relationships — and that’s okay!',
  },
];

export default function Step25AttachmentStyle() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [selected, setSelected] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step25AttachmentStyle').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    const loadAttachmentStyle = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.attachmentStyle) {
            setSelected(data.attachmentStyle);
            onboardingMemory.attachmentStyle = data.attachmentStyle;
          }
        }
      } catch (err) {
        console.error('Error loading attachment style:', err);
      }
    };
    loadAttachmentStyle();
  }, [uid]);

  const toggleSelection = async (value: string) => {
    setSelected(value);
    onboardingMemory.attachmentStyle = value;

    if (uid) {
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            attachmentStyle: value,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving attachment style:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step25', values);
      await saveAnswerToFirestore(uid, 'Step25', values);
    }
    if (!selected) {
      Alert.alert('Select One', 'Please choose the attachment style that feels closest to you.');
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
          attachmentStyle: selected,
          onboardingStep: 25,
        },
        { merge: true }
      );

      onboardingMemory.attachmentStyle = selected;
      router.replace("/onboarding/" + 'Step26FinancialPhilosophy', { uid }.toLowerCase() + "?uid=" + uid); // 🚀 Go to next step
    } catch (error) {
      console.error('Error saving attachment style:', error);
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
      return '🌟 Understanding your attachment style allows ARIA to guide you toward safer, deeper connections.';
    }
    if (selected.includes('Secure')) {
      return '💚 Your heart trusts wisely — ARIA will help you build equally strong, open-hearted bonds.';
    }
    if (selected.includes('Anxious')) {
      return '💛 Your need for reassurance is sacred — ARIA will guide you toward calming, solid love.';
    }
    if (selected.includes('Avoidant')) {
      return '💙 Independence is your strength — ARIA will teach you how to open safely without fear.';
    }
    if (selected.includes('Fearful-Avoidant')) {
      return '💔 Your bravery despite fear is beautiful — ARIA will help you anchor love without chaos.';
    }
    if (selected.includes('Not sure yet')) {
      return '🤔 Exploration is courage — ARIA walks beside you as you discover your emotional blueprint.';
    }
    return '✨ Attachment patterns are not flaws — they are invitations to deeper healing and connection.';
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
              <ProgressBar current={25} total={32} />
              <Text style={styles.title}>Your Attachment Style</Text>

              <View style={styles.options}>
                {attachmentStyles.map((style) => (
                  <TouchableOpacity
                    key={style.label}
                    onPress={() => toggleSelection(style.label)}
                    style={[styles.option, selected === style.label && styles.selected]}
                  >
                    <Text
                      style={[styles.optionText, selected === style.label && styles.selectedText]}
                    >
                      {style.label}
                    </Text>
                    <Text style={styles.description}>{style.description}</Text>
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
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  selectedText: {
    color: '#1d4ed8',
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
