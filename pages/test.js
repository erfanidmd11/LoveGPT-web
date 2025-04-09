import Head from 'next/head';

export default function TestPage() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>LoveGPT Mobile Crash Test</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-pink-100 text-center text-gray-800 p-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">Mobile Test Page</h1>
          <p className="text-lg">If you're reading this, the layout is stable.</p>
        </div>
      </div>
    </>
  );
}
