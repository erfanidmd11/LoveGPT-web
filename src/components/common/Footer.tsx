import React from 'react';
import { Box, Text, HStack, Link } from '@chakra-ui/react';

interface OnboardingFooterProps {
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  saving?: boolean;
  variant?: 'global' | 'onboarding';
}

const Footer: React.FC<OnboardingFooterProps> = ({
  onNext,
  onBack,
  nextDisabled = false,
  saving = false,
  variant = 'global',
}) => {
  if (variant === 'onboarding') {
    return (
      <Box mt={6} display="flex" justifyContent="space-between" w="100%">
        <button
          onClick={onBack}
          disabled={saving}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={nextDisabled || saving}
          className="bg-pink-500 text-white px-4 py-2 rounded"
        >
          {saving ? 'Saving...' : 'Next'}
        </button>
      </Box>
    );
  }

  // Global footer
  return (
    <Box as="footer" bg="gray.800" p={4} color="white" textAlign="center">
      <Text>&copy; {new Date().getFullYear()} LoveGPT, All Rights Reserved.</Text>
      <HStack spacing={6} justify="center" mt={4}>
        <Link href="#" color="white">Privacy Policy</Link>
        <Link href="#" color="white">Terms of Use</Link>
        <Link href="#" color="white">Investors</Link>
        <Link href="#" color="white">Contact Us</Link>
      </HStack>
    </Box>
  );
};

export default Footer;
