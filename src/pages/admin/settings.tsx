import dynamic from 'next/dynamic';
const SettingsPage = dynamic(() => import('@/components/admin/SettingsPage'), { ssr: false });
export default SettingsPage;
