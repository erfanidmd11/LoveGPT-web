import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';

const valuePairs = [
  ['Curiosity', 'Tradition'],
  ['Kindness', 'Assertiveness'],
  ['Simplicity', 'Complexity'],
  ['Freedom', 'Connection'],
];

export default function CoreValueStep5() {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<number, string>>({});

  const handleSelect = (index: number, value: string) => {
    setSelected((prev) => ({ ...prev, [index]: value }));
  };

  const handleNext = () => {
    localStorage.setItem('core-values-step-5', JSON.stringify(selected));
    router.push('/dashboard/personality/core-values/step-6');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">Core Value Index – Step 5 of 6</h1>
        <p className="text-gray-600 mb-6 text-sm">Choose the value that resonates more strongly with you in each pair.</p>

        <div className="space-y-6">
          {valuePairs.map(([a, b], index) => (
            <div key={index} className="bg-white p-4 shadow rounded-xl">
              <p className="text-sm font-semibold text-gray-800 mb-3">Pick one:</p>
              <div className="flex gap-4">
                {[a, b].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleSelect(index, val)}
                    className={`flex-1 px-4 py-3 border rounded-lg text-sm font-medium ${
                      selected[index] === val ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-right">
          <button
            onClick={handleNext}
            disabled={Object.keys(selected).length !== valuePairs.length}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
