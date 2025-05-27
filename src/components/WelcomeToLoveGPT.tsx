import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'next/router';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import ARIAChat from '@/components/ARIAChat'; // Enable chat from this point forward

export default function WelcomeToLoveGPT({ user }) {
  const router = useRouter();

  const firstName = user?.firstName || 'You';
  const readiness = user?.readinessScore || 75;
  const tone = user?.aiToneStyle || 'reflective';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('@/assets/aria-avatar.png')} style={styles.avatar} />

      <Text style={styles.heading}>Welcome to LoveGPT, {firstName}</Text>
      <Text style={styles.subtext}>
        You’ve completed your self-discovery journey. You’re {tone}, {readiness}% ready for
        connection, and your story is just beginning.
      </Text>

      <AnimatedValueCue message="This isn’t just another app. It’s your emotional mirror. Your mentor in growth. Your companion in clarity. Let’s build something extraordinary — together." />

      <TouchableOpacity style={styles.button} onPress={() => router.push('/dashboard')}>
        <Text style={styles.buttonText}>Start Exploring →</Text>
      </TouchableOpacity>

      <ARIAChat />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    flexGrow: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ec4899',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 320,
  },
  button: {
    backgroundColor: '#ec4899',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
