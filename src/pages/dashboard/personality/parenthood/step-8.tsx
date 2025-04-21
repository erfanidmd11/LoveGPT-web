import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';

export default function ParenthoodStep8() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (selected) {
      localStorage.setItem('parenthood-step8', selected);
      router.push('/dashboard/personality/parenthood/step-9');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">👶 Parenthood Readiness</h1>
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          8. What’s your view on balancing work and parenting?
        </h2>
        <div className="space-y-4">
          {[
            'I want to stay home full time with kids',
            'I want to work part time and co-parent',
            'I prefer to work full time but be involved',
            'Career is my focus, parenting support is minimal'
          ].map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`block w-full text-left px-4 py-3 border rounded-xl transition ${
                selected === option
                  ? 'bg-pink-100 border-pink-400 text-pink-700'
                  : 'hover:bg-pink-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-6 text-right">
          <Button disabled={!selected} onClick={handleNext}>
            Next →
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
