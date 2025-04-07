import React from 'react';

const ValueCue = ({ cue }) => {
  if (!cue) return null;
  return (
    <p className="text-sm text-gray-500 mt-1 italic">
      💡 {cue}
    </p>
  );
};

export default ValueCue;
