import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';

interface Step18AttachmentStyleProps {
  formData?: Record<string, any>;
  setFormData?: (data: Record<string, any>) => void;
  onNext?: () => void;
}

const attachmentStyles = [
  {
    label: 'Secure 💚',
    description:
      'I’m comfortable with intimacy and trust. I can communicate openly and handle conflict calmly.',
  },
  {
    label: 'Anxious 💛',
    description:
      'I crave closeness but worry I’m not truly loved. I need reassurance often.',
  },
  {
    label: 'Avoidant 💙',
    description:
      'I value independence. I tend to pull away when things get emotionally intense.',
  },
  {
    label: 'Fearful-Avoidant 💔',
    description:
      'I desire love but fear rejection. My reactions can feel inconsistent or confusing.',
  },
  {
    label: 'Not sure yet 🤔',
    description:
      'I'm still exploring how I attach in relationships — and that’s okay!',
  },
];

export default function Step18AttachmentStyle({
  formData = {},
  setFormData = () => {},
  onNext = () => {},
}: Step18AttachmentStyleProps) {
  const [selected, setSelected] = useState('');

  useEffect(() => {
    const savedStyle = localStorage.getItem('attachmentStyle');
    if (savedStyle) {
      setSelected(savedStyle);
    } else if (formData.attachmentStyle) {
      setSelected(formData.attachmentStyle);
    }
  }, [formData]);

  const handleSelect = (style: string) => {
    setSelected(style);
    localStorage.setItem('attachmentStyle', style);
    setFormData((prev: Record<string, any>) => ({
      ...prev,
      attachmentStyle: style,
    }));
  };

  const handleContinue = () => {
    if (!selected) return;
    localStorage.removeItem('attachmentStyle');
    onNext();
  };

  Step18AttachmentStyle.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={18} totalSteps={24} />

      <h2 className="text-2xl font-bold text-gray-800">Your Attachment Style</h2>

      <div className="space-y-3">
        {attachmentStyles.map((style) => (
          <button
            key={style.label}
            onClick={() => handleSelect(style.label)}
            className={`w-full border rounded-xl px-4 py-3 text-left transition ${
              selected === style.label
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:border-pink-300'
            }`}
          >
            <div className="font-semibold">{style.label}</div>
            <div className="text-sm text-gray-600">{style.description}</div>
          </button>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <ValueCue cue="Understanding your emotional patterns helps ARIA match you with someone who complements your needs." />
        </motion.div>
      )}
    </div>
  );
}
