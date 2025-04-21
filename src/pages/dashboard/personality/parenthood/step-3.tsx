import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';

export default function ParenthoodStep3() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (selected) {
      localStorage.setItem('parenthood-step3', selected);
      router.push('/dashboard/personality/parenthood/step-4');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">👶 Parenthood Readiness</h1>
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          3. What parenting style best aligns with your values?
        </h2>
        <div className="space-y-4">
          {[
            'Authoritative — firm but loving',
            'Permissive — nurturing with few rules',
            'Authoritarian — structured and disciplined',
            'Uninvolved — minimal guidance'
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
