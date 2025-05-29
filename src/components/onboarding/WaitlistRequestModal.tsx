// components/onboarding/WaitlistRequestModal.tsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Text,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { submitWaitlistRequest } from '@/firebase/waitlist';
import { useRouter } from 'next/router';

const MotionModalContent = motion(ModalContent);

interface WaitlistForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  instagram: string;
  location: string;
  reason: string;
  heardFrom: string;
  referredBy: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistRequestModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<WaitlistForm>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    instagram: '',
    location: '',
    reason: '',
    heardFrom: '',
    referredBy: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof WaitlistForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const bg = useColorModeValue('white', 'gray.900');

  const handleChange = (field: keyof WaitlistForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof WaitlistForm, string>> = {};
    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.lastName) newErrors.lastName = 'Last name is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.reason) newErrors.reason = 'Please share your why 💜';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await submitWaitlistRequest(form);
      router.push('/thank-you');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Submission Error',
        description: 'Something went wrong. Please try again in a moment.',
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const token = process.env.NEXT_PUBLIC_IPINFO_TOKEN;
        const response = await fetch(`https://ipinfo.io/json?token=${token}`);
        const data = await response.json();
        const locationString = `${data.city}, ${data.region}, ${data.country}`;
        setForm(prev => ({ ...prev, location: locationString }));
      } catch (error) {
        console.error('Failed to fetch location:', error);
        setForm(prev => ({ ...prev, location: 'Location unavailable' }));
      }
    };
    if (isOpen) fetchLocation();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered motionPreset="none">
      <ModalOverlay />
      <MotionModalContent
        bg={bg}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        borderRadius="xl"
        boxShadow="2xl"
      >
        <ModalHeader>
          <Text fontSize="2xl" fontWeight="bold" color="purple.600">Join the Waitlist</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Text fontStyle="italic" fontSize="md" color="gray.600">
              You’re in the right place ✨ Even if the world hasn’t seen your full light yet… you belong here.
            </Text>

            {([
              ['firstName', 'First Name'],
              ['lastName', 'Last Name'],
              ['phone', 'Phone Number'],
              ['email', 'Email'],
              ['instagram', 'Instagram, Facebook, or X handle(s)'],
              ['location', 'Location (auto-filled)'],
              ['reason', 'Why do you want to join LoveGPT?'],
              ['heardFrom', 'How did you hear about us?'],
              ['referredBy', 'Who referred you? (optional)'],
            ] as [keyof WaitlistForm, string][]).map(([field, label]) => (
              <FormControl key={field} isInvalid={!!errors[field]}>
                <FormLabel fontWeight="semibold" color="gray.700">{label}</FormLabel>
                {field === 'reason' ? (
                  <Textarea
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder="Your heart’s reason 💜"
                  />
                ) : (
                  <Input
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={label}
                  />
                )}
                {errors[field] && (
                  <Text fontSize="sm" color="red.500">{errors[field]}</Text>
                )}
              </FormControl>
            ))}

            <Button
              mt={4}
              colorScheme="purple"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              size="lg"
              borderRadius="full"
            >
              Request Invite
            </Button>
          </VStack>
        </ModalBody>
      </MotionModalContent>
    </Modal>
  );
}
