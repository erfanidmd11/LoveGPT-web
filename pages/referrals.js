// pages/referrals.js
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';

export default function Referrals() {
  return (
    <MainLayout>
      <Head>
        <title>LoveGPT Referral Program | Earn with Every Invite</title>
        <meta
          name="description"
          content="Learn about LoveGPT’s 3-tier referral system and how you can earn tokens while sharing conscious love."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100 flex flex-col items-center px-6 py-16 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Referral Program</h1>

        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed mb-10">
          At LoveGPT, we believe in rewarding our community for spreading conscious love. Our 3-level referral model lets you earn as your network grows — while keeping the platform profitable and sustainable.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-pink-400">
            <h3 className="text-xl font-bold mb-2">Level 1</h3>
            <p className="text-gray-600 mb-2">You refer a friend directly.</p>
            <p className="text-sm text-gray-500">Earn 10 tokens + 5% recurring revenue share.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-pink-500">
            <h3 className="text-xl font-bold mb-2">Level 2</h3>
            <p className="text-gray-600 mb-2">Your friend refers someone else.</p>
            <p className="text-sm text-gray-500">Earn 5 tokens + 2% recurring revenue share.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-pink-600">
            <h3 className="text-xl font-bold mb-2">Level 3</h3>
            <p className="text-gray-600 mb-2">That person refers again.</p>
            <p className="text-sm text-gray-500">Earn 2 tokens + 1% recurring revenue share.</p>
          </div>
        </div>

        <div className="max-w-2xl text-left mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">How It Works</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Each user gets a unique referral code.</li>
            <li>Referrals are tracked for life — passive earning potential.</li>
            <li>All tokens are redeemable for subscription discounts, gift cards, or community perks.</li>
            <li>Revenue sharing is paid monthly based on active subscriptions.</li>
          </ul>
        </div>

        <div className="max-w-xl bg-white rounded-lg p-6 shadow text-left">
          <h3 className="text-lg font-bold mb-2">Why It’s Sustainable</h3>
          <p className="text-sm text-gray-600">
            We reserve 20% of net subscription revenue for rewards and partner incentives. The referral system is designed to grow our user base while maintaining profitability and ensuring platform reinvestment.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
