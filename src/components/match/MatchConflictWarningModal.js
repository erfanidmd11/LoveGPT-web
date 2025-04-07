import React from 'react';

export default function MatchConflictWarningModal({ violations, onAccept, onReject }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-xl font-bold text-red-600">Heads up 🛑</h2>
        <p className="text-gray-700 text-sm">
          This person has traits that conflict with your hard deal breakers:
        </p>
        <ul className="text-sm text-red-500 list-disc pl-5">
          {violations.map((v, idx) => (
            <li key={idx}>{v.value}</li>
          ))}
        </ul>
        <p className="text-xs text-gray-400 italic">
          These flags were added based on your preferences. You can choose to proceed or skip this match.
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onReject}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Skip Match
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            View Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
