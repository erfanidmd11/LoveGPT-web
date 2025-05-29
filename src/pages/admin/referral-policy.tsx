import dynamic from 'next/dynamic';
const ReferralPolicyPage = dynamic(() => import('@/components/admin/ReferralPolicyPage'), { ssr: false });
export default ReferralPolicyPage;
