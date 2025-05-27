import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTypingTextProps {
  text: string;
  speed?: number;
}

const AnimatedTypingText: React.FC<AnimatedTypingTextProps> = ({ text, speed = 30 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: text.length / speed }}
      className="text-base text-gray-700 leading-relaxed"
    >
      {text}
    </motion.div>
  );
};

export default AnimatedTypingText;
