import React from 'react';
import { Box } from '@chakra-ui/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ARIAChat from '@/components/ARIAChat';
import WaitlistRequestModal from '@/components/onboarding/WaitlistRequestModal';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showWaitlistModal, setShowWaitlistModal] = React.useState(false);

  return (
    <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
      <Header onWaitlistClick={() => setShowWaitlistModal(true)} />
      <Box as="main" flex="1" pt={0}>
        {children}
      </Box>
      <Footer onWaitlistClick={() => setShowWaitlistModal(true)} />
      <ARIAChat />
      <WaitlistRequestModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </Box>
  );
};

export default MainLayout;
