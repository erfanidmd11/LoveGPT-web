import React from 'react';

interface FieldDisplayProps {
  label: string;
  value: string | number;
}

const FieldDisplay: React.FC<FieldDisplayProps> = ({ label, value }) => {
  return (
    <div className="mb-4 border-b pb-3">
      <span className="font-bold text-gray-700 block mb-1">{label}</span>
      <span className="text-pink-700 block text-sm">{String(value)}</span>
    </div>
  );
};

export default FieldDisplay;
