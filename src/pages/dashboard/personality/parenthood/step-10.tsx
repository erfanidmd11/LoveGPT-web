import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';

export default function ParenthoodStep10() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selected) {
      localStorage.setItem('parenthood-step10', selected);
      router.push('/dashboard/resume');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">👶 Parenthood Readiness</h1>
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          10. What emotional legacy would you want to pass on to your children?
        </h2>
        <div className="space-y-4">
          {[
            'Confidence, love, and resilience',
            'Kindness and empathy',
            'Structure, discipline, and responsibility',
            'Spiritual grounding and inner peace'
          ].map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`block w-full text-left px-4 py-3 border rounded-xl transition ${
                selected === option ? 'bg-pink-100 border-pink-400 text-pink-700' : 'hover:bg-pink-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-6 text-right">
          <Button disabled={!selected} onClick={handleSubmit}>
            Finish 🎉
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
