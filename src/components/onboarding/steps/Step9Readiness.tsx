import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
} from 'react-native';
import { useRouter } from 'next/router';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import Header from '@/components/Header';  // Import Header
import Footer from '@/components/Footer';  // Import Footer
import { saveAnswer, getAnswer } from '@/lib/saveAnswer'; // ✅ using AsyncStorage version
import onboardingMemory from '@/lib/onboardingMemory'; // ✅ using global memory fallback

const readinessQuestionsByContext: { [key: string]: { label: string; value: string }[] } = {
  single_long_term: [
    { label: "💖 I'm emotionally available and seeking a lasting partnership", value: 'available_seeking' },
    { label: "🛡️ I'm healing past wounds but hopeful", value: 'healing_hopeful' },
    { label: "🔍 I'm still clarifying what I want", value: 'clarifying_goals' },
    { label: "😌 I'm open but afraid of vulnerability", value: 'fear_vulnerability' },
  ],
  single_casual: [
    { label: "😌 I'm seeking freedom and light-hearted experiences", value: 'lighthearted_explorer' },
    { label: "🚶‍♂️ I'm avoiding deep commitments right now", value: 'avoiding_commitment' },
    { label: "🔍 I'm exploring myself without rushing", value: 'self_exploration' },
  ],
  married_strengthen_marriage: [
    { label: '🌱 Ready to grow emotionally with my partner', value: 'grow_together' },
    { label: '💬 Want to rebuild emotional intimacy', value: 'rebuild_intimacy' },
    { label: '🧱 Working on trust and communication', value: 'trust_communication' },
  ],
  separated_self_healing: [
    { label: '🧘 Focused on healing fully before opening up again', value: 'full_healing' },
    { label: '🌱 Tentatively ready to explore emotional connection', value: 'tentative_exploration' },
    { label: '🔒 Guarded, but curious', value: 'guarded_curious' },
  ],
  divorced_love_again: [
    { label: '❤️ Ready to trust love again', value: 'trust_love_again' },
    { label: '🛡️ Cautious but open to possibilities', value: 'cautious_open' },
    { label: '🧘 Working through past hurts first', value: 'healing_past' },
  ],
  default: [
    { label: "🟢 I'm emotionally available and ready", value: 'green_ready' },
    { label: "🟡 I'm open but cautious", value: 'yellow_cautious' },
    { label: "🔴 I'm focusing on self-discovery first", value: 'red_self_discovery' },
  ],
};

export default function Step9Readiness() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;
  const relationshipStatus = route?.params?.relationshipStatus || '';
  const relationshipGoals = route?.params?.relationshipGoals || '';

  const [selected, setSelected] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (!uid) {
      console.error('UID missing when loading Step9.');
      Alert.alert('Error', 'Missing user ID. Returning to previous screen.');
      router.back();
      return;
    }

    // Always immediately set options
    const contextKey = `${relationshipStatus.toLowerCase()}_${relationshipGoals.toLowerCase()}`;
    const dynamicOptions =
      readinessQuestionsByContext[contextKey] || readinessQuestionsByContext['default'];
    setOptions(dynamicOptions);

    const loadSelected = async () => {
      if (onboardingMemory.readinessLevel) {
        setSelected(onboardingMemory.readinessLevel);
      } else {
        const localSelected = await getAnswer('readinessLevel');
        if (localSelected) {
          setSelected(localSelected);
          onboardingMemory.readinessLevel = localSelected;
        } else {
          try {
            const userRef = doc(db, 'users', uid);
            const snap = await getDoc(userRef);
            if (snap.exists()) {
              const data = snap.data();
              if (data?.readinessLevel) {
                setSelected(data.readinessLevel);
                onboardingMemory.readinessLevel = data.readinessLevel;
              }
            }
          } catch (err) {
            console.error('Error fetching readinessLevel from Firebase:', err);
          }
        }
      }
    };

    loadSelected();
  }, [uid, relationshipStatus, relationshipGoals]);

  const handleSelection = async (value: string) => {
    setSelected(value);
    onboardingMemory.readinessLevel = value;
    await saveAnswer('readinessLevel', value);
  };

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step9', values);
      await saveAnswerToFirestore(uid, 'Step9', values);
    }
    if (!selected) {
      Alert.alert('Missing Info', 'Please select your emotional readiness.');
      return;
    }

    setSaving(true);

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          readinessLevel: selected,
          onboardingStep: 9,
        },
        { merge: true }
      );

      router.replace("/onboarding/" + 'Step10CoreValues', { uid }.toLowerCase() + "?uid=" + uid);
    } catch (error) {
      console.error('Error saving readiness level:', error);
      Alert.alert('Error', 'Could not save your readiness. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const getPersonalizedCue = () => {
    if (!selected) return '';
    const personalized: { [key: string]: string } = {
      available_seeking: '💖 Your heart is open — a beautiful place to start.',
      healing_hopeful: '🛡️ Healing is strength. Hope is your guiding star.',
      clarifying_goals: '🔍 Clarity is coming. Trust your unfolding path.',
      fear_vulnerability: '😌 Vulnerability feels scary, but it builds the deepest bonds.',
      lighthearted_explorer: '😄 Lightness and laughter can heal hearts too.',
      avoiding_commitment: '🚶‍♂️ Your freedom matters — honor your journey.',
      self_exploration: '🧘‍♂️ Exploring yourself is a worthy adventure.',
      grow_together: "🌱 Growing together is love's greatest expansion.",
      rebuild_intimacy: '💬 Courageous connection rebuilds intimacy.',
      trust_communication: '🧱 Trust and communication are the real foundations.',
      full_healing: '🧘 Your healing matters more than timelines.',
      tentative_exploration: '🌱 Small steps toward connection are still steps.',
      guarded_curious: '🔒 Guarding your heart is wisdom — curiosity is courage.',
      trust_love_again: '❤️ You’re rediscovering the courage to love again.',
      cautious_open: "🛡️ Caution doesn't block love — it protects the journey.",
      healing_past: '🧘 Healing your past opens doors to new beginnings.',
      green_ready: '🟢 Your readiness shines bright. Let’s move forward.',
      yellow_cautious: '🟡 Your caution is wisdom. Timing matters.',
      red_self_discovery: '🔴 Your self-exploration is sacred work.',
    };
    return personalized[selected] || '🌸 Trust your timing. ARIA is with you every step.';
  };

  const handleBlockBack = () => {
    Alert.alert('Action Blocked', "You cannot go back at this stage. Let's continue forward!");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Header />

          <ProgressBar current={9} total={32} />

          <Text style={styles.title}>How emotionally ready are you?</Text>

          <View style={styles.options}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.option, selected === opt.value && styles.selected]}
                onPress={() => handleSelection(opt.value)}
                disabled={saving}
              >
                <Text style={[styles.optionText, selected === opt.value && styles.selectedText]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Next</Text>
            )}
          </TouchableOpacity>

          {/* Back Button */}
          <BackButton onPress={handleBlockBack} disabled={saving} />

          {selected && (
            <View style={styles.ariaContainer}>
              <AnimatedValueCue message={getPersonalizedCue()} />
            </View>
          )}

          {/* Footer */}
          <Footer />
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
    paddingBottom: 140,
    flexGrow: 1,
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
    marginBottom: 20,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  selected: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  optionText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#ec4899',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#f9a8d4',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  ariaContainer: {
    marginTop: 20,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 10,
  },
});
