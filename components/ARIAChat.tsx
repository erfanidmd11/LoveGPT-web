// components/ARIAChat.jsx
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Spinner,
  Avatar,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import Image from 'next/image';

export default function ARIAChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('ariaChat');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('ariaChat', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speak = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = window.speechSynthesis
        .getVoices()
        .find((voice) => voice.name.includes('Female')) || null;
      utter.pitch = 1;
      utter.rate = 1;
      window.speechSynthesis.speak(utter);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/aria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const ariaReply = { role: 'aria', content: data.reply };
      setMessages((prev) => [...prev, ariaReply]);
      speak(data.reply);
    } catch (err) {
      const fallback = 'Something went wrong. Please try again later.';
      setMessages((prev) => [...prev, { role: 'aria', content: fallback }]);
      speak(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const userBg = useColorModeValue('pink.100', 'pink.300');
  const ariaBg = useColorModeValue('purple.100', 'purple.300');

  return (
    <Box
      w="full"
      maxW="2xl"
      mt={12}
      p={6}
      bg="white"
      borderRadius="xl"
      shadow="lg"
    >
      <HStack spacing={3} mb={4}>
        <Avatar src="/aria-avatar.png" size="sm" name="ARIA" />
        <Heading size="md">Chat with ARIA 💬</Heading>
      </HStack>

      <VStack
        spacing={3}
        maxH="400px"
        overflowY="auto"
        pr={2}
        mb={4}
        align="stretch"
      >
        {messages.map((msg, i) => (
          <Box
            key={i}
            bg={msg.role === 'user' ? userBg : ariaBg}
            alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
            px={4}
            py={2}
            borderRadius="lg"
            fontSize="sm"
            whiteSpace="pre-line"
            maxW="85%"
          >
            {msg.content}
          </Box>
        ))}
        {loading && <Text fontSize="sm" color="gray.500">ARIA is thinking... <Spinner size="xs" ml={2} /></Text>}
        <div ref={messagesEndRef} />
      </VStack>

      <HStack spacing={2}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask ARIA anything..."
          flex="1"
          borderColor="gray.300"
        />
        <Button
          onClick={sendMessage}
          colorScheme="pink"
          isDisabled={!input.trim()}
        >
          Send
        </Button>
      </HStack>
    </Box>
  );
}
