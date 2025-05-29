import dynamic from 'next/dynamic';

const ApplicationsPage = dynamic(() => import('@/components/admin/ApplicationsPage'), {
  ssr: false,
});

export default ApplicationsPage;
