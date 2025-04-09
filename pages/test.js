import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';

export default function TestPage() {
  return (
    <MainLayout>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>LoveGPT Mobile Crash Test</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-pink-100 text-center text-gray-800 p-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">Mobile Layout Test</h1>
          <p className="text-lg">If this crashes, the issue is inside MainLayout.</p>
        </div>
      </div>
    </MainLayout>
  );
}

