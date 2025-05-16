import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import BackButton from '@/components/common/BackButton';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import Header from '@/components/Header';  // Import Header
import Footer from '@/components/Footer';  // Import Footer
import onboardingMemory from '@/lib/onboardingMemory';

const initialValues = [
  'Family',
  'Faith',
  'Career',
  'Adventure',
  'Stability',
  'Creativity',
  'Growth',
  'Freedom',
  'Kindness',
  'Health',
  'Wisdom',
  'Service',
];

export default function Step10CoreValues() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const uid = route?.params?.uid;

  const [values, setValues] = useState<{ key: string; label: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchValues = async () => {
      if (!uid) return;
      try {
        if (onboardingMemory.coreValuesRanked.length) {
          setValues(onboardingMemory.coreValuesRanked);
        } else {
          const userRef = doc(db, 'users', uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data?.coreValuesRanked) {
              const sorted = data.coreValuesRanked
                .sort((a: any, b: any) => a.rank - b.rank)
                .map((item: any) => ({ key: item.value, label: item.value }));
              setValues(sorted);
              onboardingMemory.coreValuesRanked = sorted;
            } else {
              const defaults = initialValues.map((v) => ({ key: v, label: v }));
              setValues(defaults);
              onboardingMemory.coreValuesRanked = defaults;
            }
          }
        }
      } catch (err) {
        console.error('Error loading core values:', err);
      }
    };
    fetchValues();
  }, [uid]);

  const handleContinue = async () => {
    if (!uid) {
      Alert.alert('Error', 'Missing user ID. Cannot save.');
      return;
    }

    const rankedCoreValues = values.map((item, index) => ({
      value: item.label,
      rank: index + 1,
    }));

    setSaving(true);

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          coreValuesRanked: rankedCoreValues,
          onboardingStep: 10,
        },
        { merge: true }
      );

      onboardingMemory.coreValuesRanked = values;

      navigation.replace('Step11Personality', { uid });
    } catch (error) {
      console.error('Error saving core values:', error);
      Alert.alert('Error', 'Could not save your core values. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getPersonalizedCue = () => {
    if (!values.length) return '';
    const top = values[0]?.label;
    const second = values[1]?.label;
    if (top && second) {
      return `🌟 You treasure "${top}" most, closely followed by "${second}". ARIA sees your soul's beautiful blueprint.`;
    }
    if (top) {
      return `🌟 "${top}" stands as your guiding light.`;
    }
    return '';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <View style={styles.container}>
            {/* Header */}
            <Header />

            <ProgressBar current={10} total={32} />
            <Text style={styles.progressText}>Step 10 of 32 — Core Values</Text>
            <Text style={styles.title}>Rank Your Core Values</Text>
            <Text style={styles.instructions}>
              💡 <Text style={{ fontWeight: 'bold' }}>PRESS AND HOLD</Text> to drag and reorder your values.
            </Text>

            <DraggableFlatList
              data={values}
              onDragEnd={({ data }) => setValues(data)}
              keyExtractor={(item) => item.key}
              renderItem={({ item, drag, isActive }) => (
                <TouchableOpacity
                  style={[styles.wordChip, isActive && styles.activeItem]}
                  onLongPress={drag}
                >
                  <Text style={styles.wordText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              activationDistance={10}
              scrollEnabled
              showsVerticalScrollIndicator
              contentContainerStyle={{ paddingBottom: 200 }}
            />
          </View>
        </Pressable>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        {values.length > 0 && (
          <View style={styles.ariaContainer}>
            <AnimatedValueCue message={getPersonalizedCue()} />
          </View>
        )}

        <View style={styles.buttonRow}>
          <BackButton onPress={handleBack} disabled={saving} />
          <TouchableOpacity
            style={[styles.nextButton, saving && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Next</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
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
    marginBottom: 4,
    textAlign: 'center',
    color: '#111827',
  },
  instructions: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 50,
    marginVertical: 6,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  activeItem: {
    backgroundColor: '#f9a8d4',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 6,
      },
    }),
  },
  wordText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nextButton: {
    backgroundColor: '#ec4899',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonDisabled: {
    backgroundColor: '#f9a8d4',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
