import React, { useState } from 'react';
import {
  Box, Button, Input, Text, Checkbox, useToast, VStack, HStack, Heading, IconButton
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { doc, addDoc, collection, Timestamp, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import { markInviteCodeAsUsed, validateInviteCode } from '@/lib/invites';

interface InvitationModalProps {
  isVisible: boolean;
  onClose: () => void;
  referredBy?: string;
}

interface InviteApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  handle: string;
  isMatchIntent: boolean;
  referredBy?: string | null;
  level: number;
  createdAt: Timestamp;
  status: 'pending';
}

const getReferralBadge = (count: number): string => {
  if (count >= 20) return '🧠 LoveGPT Luminary';
  if (count >= 10) return '💖 Matchmaker Elite';
  if (count >= 5) return "💌 Cupid's Assistant";
  if (count >= 3) return '💞 Spark Spreader';
  if (count >= 1) return '🌱 Seed Planter';
  return '';
};

const InvitationModal: React.FC<InvitationModalProps> = ({ isVisible, onClose, referredBy }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [showApplication, setShowApplication] = useState(false);
  const [form, setForm] = useState<Omit<InviteApplicationData, 'referredBy' | 'level' | 'createdAt' | 'status'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    handle: '',
    isMatchIntent: false,
  });

  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteCode) {
      toast({ status: 'error', description: 'Please enter a code.' });
      return;
    }

    try {
      const isValid = await validateInviteCode(inviteCode);
      if (!isValid) {
        toast({ status: 'error', description: '❌ Invalid or already used code.' });
        return;
      }

      const authUser = getAuth().currentUser;
      const usedBy = authUser?.uid || 'anonymous';

      await markInviteCodeAsUsed(inviteCode, usedBy);

      if (authUser) {
        const userRef = doc(db, 'users', authUser.uid);

        const q = query(collection(db, 'invitationCodes'), where('referredBy', '==', authUser.uid));
        const snap = await getDocs(q);
        const referralCount = snap.size;
        const badge = getReferralBadge(referralCount + 1);

        await updateDoc(userRef, {
          invitedByCode: inviteCode,
          invitedAt: Timestamp.now(),
          points: {
            total: 100,
            earnedFrom: {
              referrals: 100,
            }
          },
          badges: badge ? [badge] : [],
        });
      }

      toast({ status: 'success', description: '✅ Invitation code accepted. Welcome!' });
      onClose();
      window.location.href = '/onboarding/Step1APhoneOTP';
    } catch (err) {
      console.error('Error validating invitation code:', err);
      toast({ status: 'error', description: '❌ Something went wrong. Please try again.' });
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { firstName, lastName, email, phone, handle, isMatchIntent } = form;
    if (!firstName || !lastName || !email || !phone || !handle) {
      toast({ status: 'error', description: 'Please complete all fields.' });
      return;
    }

    const data: InviteApplicationData = {
      firstName,
      lastName,
      email,
      phone,
      handle,
      isMatchIntent,
      referredBy: referredBy || null,
      level: 1,
      createdAt: Timestamp.now(),
      status: 'pending',
    };

    try {
      await addDoc(collection(db, 'inviteApplications'), data);

      toast({ status: 'success', description: "🎉 Application received! We'll review and reach out soon." });
      onClose();
    } catch (err) {
      console.error('Application submission failed:', err);
      toast({ status: 'error', description: 'Error submitting application. Try again.' });
    }
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bg="blackAlpha.600"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box bg="white" p={8} borderRadius="2xl" w="full" maxW="lg" position="relative" boxShadow="2xl">
        <IconButton
          aria-label="Close"
          icon={<CloseIcon />}
          position="absolute"
          top={3}
          right={3}
          size="sm"
          onClick={onClose}
          variant="ghost"
        />
        <Heading size="lg" textAlign="center" color="pink.500" mb={6}>
          Join LoveGPT
        </Heading>

        {!showApplication ? (
          <form onSubmit={handleCodeSubmit}>
            <VStack spacing={4}>
              <Input
                placeholder="Enter Invitation Code"
                name="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
              <Button colorScheme="pink" w="full" type="submit">
                Enter
              </Button>
              <Text fontSize="sm" color="gray.600">
                Don’t have an invite?{' '}
                <Button variant="link" colorScheme="pink" size="sm" onClick={() => setShowApplication(true)}>
                  Apply for access
                </Button>
              </Text>
            </VStack>
          </form>
        ) : (
          <form onSubmit={handleApplicationSubmit}>
            <VStack spacing={4}>
              <HStack spacing={4} w="full">
                <Input
                  name="firstName"
                  placeholder="First Name*"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="lastName"
                  placeholder="Last Name*"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </HStack>
              <Input
                name="email"
                type="email"
                placeholder="Email*"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number*"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <Input
                name="handle"
                placeholder="Instagram or Facebook Handle*"
                value={form.handle}
                onChange={handleChange}
                required
              />
              <Checkbox
                name="isMatchIntent"
                isChecked={form.isMatchIntent}
                onChange={handleChange}
              >
                This is someone I’d like LoveGPT to help me evaluate for compatibility.
              </Checkbox>
              <Button type="submit" colorScheme="pink" w="full" mt={2}>
                Submit Application
              </Button>
            </VStack>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default InvitationModal;
