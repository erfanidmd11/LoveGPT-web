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
} from '@chakra-ui/react';
import { submitWaitlistRequest } from '@/firebase/waitlist';
import { db } from '@/firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

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
    if (!form.reason) newErrors.reason = 'Please explain why you want to join';
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
      const requestId = await submitWaitlistRequest();
      await setDoc(doc(db, 'waitlistRequests', requestId), {
        ...form,
        createdAt: new Date(),
      });
      router.push('/thank-you');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Could not submit your request. Please try again later.',
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="xl" fontWeight="bold">Join the Waitlist</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Text fontStyle="italic" color="gray.600">
              You're in the right place ✨ Just because you weren’t invited (yet) doesn’t mean you're not important...
            </Text>
            {([
              ['firstName', 'First Name'],
              ['lastName', 'Last Name'],
              ['phone', 'Phone Number'],
              ['email', 'Email'],
              ['instagram', 'Instagram, Facebook or X handle(s)'],
              ['location', 'Location (auto-filled)'],
              ['reason', 'Why do you want to join LoveGPT?'],
              ['heardFrom', 'How did you hear about us?'],
              ['referredBy', 'Who referred you? (optional)'],
            ] as [keyof WaitlistForm, string][]).map(([field, label]) => (
              <FormControl key={field} isInvalid={!!errors[field]}>
                <FormLabel>{label}</FormLabel>
                {field === 'reason' ? (
                  <Textarea
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                ) : (
                  <Input
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                )}
                {errors[field] && (
                  <Text fontSize="sm" color="red.500">{errors[field]}</Text>
                )}
              </FormControl>
            ))}

            <Button
              mt={4}
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              Next
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
