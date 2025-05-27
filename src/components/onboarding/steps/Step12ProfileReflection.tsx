import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Image
} from 'react-native';
import { useRouter } from 'next/router';
import ProgressBar from '@/components/common/ProgressBar';
import AnimatedTypingText from '@/components/common/AnimatedTypingText';
import onboardingMemory from '@/lib/onboardingMemory';
import Footer from '@/components/common/Footer';
import { getZodiacNarrative } from '@/../shared/lib/zodiacMap';
import { getWesternZodiacSign, getChineseZodiacSign } from '@/lib/zodiacProfiles';
import { getAnswer } from '@shared/saveAnswer';

const ARIAAvatar = require('@/assets/aria-avatar.png');

export default function Step12ProfileReflection() {
  const router = useRouter();
  const uid = router.query.uid as string;

  const [fullStory, setFullStory] = useState('');
  const [quote, setQuote] = useState('');
  const [readyToTypeStory, setReadyToTypeStory] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  const user = onboardingMemory.profile || {};
  const gender = onboardingMemory.gender || 'male';
  const firstName = user.name || 'Seeker';
  const age = user.age || 'your age';
  const dob = user.dob ? new Date(user.dob) : null;

  const western = dob ? getWesternZodiacSign(dob.getMonth() + 1, dob.getDate()) : 'Unknown';
  const chinese = dob ? getChineseZodiacSign(dob.getFullYear()) : { sign: 'Unknown' };
  const zodiacNarrative = getZodiacNarrative(western, chinese.sign, gender);

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step12ProfileReflection').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }

    const generateFullStory = () => {
      let story = '';

      if (zodiacNarrative) {
        story += `Hey ${firstName}, you’re about to see what ARIA sees when she looks at your soul blueprint.\n\n`;
        story += `Based on your energy as a ${gender} ${western} born in the Year of the ${chinese.sign}, here’s what you need to know...\n\n`;
        story += zodiacNarrative.fullNarrative;
      } else {
        story += `Hi ${firstName}, ARIA couldn’t find your full profile at this moment, but your journey is still sacred.`;
      }

      return story;
    };

    setFullStory(generateFullStory());
    setQuote('"This is just the beginning. Your story is unfolding — and you are the author. ✨"');

    setTimeout(() => {
      setReadyToTypeStory(true);
      setIsTyping(false);
    }, 3000);
  }, [uid]);

  const handleContinue = () => router.replace("/onboarding/Step13Enneagram?uid=" + uid);
  const handleBack = () => router.back();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 220 }}>
        <View style={styles.container}>
          <ProgressBar step={12} totalSteps={32} />
          <Text style={styles.progressText}>Step 12 of 32 — Awakening</Text>
          <Text style={styles.title}>Your Soul Map — Through ARIA’s Eyes</Text>

          <View style={styles.avatarContainer}>
            <Image source={ARIAAvatar} style={[styles.avatar, isTyping && styles.avatarPulsing]} />
          </View>

          <View style={styles.storyBox}>
            {readyToTypeStory ? (
              <>
                <AnimatedTypingText text={fullStory} speed={22} style={styles.storyText} />
                <AnimatedTypingText text={quote} speed={28} style={styles.quoteText} />
              </>
            ) : (
              <Text style={styles.storyText}>✨ ARIA is preparing your custom soul map...</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.ariaContainer}>
          <AnimatedTypingText
            text="🌟 Every heartbeat, every brave choice, every truth — ARIA is walking beside you."
            speed={30}
            style={styles.footerCueText}
          />
        </View>
        <Footer variant="onboarding" onNext={handleContinue} onBack={handleBack} nextDisabled={false} saving={false} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPulsing: {
    animation: 'pulse 1s infinite alternate',
  },
  storyBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4,
      },
    }),
  },
  storyText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
  },
  quoteText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
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
  footerCueText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
