// pages/admin/flagged-matches.jsx
import dynamic from 'next/dynamic';
const FlaggedMatchesDashboard = dynamic(() =>
  import('../../src/components/admin/FlaggedMatchesDashboard')
);

export default function AdminFlaggedMatchesPage() {
  return <FlaggedMatchesDashboard />;
}
