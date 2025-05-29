import dynamic from 'next/dynamic';

const BadgesPage = dynamic(() => import('@/components/admin/BadgesPage'), {
  ssr: false,
});

export default BadgesPage;
