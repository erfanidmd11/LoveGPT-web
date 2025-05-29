import dynamic from 'next/dynamic';
const InvitesPage = dynamic(() => import('@/components/admin/InvitesPage'), { ssr: false });
export default InvitesPage;
