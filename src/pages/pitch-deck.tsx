import { ChakraProvider, Box, VStack, Heading, Text, SimpleGrid, Button as CButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
const MotionBox = motion(Box);
import React, { useEffect } from "react";
import { Phone, BarChart, FileText } from "lucide-react";
import Link from "next/link";
import MainLayout from "@/layouts/MainLayout";
import ARIAChat from "@/components/ARIAChat";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import ContactModal from "@/components/ContactModal";
import { useState } from "react";

const slides = [
  {
    title: "Vision",
    content: `LoveGPT is the world’s first emotionally intelligent dating platform — powered by AI, driven by values, and focused on lifelong compatibility, not just swipes.`,
  },
  {
    title: "The Problem",
    content: `<details>
  <summary class='cursor-pointer text-indigo-700 font-semibold'>Why dating culture is broken →</summary>
  <ul class='list-disc ml-6 mt-4 text-gray-700'>
    <li>Dating apps prioritize physical attraction over emotional readiness.</li>
    <li>Users rush into relationships without alignment on core values.</li>
    <li>Poor communication & mismatched lifestyles lead to breakups.</li>
    <li>No system rewards emotional growth or relationship development.</li>
  </ul>
  <p class='mt-4'>These patterns lead to emotionally unstable relationships, anger, frustration, and generational trauma. Without a system to promote empathy and emotional intelligence, society suffers. Divorces rise, children grow up in fragmented homes, and we lose our tolerance for differences. This creates a culture of narcissism, reactive conflict, and emotional illiteracy — making connection harder than ever.</p>
</details>`,
  },
  {
    title: "The Solution",
    content: `<details>
  <summary class='cursor-pointer text-indigo-700 font-semibold'>How LoveGPT solves the dating crisis →</summary>
  <p class='mt-6 text-gray-800'>
    Imagine this — you go on a date based on nothing more than someone’s looks. You dress up, spend money, block off your time, and hope for something special. But minutes into the conversation, you realize your values are misaligned, your goals don’t match, and there’s no emotional connection. Disappointment sets in. That time, energy, and emotional investment — wasted.
  </p>
  <p class='mt-4 text-gray-800'>
    Now imagine flying across the country for a vacation-style blind date. A beautiful destination, only to find out that the person you’re meeting is incompatible — emotionally immature, misaligned on family goals, religious views, or financial habits. That kind of pain causes people to say, “Love doesn’t exist” or “Dating just isn’t for me.”
  </p>
  <p class='mt-4 text-gray-800'>
    LoveGPT is the antidote. Our system helps you know yourself first. With ARIA as your AI therapist and wingwoman, we help decode your emotional DNA. She’ll guide you, flag red flags, and even suggest when a relationship is worth fighting for — or when to walk away. No more guesswork. No more emotional rollercoasters. Just conscious connection and lasting clarity.
  </p>
  <p class='mt-4 text-gray-800'>
    Our Paradigm Shift- LoveGPT doesn't replace dating apps — it enhances them. Link your profile, and we elevate the experience with soul-level insight.
  </p>
  <p class='mt-4 text-gray-800'>
    AI + Psychology + Emotional Intelligence- A lifelong journey from self-discovery to parenthood.
  </p>
  <p class='mt-4 text-gray-800'>
    Not a dating app — a relationship revolution.
  </p>
</details>`,
  },
  {
    title: "The Product",
    content: `<div class='grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800'>
    <details class='bg-white rounded-xl p-6 shadow-md'>
      <summary class='font-semibold cursor-pointer text-indigo-700 flex items-center gap-2 transition-transform duration-300 hover:scale-105'>
        <img src='/icons/match.svg' alt='Compatibility Engine' class='w-6 h-6' />
        Compatibility Engine
      </summary>
      <p class='mt-2'>Matches users on deep values, family goals, religious alignment, and psychological readiness.</p>
    </details>
    <details class='bg-white rounded-xl p-6 shadow-md'>
      <summary class='font-semibold cursor-pointer text-indigo-700 flex items-center gap-2 transition-transform duration-300 hover:scale-105'>
        <img src='/icons/ai.svg' alt='Emotional Mapping' class='w-6 h-6' />
        Emotional Mapping
      </summary>
      <p class='mt-2'>Analyzes tone and interactions to detect narcissism, trauma, emotional maturity, and relational intention.</p>
    </details>
    <details class='bg-white rounded-xl p-6 shadow-md'>
      <summary class='font-semibold cursor-pointer text-indigo-700 flex items-center gap-2 transition-transform duration-300 hover:scale-105'>
        <img src='/icons/event.svg' alt='Core Values' class='w-6 h-6' />
        Core Values
      </summary>
      <p class='mt-2'>Interactive Q&A to assess alignment on life’s most critical values — from parenting to money to belief systems.</p>
    </details>
    <details class='bg-white rounded-xl p-6 shadow-md'>
      <summary class='font-semibold cursor-pointer text-indigo-700 flex items-center gap-2 transition-transform duration-300 hover:scale-105'>
        <img src='/icons/token.svg' alt='Gamified Journey' class='w-6 h-6' />
        Gamified Journey
      </summary>
      <p class='mt-2'>Users earn rewards for growth milestones, self-awareness, and conscious connection. Progress becomes visible and valuable.</p>
    </details>
    <details class='bg-white rounded-xl p-6 shadow-md'>
      <summary class='font-semibold cursor-pointer text-indigo-700 flex items-center gap-2 transition-transform duration-300 hover:scale-105'>
        <img src='/icons/match.svg' alt='Smart Match Feed' class='w-6 h-6' />
        Smart Match Feed
      </summary>
      <p class='mt-2'>Curated, algorithmic feed based on values, goals, emotional readiness. Reduces wasted time and ensures better alignment from the first message.</p>
    </details>
    </details>
  <details class='bg-white rounded-xl p-6 shadow-md h-full'>
    <summary class='font-semibold cursor-pointer text-indigo-700 flex items-center gap-2 transition-transform duration-300 hover:scale-105'>
      <img src='/icons/referral.svg' alt='Viral Growth Engine' class='w-6 h-6' />
      Viral Growth Engine
    </summary>
    <ul class='mt-2 list-disc ml-6 text-gray-700'>
      <li>Invite friends, potential matches, or partners — even add your LoveGPT link to your dating profile bio.</li>
      <li>Earn tokens and climb the ranks of emotional and relational excellence.</li>
      <li>Tap into our 3-tier referral system — rewards that grow with your influence.</li>
      <li>Be featured on public leaderboards that celebrate conscious connection.</li>
      <li>Build alongside a purpose-driven, scalable community rooted in emotional intelligence.</li>
    </ul>
  </details>
     <details class='bg-white rounded-xl p-6 shadow-md h-full'>
    <summary class='font-semibold cursor-pointer text-indigo-700 flex items-center gap-2 transition-transform duration-300 hover:scale-105'>
      <img src='/aria-avatar.png' alt='ARIA Avatar' class='w-6 h-6 rounded-full' />
      ARIA — AI with a Soul
    </summary>
    <ul class='mt-2 list-disc ml-6 text-gray-700'>
      <li>ARIA is your emotionally intelligent wingwoman, therapist, and coach in one.</li>
      <li>She provides personalized advice in real-time — from texting tips to emotional clarity.</li>
      <li>Privacy-first design: nothing you share is recorded, stored, or transmitted. You’re always in control.</li>
      <li>Investors benefit from unique retention: ARIA builds trust, emotional engagement, and lifetime value.</li>
      <li>Differentiator: No other dating platform has a true AI therapist guiding users from courtship to co-parenting.</li>
    </ul>
  </details>
    </details>
    <details class='bg-white rounded-xl p-6 shadow-md'>
      <summary class='font-semibold cursor-pointer text-indigo-700 flex items-center gap-2 transition-transform duration-300 hover:scale-105'>
        <img src='/icons/event.svg' alt='Event Dating' class='w-6 h-6' />
        Event-Based Dating System
      </summary>
      <p class='mt-2'>Users match based on mutual intent to attend curated events. Promotes real-world interaction and creates monetization opportunities through premium matchmaking experiences.</p>
    </details>
    <details class='bg-white rounded-xl p-6 shadow-md'>
      <summary class='font-semibold cursor-pointer text-indigo-700 flex items-center gap-2 transition-transform duration-300 hover:scale-105'>
        <img src='/icons/travel.svg' alt='Travel Companion' class='w-6 h-6' />
        Travel Companion Matching
      </summary>
      <p class='mt-2'>Find ideal travel partners based on compatibility and shared goals. Enables exclusive trip-based matchmaking and premium lifestyle branding.</p>
    </details>
    <details class='bg-white rounded-xl p-6 shadow-md'>
      <summary class='font-semibold cursor-pointer text-indigo-700 flex items-center gap-2 transition-transform duration-300 hover:scale-105'>
        <img src='/icons/token.svg' alt='Token Growth' class='w-6 h-6' />
        Token-Based Growth & Recognition
      </summary>
      <p class='mt-2'>Users earn tokens for self-growth, coaching, and mentoring others. Ties emotional intelligence to financial and social capital, creating an economy of conscious living.</p>
    </details>
  </div>`
  },
  {
    title: "Barrier to Entry",
    content: `<ul class='list-disc ml-6 mt-4 text-gray-700'>
      <li><strong>Proprietary Compatibility Engine:</strong> Built on deep psychology, emotional intelligence, and value alignment — not just surface-level preferences.</li>
      <li><strong>ARIA AI Therapist:</strong> No dating app has a fully integrated emotionally intelligent assistant guiding users toward deeper relationships and personal growth.</li>
      <li><strong>Emotional Mapping IP:</strong> Unique machine learning models that assess tone, behavior, and patterns to predict readiness and red flags.</li>
      <li><strong>Gamified Self-Development:</strong> Tokenized incentives for users to grow emotionally, making emotional maturity part of the product experience.</li>
      <li><strong>Utility Token Ecosystem:</strong> Our token drives user behavior, creates stickiness, and builds a sense of shared value between users and the brand.</li>
      <li><strong>Referral Network Flywheel:</strong> 3-tier system, leaderboards, and real-world value rewards amplify growth organically and defensibly.</li>
      <li><strong>Culture + Community:</strong> We’re not a mass-market dating app — we’re a mission-led movement. LoveGPT is built for a conscious, emotionally ready audience that traditional apps fail to serve.</li>
      <li><strong>First-Mover Advantage:</strong> The fusion of emotional intelligence, AI therapy, tokenization, and relational mastery is a category-defining leap — not easily replicated without years of development and trust-building.</li>
    </ul>`,
  },
  {
    title: "Market Opportunity",
    content: `<p class='text-gray-700'>LoveGPT sits at the convergence of massive tailwinds: AI adoption, emotional wellness, and rising dissatisfaction with superficial digital culture. We are the first to blend these into a monetizable, soul-aligned platform ready for scale.</p>`
  },//
  {
    title: "Target Audience",
    content: `<details>
  <summary class='cursor-pointer text-indigo-700 font-semibold'>Who we’re built for →</summary>
  <ul class='list-disc ml-6 mt-4 text-gray-700'>
    <li>25–45 year olds seeking meaningful relationships</li>
    <li>High-net-worth individuals valuing exclusivity & compatibility</li>
    <li>Spiritual, growth-oriented singles</li>
    <li>Couples seeking relationship mastery</li>
  </ul>
  <p class='mt-4'>This is not a platform for everyone — and that’s the point. LoveGPT is for the conscious, the ready, the intentional. Those who want not just a partner, but a purpose-driven journey together.</p>
</details>`,
  },
  {
    title: "Roadmap (2025–2026)",
    content: `<details>
  <summary class='cursor-pointer text-indigo-700 font-semibold'>See our 5-phase strategic roadmap →</summary>
  <ul class='list-disc ml-6 mt-4 text-gray-700'>
    <li>Phase 1 (Q2 2025): Compatibility AI, Smart Profiles, Token Core</li>
    <li>Phase 2 (Q3 2025): Values Matching, Conflict Simulator</li>
    <li>Phase 3 (Q4 2025): Token Leaderboards, Mentors, Viral Hooks</li>
    <li>Phase 4 (Q1 2026): Event Dating, Travel Matches, Verified URLs</li>
    <li>Phase 5 (Q2 2026): Couples AI Coaching, Mastery System</li>
  </ul>
  <div class='w-full mt-6'>
    <img src='/graphs/roadmap-timeline.png' alt='LoveGPT Roadmap' class='animate-fade-in-up transition duration-700 ease-out rounded-xl shadow-md mx-auto w-full max-w-3xl' />
  </div>
</details>`,
  },
  {
    title: "Traction & Growth",
    content: `<ul class='list-disc ml-6 mt-4 text-gray-700'>
      <li>Pre-launch waitlist building</li>
      <li>Strategic partnerships forming (events, coaches, luxury brands)</li>
      <li>Beta test groups confirmed for Event Dating Module</li>
      <li>Influencer onboarding + Referral Rewards (Viral Loop)</li>
    </ul>`,
  },
  {
    title: "Revenue Model",
    content: `<ul class='list-disc ml-6 mt-4 text-gray-700'>
      <li>Freemium subscription tiers</li>
      <li>Premium Membership</li>
      <li>Upgraded Profile Features</li>
      <li>Token ecosystem for growth</li>
      <li>Coaching</li>
      <li>Mentorship</li>
      <li>Premium Event access</li>
      <li>Token-based microtransactions</li>
      <li>Business partnerships (events, travel, matchmaking)</li>
    </ul>`,
  },
  {
    title: "The Team",
    content: `<ul class='list-disc ml-6 mt-4 text-gray-700'>
      <li>Founder: A Serial entrepreneur with backgrounds in Dental Medicine, Software, AI development, Personal Development, NLP, Quantum Mechanics and consciousness</li>
      <li>Experts: AI, Relationship Psychology, UX, Tokenomics</li>
      <li>Advisors: Dating app founders, therapists, investor angels</li>
    </ul>`,
  },
  {
    title: "The Ask",
    content: `<details>
  <summary class='cursor-pointer text-indigo-700 font-semibold'>Why we’re raising $3M →</summary>
  <p class='mt-4'>We are seeking an initial $3M seed round to fund the launch and scale of LoveGPT across product development, marketing, and operations.</p>
  <p class='mt-2'>This ask is aligned with the broader startup ecosystem where the average seed round is $3.5M, though it is above the median $1.5M raised by most dating platforms. Our elevated ask reflects the comprehensive, multi-disciplinary nature of LoveGPT, combining tech, emotional intelligence, and social impact.</p>
  <ul class='list-disc ml-6 mt-4 text-gray-700'>
    <li>35% Marketing & Community Growth</li>
    <li>20% Product Development</li>
    <li>15% Talent Acquisition</li>
    <li>10% Legal & Compliance</li>
    <li>10% Operational Costs</li>
    <li>10% R&D</li>
  </ul>
  <div class='w-full mt-6'>
    <div className="w-full mt-6 animate-fade-in-up transition duration-700 ease-out">
  <img src="/graphs/market-opportunity.png" alt="Market Opportunity Graph" className="rounded-xl shadow-md mx-auto w-full max-w-3xl" />
</div>
</details>`,
  },
  {
    title: "Why Our Investors Will Win",
    content: `<ul class='list-disc ml-6 mt-4 text-gray-700'>
      <li>Investors gain early equity access via SAFE notes in a scalable, purpose-driven platform.</li>
      <li>Our unique model ensures multiple revenue streams, strong token utility, and unmatched brand loyalty in a $160B+ market.</li>
      <li>LoveGPT monetizes growth, education, mentorship, and emotional insight — not superficial swipes.</li>
    </ul>`,
  },
  {
    title: "The Renaissance of Love",
    content: `Invest in the evolution of love. Not just for this generation, but for the next.`,
  },
];

export default function PitchDeck() {
    const [showContactModal, setShowContactModal] = useState(false); // ✅ Must be inside the component
  
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
  
      const handleScroll = () => {
        const progress = document.getElementById("scroll-progress");
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (progress) progress.style.width = `${scrollPercent}%`;
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  

  return (
    <ChakraProvider>
      <MainLayout>
      <div className="fixed top-0 left-0 w-full h-1 bg-indigo-300 z-50">
        <div id="scroll-progress" className="h-full bg-indigo-600 transition-all ease-in-out duration-300" style={{ width: '0%' }} />
      </div>
      <div className="bg-gradient-to-b from-white to-indigo-100 text-gray-800">
        <section className="text-center py-24 px-6 md:px-24">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-indigo-800 animate-fade-in">
            LoveGPT Pitch Deck
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600 italic">
            A conscious technology movement — not a dating app.
          </p>
        </section>

<section className="space-y-28 px-6 md:px-24 pb-24 ml-auto lg:w-4/5">
  {slides.map((slide, idx) => {
    return (
      <MotionBox
  key={idx}
  bg="white"
  borderRadius="2xl"
  p={10}
  boxShadow="2xl"
  borderLeft="8px solid"
  borderColor="purple.400"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: idx * 0.1 }}
>
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">{slide.title}</h2>
        <div className="text-lg leading-relaxed text-gray-700">
          {slide.title === 'Market Opportunity' ? (
            <div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">Why this market is ready →</h3>
              <ul className="list-disc ml-6 mb-6">
                <li>Therapy and Coaching: $50B+</li>
                <li>Global Dating Market: $13B+</li>
                <li>Conscious Dating & Coaching: Rapidly growing</li>
                <li>Travel-Based & Luxury Dating: Untapped</li>
                <li>AI Relationship Tools: Emerging frontier</li>
              </ul>
              <div className="w-full mt-6 animate-fade-in-up transition duration-700 ease-out">
                <img src="/graphs/market-opportunity.png" alt="Market Opportunity" className="rounded-xl shadow-md mx-auto w-full max-w-3xl" />
              </div>
              <p className="mt-4">LoveGPT sits at the convergence of massive tailwinds: AI adoption, emotional wellness, and rising dissatisfaction with superficial digital culture. We are the first to blend these into a monetizable, soul-aligned platform ready for scale.</p>
            </div>
          ) : slide.title === 'The Ask' ? (
            <div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">Why we’re raising $3M →</h3>
              <p className="mt-4">We are seeking an initial $3M seed round to fund the launch and scale of LoveGPT across product development, marketing, and operations.</p>
              <p className="mt-2">This ask is aligned with the broader startup ecosystem where the average seed round is $3.5M, though it is above the median $1.5M raised by most dating platforms. Our elevated ask reflects the comprehensive, multi-disciplinary nature of LoveGPT, combining tech, emotional intelligence, and social impact.</p>
              <ul className="list-none ml-6 mt-4 text-gray-700 space-y-2">
  <li><span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#6366f1]"></span>35% Marketing & Community Growth</li>
  <li><span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#ec4899]"></span>20% Product Development</li>
  <li><span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#10b981]"></span>15% Talent Acquisition</li>
  <li><span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#f59e0b]"></span>10% Legal & Compliance</li>
  <li><span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#8b5cf6]"></span>10% Operational Costs</li>
  <li><span className="inline-block w-3 h-3 mr-2 rounded-full bg-[#ef4444]"></span>10% R&D</li>
</ul>
              <div className="w-full mt-6 animate-fade-in-up transition duration-700 ease-out">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      isAnimationActive={true}
                      data={[
                        { name: 'Marketing & Community Growth (35%)', value: 35 },
                        { name: 'Product Development (20%)', value: 20 },
                        { name: 'Talent Acquisition (15%)', value: 15 },
                        { name: 'Legal & Compliance (10%)', value: 10 },
                        { name: 'Operational Costs (10%)', value: 10 },
                        { name: 'R&D (10%)', value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"].map((color, index) => (
                        <Cell key={"cell-" + index} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : slide.title === 'Roadmap (2025–2026)' ? (
            <div dangerouslySetInnerHTML={{ __html: slides.find(s => s.title === 'Roadmap (2025–2026)').content }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: slide.content }} />
          )}
        </div>
      </MotionBox>
    );
  })}


       {/* CTA Section */}
       <section className="py-20 text-center border-t border-gray-300">
  <h2 className="text-2xl font-semibold mb-6 text-indigo-800">Let’s Talk</h2>
  <p className="text-md max-w-xl mx-auto mb-6 text-gray-600">
    Interested in investing or becoming an advisor? ARIA is ready to answer your questions 24/7. Or reach out to our team directly.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[1.618rem] max-w-[1440px] mx-auto">
    {/* Connect With Us opens the Contact Modal */}
    <CButton
  onClick={() => setShowContactModal(true)}
  width="100%"
  paddingX="6"
  paddingY="3"
  fontSize="lg"
  borderRadius="2xl"
  boxShadow="md"
  colorScheme="purple"
>
  💬 Connect With Us
</CButton>

    <Link href="mailto:admin@thelovegpt.ai">
      <CButton width="100%" paddingX="6" paddingY="3" fontSize="lg" borderRadius="2xl" boxShadow="md" colorScheme="purple">
        <FileText className="mr-2" /> Email Us
      </CButton>
    </Link>

    <CButton
  onClick={() => window.open('/financials', '_blank')}
  width="100%"
  paddingX="6"
  paddingY="3"
  fontSize="lg"
  borderRadius="2xl"
  boxShadow="md"
  colorScheme="green"
>
  <BarChart style={{ marginRight: '0.5rem' }} /> Financials
</CButton>

    <Link href="/investors">
      <CButton
  width="100%"
  paddingX="6"
  paddingY="3"
  fontSize="lg"
  borderRadius="2xl"
  boxShadow="md"
  colorScheme="purple"
>
  <FileText style={{ marginRight: '0.5rem' }} /> Executive Summary
</CButton>
    </Link>
  </div>

  {/* Contact Modal */}
  {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
</section>

</section>


          {/* ARIA Chat for Investor Questions */}
          <section className="py-20 bg-indigo-50">
            <div className="max-w-2xl mx-auto text-center mb-6">
              <h3 className="text-2xl font-bold text-indigo-700">Talk to ARIA</h3>
              <p className="text-md text-gray-600 mt-2">
                Got questions about investing, advising, or LoveGPT’s mission? Ask ARIA — our AI assistant trained to help investors like you.
              </p>
            </div>
            <div className="max-w-2xl mx-auto animate-fade-in-up transition duration-700 ease-out"><ARIAChat />
            </div>
</section>

        </div>
    </MainLayout>
  </ChakraProvider>
  );
}

