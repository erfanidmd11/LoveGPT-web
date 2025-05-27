import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Keyboard, Pressable } from 'react-native';
import { useRouter } from 'next/router';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import Header from '@/components/Header';  // Import Header
import Footer from '@/components/Footer';  // Import Footer

const optionsByStatus = {
  single: [
    { label: 'Long-Term Relationship', value: 'long_term' },
    { label: 'Marriage', value: 'marriage' },
    { label: 'Casual Dating', value: 'casual' },
    { label: 'Friendship & Emotional Connection', value: 'friendship' },
    { label: 'Self-Discovery & Healing', value: 'self_exploration' },
  ],
  'in a relationship': [
    { label: 'Deepen Connection', value: 'deepen_connection' },
    { label: 'Prepare for Marriage', value: 'prepare_marriage' },
    { label: 'Build Emotional Intimacy', value: 'emotional_intimacy' },
    { label: 'Grow Spiritually Together', value: 'spiritual_growth' },
  ],
  married: [
    { label: 'Strengthen Marriage', value: 'strengthen_marriage' },
    { label: 'Family Planning', value: 'family_planning' },
    { label: 'Renew Romance', value: 'renew_romance' },
    { label: 'Shared Life Purpose', value: 'life_purpose' },
  ],
  separated: [
    { label: 'Self-Healing & Reflection', value: 'healing_reflection' },
    { label: 'New Beginnings', value: 'new_beginnings' },
    { label: 'Friendship First', value: 'friendship_first' },
    { label: 'Exploring Trust Again', value: 'trust_exploration' },
    { label: 'Hookups & Casual Dating', value: 'hookups_casual' },
    { label: 'Getting Back Up & Finding Love Again', value: 'love_again' },
  ],
  divorced: [
    { label: 'Healing from Past', value: 'healing_past' },
    { label: 'Rediscovering Self', value: 'rediscover_self' },
    { label: 'Slowly Opening to Love', value: 'opening_to_love' },
    { label: 'Casual Connection First', value: 'casual_first' },
    { label: 'Hookups & Casual Dating', value: 'hookups_casual' },
    { label: 'Getting Back Up & Finding Love Again', value: 'love_again' },
  ],
  widowed: [
    { label: 'Healing Grief', value: 'healing_grief' },
    { label: 'Friendship & Support', value: 'friendship_support' },
    { label: 'Self-Love Journey', value: 'self_love' },
    { label: 'When Ready: Rebuild Hope', value: 'rebuild_hope' },
    { label: 'Hookups & Casual Dating', value: 'hookups_casual' },
    { label: 'Getting Back Up & Finding Love Again', value: 'love_again' },
  ],
  'it’s complicated': [
    { label: 'Clarity & Healing', value: 'clarity_healing' },
    { label: 'Explore Emotional Needs', value: 'emotional_needs' },
    { label: 'Friendship Before Romance', value: 'friendship_before_romance' },
    { label: 'Self-Reflection & Growth', value: 'self_reflection' },
    { label: 'Hookups & Casual Dating', value: 'hookups_casual' },
    { label: 'Getting Back Up & Finding Love Again', value: 'love_again' },
  ],
};

export default function Step8Intentions() {
  const router = useRouter();
  const uid = router.query.uid as string;

  const uid = route?.params?.uid;
  const relationshipStatusFromStep7 = route?.params?.relationshipStatus;

  const [selected, setSelected] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState(relationshipStatusFromStep7 || '');
  const [firstName, setFirstName] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        if (uid) {
          const userRef = doc(db, 'users', uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data?.firstName) setFirstName(data.firstName);
            if (data?.relationshipGoals) setSelected(data.relationshipGoals);
            if (data?.relationshipStatus) setRelationshipStatus(data.relationshipStatus);
          }
        }
      })();
    }, [uid])
  );

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step8', values);
      await saveAnswerToFirestore(uid, 'Step8', values);
    }
    if (!selected) {
      Alert.alert('Missing Info', 'Please select your intention to continue.');
      return;
    }

    if (!uid) {
      console.error('UID missing — cannot save intention.');
      Alert.alert('Error', 'Missing user ID. Cannot save your intention.');
      return;
    }

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          relationshipGoals: selected,
          onboardingStep: 8,
        },
        { merge: true }
      );

      router.replace("/onboarding/" + 'Step9Readiness', {
        uid,
        relationshipStatus,
        relationshipGoals: selected,
      }.toLowerCase() + "?uid=" + uid);
    } catch (error) {
      console.error('Error saving relationship goals:', error);
      Alert.alert('Error', 'Could not save your intention. Try again.');
    }
  };

  const getOptions = () => {
    const cleanStatus = (relationshipStatus || '').toLowerCase();
    if (optionsByStatus[cleanStatus]) {
      return optionsByStatus[cleanStatus];
    }
    return optionsByStatus['single'];
  };

  const getPersonalizedCue = () => {
    if (!firstName || !selected) {
      return "ARIA aligns your future matches and growth based on your deeper intentions. Let's be honest about what you truly desire.";
    }

    switch (selected) {
      case 'long_term':
        return `🌱 Beautiful, ${firstName}. Long-term love starts with long-term self-love. Let's plant seeds for something lasting.`;
      case 'marriage':
        return `💍 Big dreams, ${firstName}. Commitment is sacred. Let's prepare your heart for the forever you deserve.`;
      case 'casual':
        return `😌 It's okay to explore, ${firstName}. Casual connections help you understand your true desires without pressure.`;
      case 'friendship':
        return `🤝 Every great love story starts with deep friendship, ${firstName}. Let's build bonds that grow roots.`;
      case 'self_exploration':
        return `🧘‍♂️ Sometimes the greatest love story is the one with yourself, ${firstName}. Healing is love, too.`;
      case 'deepen_connection':
        return `🛤️ Beautiful journey, ${firstName}. Let's deepen the rivers of love you’ve already begun.`;
      case 'prepare_marriage':
        return `🔗 Preparing for forever, ${firstName}? Let's build emotional intimacy and resilience together.`;
      case 'emotional_intimacy':
        return `💬 True intimacy starts with courageous conversations, ${firstName}. Let's open the heart gates wide.`;
      case 'spiritual_growth':
        return `🌌 Spiritual journeys change everything, ${firstName}. Let's grow both inward and outward.`;
      case 'strengthen_marriage':
        return `🏡 Strengthening your home, ${firstName}? Let's build walls made of trust and laughter.`;
      case 'family_planning':
        return `👶 Family is a beautiful journey, ${firstName}. Let's align vision and values with love.`;
      case 'renew_romance':
        return `💖 Let's reignite the magic, ${firstName}. Every love needs fresh fire sometimes.`;
      case 'life_purpose':
        return `✨ Sharing a life purpose with someone is rare, ${firstName}. Let's build it on mutual respect.`;
      case 'healing_reflection':
        return `🧘 Healing your own heart first, ${firstName}, is the bravest path of all.`;
      case 'new_beginnings':
        return `🌱 New beginnings are tender. You're stronger than you know, ${firstName}.`;
      case 'trust_exploration':
        return `🔑 Rebuilding trust is a masterpiece, ${firstName}. Step by step.`;
      case 'love_again':
        return `❤️ The heart always knows how to love again, ${firstName}. Let's find your light.`;
      case 'clarity_healing':
        return `🕊️ Seeking clarity is a powerful first step, ${firstName}. Healing follows honesty.`;
      case 'self_reflection':
        return `🪞 Every answer you're seeking, ${firstName}, is already inside you.`;
      default:
        return `Your next chapter begins with clarity, ${firstName}. Let's align it with your truest heart. 🌸`;
    }
  };

  const handleBlockBack = () => {
    Alert.alert('Action Blocked', "You cannot go back at this stage. Let's continue forward!");
  };

  return (
    <Pressable onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header */}
        <Header />

        <ProgressBar current={8} total={32} />
        <Text style={styles.title}>What are you looking for?</Text>

        <View style={styles.options}>
          {getOptions().map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.option, selected === opt.value && styles.selected]}
              onPress={() => setSelected(opt.value)}
            >
              <Text style={[styles.optionText, selected === opt.value && styles.selectedText]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        {/* Back Button */}
        <BackButton onPress={handleBlockBack} />

        {selected && <AnimatedValueCue message={getPersonalizedCue()} />}

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
    marginBottom: 20,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 24,
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
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
