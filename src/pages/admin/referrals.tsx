import dynamic from 'next/dynamic';
const ReferralsPage = dynamic(() => import('@/components/admin/ReferralsPage'), { ssr: false });
export default ReferralsPage;
