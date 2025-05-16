import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';

export default function Features() {
  return (
    <MainLayout>
      <Head>
        <title>LoveGPT Features</title>
        <meta
          name="description"
          content="Explore all the intelligent features LoveGPT offers — from emotional AI and personalized matchmaking to mentorship and conscious connection."
        />
      </Head>

      <section className="bg-gradient-to-br from-white to-pink-50 py-20 px-6 md:px-24 text-gray-800">
        <h1 className="text-5xl font-bold text-center mb-12">Everything You Get with LoveGPT</h1>

        <div className="max-w-5xl mx-auto text-lg space-y-12 grid grid-cols-1 sm:grid-cols-1 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2 flex items-center gap-3 animate-fade-in-up">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-pink-100 text-pink-600 font-bold rounded-full">$1</span>
              ARIA adapts to your personality, values, and emotional patterns to give you real-time, deeply personalized reflections — like having a therapist, coach, best friend, and intuitive mirror all in one. She’s always there for you, learning more about you over time, and she never judges or forgets who you are.
            </h2>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">2. Compatibility Snapshot</h2>
            <p>
              Get instant compatibility insights between you and any match — including zodiac synergy, MBTI psychology, and shared values.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">3. Value-Based Matching</h2>
            <p>
              Match with people based on deep compatibility — parenting beliefs, financial values, emotional readiness, and lifestyle vision.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">4. Guided Growth Journey</h2>
            <p>
              Complete personalized growth modules, earn tokens, and level up your emotional maturity with exercises designed to reflect, repair, and grow.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">5. AI-Powered Relationship Coaching</h2>
            <p>
              ARIA doesn’t just listen — she helps you navigate conversations, resolve conflict, and express your needs with clarity. Think of it as having a private, always-on, emotionally intelligent assistant.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">6. Couples Mentorship Program</h2>
            <p>
              Real couples trained in LoveGPT’s emotional intelligence framework mentor you and others — sharing tools, stories, and wisdom to support your journey.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">7. Relationship Tracking + Emotional Insights</h2>
            <p>
              Track your connection over time. Get feedback, milestones, sentiment insights, and communication patterns that help you grow stronger together.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">8. Safe Space for Self-Reflection</h2>
            <p>
              ARIA is your no-judgment zone. She doesn’t store your conversations or sell your data. She exists solely to help you reflect and evolve — safely and confidentially.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">9. Compatibility Invites</h2>
            <p>
              Invite friends or partners to do a compatibility comparison — and ARIA will break it all down in a clear, loving, insightful way. Great for both dating and deepening.
            </p>
          </div>

          <div className="bg-white p-8 mt-10 rounded-2xl shadow-xl text-center">
            <h3 className="text-2xl font-semibold text-pink-600 mb-4">Your Relationships Deserve a Revolution 💡</h3>
            <p className="text-lg text-gray-700 mb-6">
              LoveGPT isn’t just an app — it’s a new standard for emotional depth, self-awareness, and connection. Join us and create a life rooted in values, emotional growth, and conscious love.
            </p>
            <a
              href="/signup"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
            >
              Join Now — It’s Free to Begin
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
