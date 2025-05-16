import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Keyboard, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import BackButton from '@/components/common/BackButton';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import { chineseZodiacData } from '@/data/chineseZodiacData';
import { saveAnswer } from '@/lib/saveAnswer';
import Header from '@/components/Header';  // Import Header
import Footer from '@/components/Footer';  // Import Footer

export default function Step6Gender() {
  const navigation = useNavigation();
  const route = useRoute();

  const uid = route?.params?.uid; // ✅ Get UID correctly

  const [gender, setGender] = useState('');
  const [firstName, setFirstName] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [chineseZodiacAnimal, setChineseZodiacAnimal] = useState('');

  useEffect(() => {
    (async () => {
      if (!uid) return;

      try {
        const userSnap = await getDoc(doc(db, 'users', uid));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setFirstName(userData?.firstName || '');
          setZodiac(userData?.zodiac || '');
          setGender(userData?.onboardingGender || '');

          const year = new Date(userData?.dob).getFullYear();
          const chineseAnimal = chineseZodiacData[year % 12]?.animal || 'Mystery';
          setChineseZodiacAnimal(chineseAnimal);
        }
      } catch (error) {
        console.error('Error fetching user for personalization:', error);
      }
    })();
  }, [uid]);

  const handleContinue = async () => {
    if (!gender) {
      Alert.alert('Missing Info', 'Please select your gender to continue.');
      return;
    }

    if (!uid) {
      console.error('UID missing — cannot save gender.');
      Alert.alert('Error', 'Missing user ID. Cannot save your gender.');
      return;
    }

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          onboardingGender: gender,
          onboardingStep: 6,
        },
        { merge: true }
      );

      await saveAnswer('onboardingGender', gender);

      navigation.replace('Step7RelationshipStatus', { uid }); // ✅ Pass UID to Step7
    } catch (error) {
      console.error('Error saving gender:', error);
      Alert.alert('Error', 'Could not save your gender. Try again.');
    }
  };

  const personalizedMessage = () => {
    if (!firstName)
      return 'Clarity starts with identity. I’m not here to label your path — just to understand who you are, so I can guide you with wisdom that fits.';

    let extraWisdom = '';

    if (zodiac && gender) {
      if (gender === 'male') {
        extraWisdom = ` As a ${zodiac} man, your resilience and drive define you. 🚀`;
      } else if (gender === 'female') {
        extraWisdom = ` As a ${zodiac} woman, your intuition and grace are your superpowers. 🌸`;
      }
    }

    return `Hi ${firstName} 👋🏼 — born under ${zodiac || 'the stars'} ✨ and blessed by the ${chineseZodiacAnimal || 'Mystery Spirit'} 🐉.${extraWisdom} Let's align your heart, your truth, and your future.`;
  };

  return (
    <Pressable onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header */}
        <Header />

        <ProgressBar current={6} total={25} />
        <Text style={styles.title}>What is your gender?</Text>

        <View style={styles.options}>
          <TouchableOpacity
            style={[styles.option, gender === 'male' && styles.selected]}
            onPress={() => setGender('male')}
          >
            <Text style={[styles.optionText, gender === 'male' && styles.selectedText]}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, gender === 'female' && styles.selected]}
            onPress={() => setGender('female')}
          >
            <Text style={[styles.optionText, gender === 'female' && styles.selectedText]}>
              Female
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        {/* Back Button */}
        <BackButton />

        <AnimatedValueCue key={gender} message={personalizedMessage()} />

        {/* Footer */}
        <Footer />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 24,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  selected: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  optionText: {
    fontSize: 16,
    color: '#4B5563',
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
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
