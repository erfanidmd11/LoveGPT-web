import Head from 'next/head';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen 
bg-gradient-to-r from-red-500 to-purple-600 text-white">
      <Head>
        <title>LoveGPT - Find Love Smarter</title>
      </Head>

      <h1 className="text-4xl font-bold mt-10">We Don’t Just Match. We 
Connect. ❤️</h1>
      <p className="mt-4 text-lg">AI-powered dating & relationship 
coaching</p>
      
      <button className="mt-6 px-6 py-3 bg-white text-red-500 rounded-lg 
font-semibold shadow-md hover:shadow-xl transition">
        Get Started
      </button>
    </div>
  );
}

