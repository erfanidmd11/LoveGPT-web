import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <Head>
        <title>Privacy Policy | LoveGPT</title>
        <meta
          name="description"
          content="Learn how LoveGPT protects your data and respects your emotional privacy. No tracking, no chat logs, and full user control."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white to-pink-50 px-6 py-16 flex flex-col items-center justify-start text-left">
        <div className="max-w-3xl w-full">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Privacy Policy</h1>

          <p className="text-gray-700 text-lg mb-6">
            <strong>Effective Date:</strong> [Insert Date]
          </p>

          <p className="text-gray-700 text-lg mb-6">
            At LoveGPT, your trust means everything to us. This Privacy Policy explains how we collect, use, and protect your information when you use our services — including our emotionally intelligent AI guide, ARIA.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">1. Your Privacy, Your Power</h2>
          <p className="text-gray-700 text-lg mb-6">
            We believe that emotional safety is foundational to conscious love. That’s why <strong>LoveGPT does not store, transmit, or sell your private conversations</strong>. What you share with ARIA stays with you — always.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">2. Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-700 text-lg mb-6">
            <li><strong>Account Information:</strong> Name, email, phone number (optional), and authentication data</li>
            <li><strong>Usage Data:</strong> Anonymized interaction metadata to help improve the platform</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">3. What We Don’t Collect</h2>
          <p className="text-gray-700 text-lg mb-6">
            LoveGPT is a <strong>judgment-free, surveillance-free zone</strong>. That means:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg mb-6">
            <li>No voice recordings</li>
            <li>No chat logs stored by default</li>
            <li>No GPS tracking</li>
            <li>No third-party ad tracking</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">4. How Your Data Is Used</h2>
          <p className="text-gray-700 text-lg mb-6">
            We use your data to:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg mb-6">
            <li>Personalize ARIA’s responses</li>
            <li>Understand how the platform is used (in aggregate)</li>
            <li>Authenticate your account securely</li>
          </ul>
          <p className="text-gray-700 text-lg mb-6">
            We <strong>never sell or share</strong> your data with advertisers.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">5. Data Security</h2>
          <p className="text-gray-700 text-lg mb-6">
            We use encryption, secure cloud architecture, and modern protocols (including quantum-resistant methods as we grow) to safeguard your information.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">6. Your Rights</h2>
          <p className="text-gray-700 text-lg mb-6">
            You have full control over your data. At any time, you may:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg mb-6">
            <li>Access or update your profile</li>
            <li>Request deletion of your account and all data</li>
            <li>Request a copy of your data</li>
          </ul>
          <p className="text-gray-700 text-lg mb-6">
            Just email us at: <a href="mailto:team@thelovegpt.ai" className="text-pink-600 underline">team@thelovegpt.ai</a>
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">7. Third-Party Services</h2>
          <p className="text-gray-700 text-lg mb-6">
            We may use trusted providers like Firebase and Stripe for secure sign-in and payments. They have their own privacy policies and are compliant with security standards.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">8. Children’s Privacy</h2>
          <p className="text-gray-700 text-lg mb-6">
            LoveGPT is not intended for users under 18. We do not knowingly collect data from minors.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">9. Policy Updates</h2>
          <p className="text-gray-700 text-lg mb-6">
            If we change our privacy practices, we’ll notify you clearly and update this page. You always have the option to delete your account if you disagree with updates.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">10. Contact Us</h2>
          <p className="text-gray-700 text-lg mb-6">
            Your emotional and digital safety matter. Contact us at:
          </p>
          <ul className="list-none text-gray-700 text-lg mb-6">
            <li><strong>Email:</strong> <a href="mailto:team@thelovegpt.ai" className="text-pink-600 underline">team@thelovegpt.ai</a></li>
            <li><strong>Website:</strong> <a href="https://www.thelovegpt.ai" className="text-pink-600 underline">www.thelovegpt.ai</a></li>
          </ul>

          <p className="text-center italic text-gray-600 mt-10">
            LoveGPT was built on love, not data mining. Your heart is sacred — and so is your privacy.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
