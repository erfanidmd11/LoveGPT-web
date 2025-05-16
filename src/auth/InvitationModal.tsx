import React, { useState } from 'react';
import { Box, Button, Input, Text, Checkbox, useToast, VStack, HStack, Heading, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { doc, getDoc, updateDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Firebase Firestore methods

interface InvitationModalProps {
  onClose: () => void;
  referredBy?: string;
}

const InvitationModal: React.FC<InvitationModalProps> = ({ onClose, referredBy }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [showApplication, setShowApplication] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    handle: '',
    isMatchIntent: false,
  });
  const toast = useToast();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Check if the invitation code is valid and unused
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteCode) {
      toast({ status: 'error', description: 'Please enter a code.' });
      return;
    }

    try {
      // Check Firestore if this code exists and hasn't been used
      const invitationRef = doc(db, 'invitationCodes', inviteCode);
      const invitationSnap = await getDoc(invitationRef);

      if (!invitationSnap.exists()) {
        toast({ status: 'error', description: '❌ Invalid invitation code.' });
        return;
      }

      const invitationData = invitationSnap.data();
      if (invitationData?.used) {
        toast({ status: 'error', description: '❌ Invitation code has already been used.' });
        return;
      }

      // If valid and unused, mark the code as used and proceed to onboarding
      await updateDoc(invitationRef, { used: true });

      toast({ status: 'success', description: '✅ Invitation code accepted. Welcome!' });
      onClose(); // Close the modal
      window.location.href = '/onboarding/Step1APhoneOTP'; // Redirect to onboarding

    } catch (err) {
      console.error('Error validating invitation code:', err);
      toast({ status: 'error', description: '❌ Something went wrong. Please try again.' });
    }
  };

  // Submit the application for waitlist request
  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { firstName, lastName, email, phone, handle } = form;

    if (!firstName || !lastName || !email || !phone || !handle) {
      toast({ status: 'error', description: 'Please complete all fields.' });
      return;
    }

    try {
      // Submit application to Firestore (Super Admin will review manually)
      await addDoc(collection(db, 'inviteApplications'), {
        ...form,
        referredBy: referredBy || null,
        level: 1,
        createdAt: Timestamp.now(),
        status: 'pending',
      });

      toast({ status: 'success', description: "🎉 Application received! We'll review and reach out soon." });
      onClose(); // Close modal after submission

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
