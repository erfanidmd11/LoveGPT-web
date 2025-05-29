import { useState } from 'react';
import {
  Box, Button, Input, VStack, Image, Text, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure
} from '@chakra-ui/react';

interface ChatMessage {
  role: 'user' | 'aria';
  content: string;
}

export default function ARIAChat() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMsg: ChatMessage = { role: 'user', content: message };
    setChat((prev) => [...prev, newMsg]);
    setMessage('');

    try {
      const res = await fetch('/api/aria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.reply) {
        setChat((prev) => [...prev, { role: 'aria', content: data.reply }]);
      }
    } catch (err) {
      setChat((prev) => [...prev, { role: 'aria', content: 'Something went wrong. Try again.' }]);
    }
  };

  return (
    <>
      <Box position="fixed" bottom={6} right={6} zIndex={1000}>
        <Button onClick={onOpen} colorScheme="pink" rounded="full">
          💬 Chat with ARIA
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" alignItems="center" gap={3}>
            <Image src="/aria-avatar.png" alt="ARIA" boxSize="40px" borderRadius="full" />
            <Text fontWeight="bold" color="pink.600">ARIA</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} maxH="40vh" overflowY="auto" align="stretch">
              {chat.map((msg, idx) => (
                <Box key={idx} alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                  bg={msg.role === 'user' ? 'pink.100' : 'blue.100'} px={3} py={2} rounded="md">
                  <Text fontSize="sm">{msg.content}</Text>
                </Box>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask ARIA..."
              mr={2}
            />
            <Button onClick={handleSend} colorScheme="pink">Send</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
