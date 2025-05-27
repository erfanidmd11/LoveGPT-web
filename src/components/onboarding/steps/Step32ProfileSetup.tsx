import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
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
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'next/router';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import Footer from '@/components/common/Footer';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import onboardingMemory from '@/lib/onboardingMemory';

export default function Step32ProfileSetup() {
  const navigation = useNavigation<any>();
  const route =   const uid = route?.params?.uid;
  const userDOB = route?.params?.userDOB;

  const [photo, setPhoto] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [idealRelationship, setIdealRelationship] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step32ProfileSetup').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    if (uid) {
      loadProfileSetup();
    }
  }, [uid]);

  const loadProfileSetup = async () => {
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data?.profilePhoto) setPhoto(data.profilePhoto);
        if (data?.aboutMe) setBio(data.aboutMe);
        if (data?.idealRelationship) setIdealRelationship(data.idealRelationship);

        onboardingMemory.profilePhoto = data?.profilePhoto || null;
        onboardingMemory.aboutMe = data?.aboutMe || '';
        onboardingMemory.idealRelationship = data?.idealRelationship || '';
      }
    } catch (err) {
      console.error('Error loading profile setup:', err);
    }
  };

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to media to upload a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      onboardingMemory.profilePhoto = result.assets[0].uri;
    }
  };

  const handleFinish = async () => {
    if (!photo || bio.trim().length < 10 || idealRelationship.trim().length < 10) {
      Alert.alert('Complete Your Profile', 'Please add a photo and complete both text fields.');
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
          profilePhoto: photo,
          aboutMe: bio,
          idealRelationship: idealRelationship,
          onboardingStep: 32,
          onboardingComplete: true,
          'ARIA.dynamicProfile.aboutMe': bio,
          'ARIA.dynamicProfile.idealRelationship': idealRelationship,
          'ARIA.dynamicProfile.profilePhoto': photo,
        },
        { merge: true }
      );

      onboardingMemory.profilePhoto = photo;
      onboardingMemory.aboutMe = bio;
      onboardingMemory.idealRelationship = idealRelationship;
      onboardingMemory.lastStepCompleted = 32;

      router.replace("/onboarding/DashboardHome?uid=" + uid); // ✅ Move to Dashboard!
    } catch (error) {
      console.error('Error saving profile setup:', error);
      Alert.alert('Error', 'Could not save your profile. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getSmartCue = () => {
    if (!bio && !idealRelationship) {
      return '🌟 Your words and image are a mirror to your soul. ARIA will help reflect your highest truth.';
    }
    if (bio && idealRelationship) {
      return '🌈 Your essence and your dreams are powerful. ARIA will guide you toward aligned, conscious connections.';
    }
    if (bio) {
      return '🖋️ Sharing your story helps create deeper resonance. ARIA celebrates your authenticity.';
    }
    if (idealRelationship) {
      return '❤️ Defining your ideal love opens the door for destiny. ARIA is listening closely.';
    }
    return '✨ Your story is being written with love. Let’s tell it beautifully.';
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
              <ProgressBar step=32 totalSteps=32 />
              <Text style={styles.title}>Create Your Public Profile</Text>

              <TouchableOpacity style={styles.photoButton} onPress={pickPhoto}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photoPreview} />
                ) : (
                  <Text style={styles.photoButtonText}>+ Upload Profile Photo</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.label}>About Me</Text>
              <TextInput
                style={[styles.input, { minHeight: 120 }]}
                placeholder="Tell us who you are in your own words..."
                multiline
                value={bio}
                onChangeText={(text) => {
                  setBio(text);
                  onboardingMemory.aboutMe = text;
                }}
                textAlignVertical="top"
              />

              <Text style={styles.label}>My Ideal Relationship</Text>
              <TextInput
                style={[styles.input, { minHeight: 120 }]}
                placeholder="What does meaningful connection look like to you?"
                multiline
                value={idealRelationship}
                onChangeText={(text) => {
                  setIdealRelationship(text);
                  onboardingMemory.idealRelationship = text;
                }}
                textAlignVertical="top"
              />
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
          onNext={handleFinish}
          onBack={handleBack}
          nextDisabled={!photo || bio.trim().length < 10 || idealRelationship.trim().length < 10}
          saving={saving}
          nextLabel="Finish"
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
    textAlign: 'center',
    marginBottom: 20,
    color: '#111827',
  },
  photoButton: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  photoButtonText: {
    color: '#b45309',
    fontWeight: '600',
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  dob: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
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
