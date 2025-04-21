// src/components/admin/FlaggedMatchesDashboard.tsx
import React from 'react';

export default function FlaggedMatchesDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">
        🚨 Flagged Matches Admin Panel
      </h1>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-100 text-sm text-gray-600">
        <p>
          This section will soon allow super admins to view, review, and resolve user-reported matches that may require moderation or additional screening.
        </p>

        <ul className="mt-4 list-disc list-inside space-y-1">
          <li>✅ View flagged match details</li>
          <li>✅ Mark resolved or escalate</li>
          <li>✅ Trigger re-evaluation or contact involved users</li>
        </ul>

        <p className="mt-6 text-gray-400 italic">
          Backend endpoints and moderation queue coming soon...
        </p>
      </div>
    </div>
  );
}
