import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';

export default function TermsOfUse() {
  return (
    <MainLayout>
      <Head>
        <title>Terms of Use | LoveGPT</title>
        <meta
          name="description"
          content="Read the terms of service for LoveGPT. Learn your rights and responsibilities when using our emotionally intelligent relationship platform."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 px-6 py-16 flex flex-col items-center justify-start text-left">
        <div className="max-w-3xl w-full">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Terms of Use</h1>

          <p className="text-gray-700 text-lg mb-6">
            <strong>Effective Date:</strong> [Insert Date]
          </p>

          <p className="text-gray-700 text-lg mb-6">
            Welcome to LoveGPT. By accessing or using our platform at <a href="https://www.thelovegpt.ai" className="text-pink-600 underline">www.thelovegpt.ai</a>, you agree to be bound by the following Terms of Use. Please read them carefully before using our services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">1. Eligibility</h2>
          <p className="text-gray-700 text-lg mb-6">
            You must be at least 18 years old to use LoveGPT. By using our site, you represent and warrant that you are of legal age and have the authority to enter into this agreement.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">2. Purpose of the Platform</h2>
          <p className="text-gray-700 text-lg mb-6">
            LoveGPT is an AI-powered platform designed to support emotional growth, relational insight, and conscious connection. It is not a substitute for licensed therapy or emergency support services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">3. User Responsibilities</h2>
          <p className="text-gray-700 text-lg mb-6">
            You agree to use LoveGPT with integrity and respect for others. You will not:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg mb-6">
            <li>Use the platform for unlawful or harmful purposes</li>
            <li>Harass, impersonate, or exploit others</li>
            <li>Upload offensive, inappropriate, or abusive content</li>
            <li>Attempt to reverse-engineer or exploit LoveGPT's AI systems</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">4. Intellectual Property</h2>
          <p className="text-gray-700 text-lg mb-6">
            All content on LoveGPT — including branding, copy, design, and AI dialogue — is the intellectual property of the platform and may not be used or reproduced without permission.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">5. Privacy & Security</h2>
          <p className="text-gray-700 text-lg mb-6">
            Your use of LoveGPT is also governed by our <a href="/privacy" className="text-pink-600 underline">Privacy Policy</a>. We do not record or store your conversations unless explicitly stated otherwise. Your emotional safety and digital privacy are core to our mission.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">6. Termination</h2>
          <p className="text-gray-700 text-lg mb-6">
            We reserve the right to suspend or terminate access to the platform for any user who violates these terms or engages in harmful behavior. We may do so without prior notice if necessary to protect the platform or its users.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">7. Disclaimer</h2>
          <p className="text-gray-700 text-lg mb-6">
            LoveGPT is an exploratory AI experience. While we strive to provide meaningful guidance, we make no guarantees regarding accuracy, outcomes, or suitability for individual needs. You use the platform at your own discretion.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-700 text-lg mb-6">
            LoveGPT and its team shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform. This includes emotional distress, relationship issues, or data loss.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">9. Changes to Terms</h2>
          <p className="text-gray-700 text-lg mb-6">
            We may update these Terms of Use from time to time. You are responsible for reviewing them periodically. Continued use of the platform after changes means you accept the revised terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">10. Contact Us</h2>
          <p className="text-gray-700 text-lg mb-6">
            If you have any questions about these Terms of Use, reach out to us:
          </p>
          <ul className="list-none text-gray-700 text-lg mb-6">
            <li><strong>Email:</strong> <a href="mailto:team@thelovegpt.ai" className="text-pink-600 underline">team@thelovegpt.ai</a></li>
            <li><strong>Website:</strong> <a href="https://www.thelovegpt.ai" className="text-pink-600 underline">www.thelovegpt.ai</a></li>
          </ul>

          <p className="text-center italic text-gray-600 mt-10">
            Conscious love begins with conscious agreement. Thank you for showing up with intention.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
