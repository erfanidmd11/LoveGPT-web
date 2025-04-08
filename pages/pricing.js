// pages/pricing.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import ARIAChat from '@/components/ARIAChat';

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  const pricing = {
    starter: { monthly: 0, annual: 0 },
    growth: { monthly: 19, annual: 190 },
    legacy: { monthly: 49, annual: 490 },
  };

  return (
    <MainLayout>
      <Head>
        <title>LoveGPT Pricing | Conscious Love, Tailored for You</title>
        <meta
          name="description"
          content="Explore LoveGPT's transparent pricing. Invest in a relationship platform that grows with you."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-100 flex flex-col items-center px-6 py-16 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Pricing</h1>

        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed mb-8">
          We believe true connection should be accessible — that’s why LoveGPT offers a tiered model that supports all levels of growth.
        </p>

        {/* Billing Toggle */}
        <div className="mb-10">
          <span className={`mr-4 font-medium ${!annual ? 'text-indigo-600' : 'text-gray-500'}`}>Monthly</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" onChange={() => setAnnual(!annual)} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
          <span className={`ml-4 font-medium ${annual ? 'text-indigo-600' : 'text-gray-500'}`}>Annual (Save 20%)</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl">
          {/* Free Tier */}
          <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-green-400">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <p className="text-gray-600 mb-4">Free forever</p>
            <ul className="text-gray-700 text-sm mb-6 list-disc list-inside text-left">
              <li>Core onboarding experience</li>
              <li>Basic compatibility insights</li>
              <li>ARIA access (limited daily interactions)</li>
              <li>Earn token rewards for engagement</li>
            </ul>
            <Link href="/signup" className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition">
              Get Started
            </Link>
          </div>

          {/* Growth Tier */}
          <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-indigo-500">
            <h3 className="text-xl font-bold mb-2">Growth</h3>
            <p className="text-gray-600 mb-4">${annual ? pricing.growth.annual : pricing.growth.monthly}/{annual ? 'year' : 'month'}</p>
            <ul className="text-gray-700 text-sm mb-6 list-disc list-inside text-left">
              <li>Unlimited ARIA reflections</li>
              <li>Advanced compatibility metrics</li>
              <li>Weekly coaching & insights</li>
              <li>Gamified growth dashboard + token incentives</li>
            </ul>
            <Link href="/signup" className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600 transition">
              Upgrade Now
            </Link>
          </div>

          {/* Legacy Tier */}
          <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-purple-500">
            <h3 className="text-xl font-bold mb-2">Legacy</h3>
            <p className="text-gray-600 mb-4">${annual ? pricing.legacy.annual : pricing.legacy.monthly}/{annual ? 'year' : 'month'}</p>
            <ul className="text-gray-700 text-sm mb-6 list-disc list-inside text-left">
              <li>Everything in Growth</li>
              <li>Access to certified Love Mentors</li>
              <li>Private circles & partner workshops</li>
              <li>Max token rewards + ambassador status</li>
            </ul>
            <Link href="/signup" className="bg-purple-500 text-white px-5 py-2 rounded-md hover:bg-purple-600 transition">
              Join Legacy Tier
            </Link>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20 max-w-3xl text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">What Our Users Are Saying</h3>
          <blockquote className="italic text-gray-600 mb-4">
            “ARIA helped me see myself clearly and show up better in my relationship. It’s like having a wise best friend in my pocket.”
          </blockquote>
          <blockquote className="italic text-gray-600">
            “I didn’t think AI could feel so human. I’ve grown more emotionally in 3 months with LoveGPT than I did in 3 years of dating.”
          </blockquote>
        </div>

        {/* ARIA Plan Guidance */}
        <div className="mt-20 max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">Not Sure Which Plan Is Right for You?</h3>
          <p className="text-gray-600 mb-4">Ask ARIA below — she’ll guide you based on your needs, goals, and love journey stage.</p>
          <ARIAChat />
        </div>
      </div>
    </MainLayout>
  );
}
