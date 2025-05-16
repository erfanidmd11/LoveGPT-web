import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import Footer from '@/components/common/Footer';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import TypingText from '@/components/common/TypingText';

export default function Step17AIConsent() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [allowConversationAnalysis, setAllowConversationAnalysis] = useState(false);
  const [allowLocationSuggestions, setAllowLocationSuggestions] = useState(false);
  const [allowEmotionalTracking, setAllowEmotionalTracking] = useState(false);
  const [allowBioPhysicalTracking, setAllowBioPhysicalTracking] = useState(false);
  const [allowSmartKeyboard, setAllowSmartKeyboard] = useState(false);
  const [allowListeningMode, setAllowListeningMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showTrustModal, setShowTrustModal] = useState(false);
  const [trustModalShown, setTrustModalShown] = useState(false);
  const [modalOpacity] = useState(new Animated.Value(1));

  useEffect(() => {
    const loadConsent = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const settings = data?.consentSettings || {};
          setAllowConversationAnalysis(settings.allowConversationAnalysis || false);
          setAllowLocationSuggestions(settings.allowLocationSuggestions || false);
          setAllowEmotionalTracking(settings.allowEmotionalTracking || false);
          setAllowBioPhysicalTracking(settings.allowBioPhysicalTracking || false);
          setAllowSmartKeyboard(settings.allowSmartKeyboard || false);
          setAllowListeningMode(settings.allowListeningMode || false);
        }
      } catch (err) {
        console.error('Error loading consent settings:', err);
      }
    };
    loadConsent();

    // Adding header dynamically
    navigation.setOptions({
      headerTitle: 'AI Consent',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ marginLeft: 15, color: '#007bff' }}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => alert('Profile Settings')}>
          <Text style={{ marginRight: 15, color: '#007bff' }}>Settings</Text>
        </TouchableOpacity>
      ),
    });
  }, [uid, navigation]);

  const saveConsentSettings = async (updates: any) => {
    if (!uid) return;
    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          consentSettings: {
            allowConversationAnalysis,
            allowLocationSuggestions,
            allowEmotionalTracking,
            allowBioPhysicalTracking,
            allowSmartKeyboard,
            allowListeningMode,
            ...updates,
          },
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Error saving partial consent:', err);
    }
  };

  const handleToggle = (key: string, value: boolean) => {
    switch (key) {
      case 'conversation':
        setAllowConversationAnalysis(value);
        saveConsentSettings({ allowConversationAnalysis: value });
        break;
      case 'location':
        setAllowLocationSuggestions(value);
        saveConsentSettings({ allowLocationSuggestions: value });
        break;
      case 'emotional':
        setAllowEmotionalTracking(value);
        saveConsentSettings({ allowEmotionalTracking: value });
        break;
      case 'bio':
        setAllowBioPhysicalTracking(value);
        saveConsentSettings({ allowBioPhysicalTracking: value });
        break;
      case 'keyboard':
        setAllowSmartKeyboard(value);
        saveConsentSettings({ allowSmartKeyboard: value });
        break;
      case 'listening':
        setAllowListeningMode(value);
        saveConsentSettings({ allowListeningMode: value });
        break;
    }
  };

  const handleContinue = async () => {
    if (!uid) {
      console.error('Missing UID!');
      return;
    }

    if (
      !trustModalShown &&
      !allowConversationAnalysis &&
      !allowLocationSuggestions &&
      !allowEmotionalTracking &&
      !allowBioPhysicalTracking &&
      !allowSmartKeyboard &&
      !allowListeningMode
    ) {
      setShowTrustModal(true);
      setTrustModalShown(true);

      const messageLength = 160;
      const typingSpeed = 70;
      const typingDuration = messageLength * typingSpeed;
      const holdTimeAfterTyping = 2500;
      const totalModalTime = typingDuration + holdTimeAfterTyping;

      setTimeout(() => {
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }).start(() => {
          setShowTrustModal(false);
          navigation.replace('Step18Parenthood', { uid });
        });
      }, totalModalTime);
    } else {
      navigation.replace('Step18Parenthood', { uid });
    }
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
              <ProgressBar current={17} total={32} />

              <Text style={styles.title}>🌟 Your Journey, Your Choices</Text>

              <Text style={styles.subTitle}>
                I'm here to mirror your truth, celebrate your growth, and lovingly support your
                dreams. Always on your terms.
              </Text>

              <Text style={styles.consentText}>
                🤝 Here's my pinky promise: I'll never share, sell, or whisper your secrets. Ever.
                Everything I learn is to better champion **your** dreams, **your** healing, and
                **your** love story. 💖
              </Text>

              <View style={styles.optionRow}>
                <Switch
                  value={allowConversationAnalysis}
                  onValueChange={(value) => handleToggle('conversation', value)}
                  trackColor={{ false: '#ccc', true: '#ec4899' }}
                  thumbColor={allowConversationAnalysis ? '#fff' : '#f4f3f4'}
                />
                <Text style={styles.optionText}>
                  Allow conversation analysis (texts, voice, notes)
                </Text>
              </View>

              <View style={styles.optionRow}>
                <Switch
                  value={allowLocationSuggestions}
                  onValueChange={(value) => handleToggle('location', value)}
                  trackColor={{ false: '#ccc', true: '#ec4899' }}
                  thumbColor={allowLocationSuggestions ? '#fff' : '#f4f3f4'}
                />
                <Text style={styles.optionText}>
                  Allow location-based suggestions (flowers, cozy date spots)
                </Text>
              </View>

              <View style={styles.optionRow}>
                <Switch
                  value={allowEmotionalTracking}
                  onValueChange={(value) => handleToggle('emotional', value)}
                  trackColor={{ false: '#ccc', true: '#ec4899' }}
                  thumbColor={allowEmotionalTracking ? '#fff' : '#f4f3f4'}
                />
                <Text style={styles.optionText}>Allow emotional and mood tracking over time</Text>
              </View>

              <View style={styles.optionRow}>
                <Switch
                  value={allowBioPhysicalTracking}
                  onValueChange={(value) => handleToggle('bio', value)}
                  trackColor={{ false: '#ccc', true: '#ec4899' }}
                  thumbColor={allowBioPhysicalTracking ? '#fff' : '#f4f3f4'}
                />
                <Text style={styles.optionText}>
                  Allow heart rate, stress, and wellness insights
                </Text>
              </View>

              <View style={styles.optionRow}>
                <Switch
                  value={allowSmartKeyboard}
                  onValueChange={(value) => handleToggle('keyboard', value)}
                  trackColor={{ false: '#ccc', true: '#ec4899' }}
                  thumbColor={allowSmartKeyboard ? '#fff' : '#f4f3f4'}
                />
                <Text style={styles.optionText}>
                  Allow LoveGPT Smart Keyboard emotional tone monitoring
                </Text>
              </View>

              <View style={styles.optionRow}>
                <Switch
                  value={allowListeningMode}
                  onValueChange={(value) => handleToggle('listening', value)}
                  trackColor={{ false: '#ccc', true: '#ec4899' }}
                  thumbColor={allowListeningMode ? '#fff' : '#f4f3f4'}
                />
                <Text style={styles.optionText}>
                  Allow ARIA Listening Mode during conversations (manual start)
                </Text>
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </KeyboardAvoidingView>
      {/* Trust Modal with Typing Animation */}
      <Modal transparent visible={showTrustModal} animationType="none">
        <Animated.View style={[styles.modalBackground, { opacity: modalOpacity }]}>
          <View style={styles.modalContent}>
            <TypingText
              fullText="🌸 It's completely okay if you're not ready yet. Trust is a journey. Whenever you feel comfortable, you can turn these permissions on from your dashboard. I'm honored to walk beside you. 💬 — ARIA"
              speed={70}
            />
          </View>
        </Animated.View>
      </Modal>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.ariaContainer}>
          <AnimatedValueCue message="Trust blooms slowly 🌱 — I'm here, no rush, no pressure." />
        </View>

        <Footer
          onNext={handleContinue}
          onBack={() => navigation.goBack()}
          nextDisabled={false}
          saving={saving}
        />
      </View>
    </SafeAreaView>
  );
}

// 🖌️ Styles

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, backgroundColor: '#f9fafb' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#111827',
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  consentText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    paddingHorizontal: 8,
    lineHeight: 22,
    marginBottom: 28,
  },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  optionText: { fontSize: 15, marginLeft: 12, flex: 1, color: '#374151' },
  footer: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  ariaContainer: { marginBottom: 8, backgroundColor: '#f3f4f6', padding: 12, borderRadius: 10 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 14, maxWidth: '80%' },
});
