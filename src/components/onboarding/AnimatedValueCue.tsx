import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedValueCueProps {
  message: string;
  isIntro?: boolean; // ✅ Optional flag now supported
}

export default function AnimatedValueCue({ message, isIntro }: AnimatedValueCueProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="text-pink-700 bg-pink-50 px-4 py-2 rounded-md text-sm leading-relaxed shadow"
        style={{
          borderLeft: '4px solid #ec4899',
          fontFamily: 'Georgia, serif',
          backgroundColor: isIntro ? '#fdf2f8' : '#fff0f5', // Optional subtle style shift
        }}
      >
        <span role="img" aria-label="sparkle" className="mr-2">✨</span>
        {message}
      </motion.div>
    </AnimatePresence>
  );
}
