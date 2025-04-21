import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, FileText, BarChart } from "lucide-react";
import ARIAChat from "@/components/ARIAChat";
import ContactModal from "@/components/ContactModal";
import MainLayout from "@/layouts/MainLayout";
import Link from "next/link";



const sections: string[] = [
  "A Message from Our Founder",
  "Vision & Mission",
  "Problem Statement",
  "The LoveGPT Solution",
  "Core Features",
  "Market Opportunity",
  "Competitive Advantage",
  "Revenue Model & Tokenomics",
  "Use of Funds",
  "The Human Value Proposition",
  "Team & Founders",
  "Closing Statement"
];

const sectionContent: string[] = [
  `<p>At LoveGPT, we believe the purpose of life is love — not just romantic love, but the profound human connection that gives our existence meaning. In a world filled with distraction, disconnection, and transactional interactions, we’re on a mission to realign humanity with its core essence: empathy, emotional intelligence, and true understanding.</p><br/><p>As an investor or advisor, you’re not just backing a company — you’re joining a global movement to make the world a better place. A place where people are empowered to understand themselves, unlock their emotional blueprint, and form relationships that are deeply aligned in values, purpose, and soul.</p><br/><p>Just like AI learns from experience and evolves with input, so do humans. Every reaction, every trauma, every pattern in our relationships is rooted in learned behavior. But most of us never take the time — or have the tools — to decode our emotional operating system. LoveGPT provides this toolkit.</p><br/><p>We’re not here to just match people — we’re here to evolve people. To support them through the full journey of becoming whole: from self-discovery, to dating, to deep relationships, to parenthood, and eventually mentorship. Our vision is a generation of emotionally mature humans raising emotionally aware children.</p><br/><p>Unlike traditional dating apps that rely on churn and profit from shallow swiping and broken connections, LoveGPT thrives when people grow. Our ecosystem doesn’t end when a match is made — that’s when it truly begins.</p><br/><p>We invite you to be part of a renaissance. A reimagining of love, purpose, and human connection. A movement to heal generations through relationships that are conscious, value-aligned, and divinely intentional.</p><br/><p class='font-semibold text-indigo-700'>Together, let’s invest in love. Let’s invest in humanity.</p><br/><p class='italic text-right text-gray-500'>— Shervin Erfani, Founder</p>`,
  `<strong>Vision:</strong> To elevate the human experience of love and relationships by merging deep emotional intelligence with cutting-edge AI, helping people form genuine, lasting, and value-aligned connections.<br/><br/><strong>Mission:</strong> LoveGPT is on a mission to shift the dating paradigm from superficial attraction to soul-aligned partnership, guiding individuals through a transformative journey of self-awareness, meaningful connection, and conscious love.`,
  `<p>The dating landscape is broken. People are matching based on physical appearance, fleeting chemistry, or social pressure. These shallow foundations often lead to heartbreak, misaligned marriages, and generational trauma.</p><br/><p><strong>Key Issues:</strong></p><ul class='list-disc ml-6'><li>Superficial matching: prioritizing looks over values.</li><li>Social/biological pressure: leading to rushed decisions.</li><li>Lack of readiness assessments: emotional immaturity and narcissism go unchecked.</li><li>Mismatched goals: from children, finances, to religion and values.</li></ul><p>The current solutions fail to look beyond the surface and understand the human soul, values, and long-term compatibility.</p>`,
  `<p>LoveGPT is a relationship revolution — a tech-enabled path to conscious coupling.</p><br/><p>It combines AI, emotional intelligence, gamification, and value alignment to:</p><ul class='list-disc ml-6'><li>Assess partner readiness.</li><li>Match based on core values and long-term compatibility.</li><li>Provide real-time relationship coaching.</li><li>Build healthy communication from the first chat.</li><li>Help users grow into their best selves.</li></ul>`,
  `<ul class='list-disc ml-6'><li><strong>AI Compatibility Engine:</strong> Matches users on deep values, family goals, religious alignment, and psychological readiness.</li><li><strong>Emotional Profile Mapping:</strong> Analyzes messages, tone, and interaction to detect narcissism, trauma, emotional maturity, and intentions.</li><li><strong>Core Value Interviews:</strong> Interactive Q&A to assess alignment on life’s most critical topics.</li><li><strong>Gamified Growth Journey:</strong> Users earn points for completing self-work, learning modules, and communication challenges.</li><li><strong>Viral Hooks & Loops:</strong> Reward referrals and community engagement with points and status.</li><li><strong>Utility Tokenization:</strong> Token-based incentives for personal growth, community contribution, and verified mentorship.</li><li><strong>Couples Mentorship Program:</strong> Certified \"LoveGPT Elders\" guide others and earn tokens.</li></ul>`,
  `<ul class='list-disc ml-6'><li>$10B+ Online Dating Market</li><li>$50B+ Relationship & Therapy Industry</li><li>Rising demand for AI-driven wellness and conscious living platforms</li><li>Global mental health and emotional intelligence awareness</li><li><strong>Target Audience:</strong> Millennials, Gen Z, conscious singles, divorced individuals seeking transformation, and therapists/relationship coaches.</li></ul>`,
  `<ul class='list-disc ml-6'><li><strong>AI + Human Psychology:</strong> Most platforms stop at physical or lifestyle-based filters.</li><li><strong>Readiness Analysis:</strong> No one is assessing psychological and emotional maturity pre-match.</li><li><strong>Relationship Lifecycle Coaching:</strong> From first chat to post-marriage support.</li><li><strong>Tokenized Growth Ecosystem:</strong> Earn by becoming a better person, not just a better dater.</li><li><strong>Community Empowerment:</strong> Certified mentors create a tribe of conscious lovers.</li></ul>`,
  `<ul class='list-disc ml-6'><li><strong>Freemium Access:</strong> Free version with premium tiered upgrades.</li><li><strong>Token Economy:</strong> Utility tokens earned for growth, referrals, and community help.</li><li><strong>Mentorship Access:</strong> Book time with certified mentors (pay via token or fiat).</li><li><strong>Courses & Webinars:</strong> Premium emotional intelligence and relationship mastery content.</li><li><strong>Marketplace:</strong> Tools, gifts, and AI reports for relationship enhancement.</li></ul>`,
  `<p>We are seeking an initial $3M seed round to fund the launch and scale of LoveGPT across product development, marketing, and operations.</p><br/><p>This ask is aligned with the broader startup ecosystem where the average seed round is $3.5M, though it is above the median $1.5M raised by most dating platforms. Our elevated ask reflects the comprehensive, multi-disciplinary nature of LoveGPT, combining tech, emotional intelligence, and social impact.</p><br/><strong>Fund Allocation:</strong><ul class='list-disc ml-6'><li>35% Marketing & Community Growth</li><li>20% Product Development</li><li>15% Talent Acquisition</li><li>10% Legal & Compliance</li><li>10% Operational Costs</li><li>10% R&D</li></ul>`,
  `<ul class='list-disc ml-6'><li><strong>For Individuals:</strong> A mirror to your soul. Learn who you are, what you want, and how to love better.</li><li><strong>For Couples:</strong> A guide through the highs and lows of commitment. Grow stronger together.</li><li><strong>For Humanity:</strong> A chance to reduce divorce, break generational trauma, and raise children in stable, value-aligned homes.</li><li><strong>For Society:</strong> Empowered relationships = stronger communities, healthier mental states, and greater life satisfaction.</li></ul><br/>People don’t just use LoveGPT — they become part of a tribe, a legacy of love, and a global mission to evolve the human experience.`,
  `<p>Led by a serial entrepreneur with a background in Dental Medicine, Software, AI development, Personal Development, NLP, Quantum Mechanics and consciousness, the LoveGPT team brings experience in:</p><ul class='list-disc ml-6'><li>AI Development</li><li>Human Psychology & Relationship Therapy</li><li>Social Platforms & Viral Growth</li><li>Ethical Tech & Emotional Wellness</li></ul><br/><p>Advisors include top minds in neurology, spirituality, relationship therapy, and gamification.</p>`,
  `<p>LoveGPT is more than an app — it's a conscious relationship movement. We're inviting investors, creators, therapists, and visionary minds to join us in rewriting the narrative of love.</p><br/><p>Be part of the next relationship renaissance.</p><br/><strong>Invest in LoveGPT. Invest in Humanity.</strong>`
];

export default function Investors() {
    const [showContactModal, setShowContactModal] = useState(false); // ✅ only here

    return (
    <MainLayout>
      <div className="bg-gradient-to-b from-white to-indigo-100 text-gray-800 font-sans">

        {/* Main Content */}
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-0 space-y-20">
          <section className="text-center pt-40 pb-20 px-4 bg-gradient-to-r from-indigo-100 to-rose-100 rounded-xl shadow-lg">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-indigo-800 max-w-full mx-auto">
              Revolutionizing Love
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-700">
              LoveGPT is not just a dating platform — it's a global movement redefining how humanity connects.
            </p>
            <p className="text-md md:text-lg text-gray-500 max-w-xl mx-auto italic">
              "Bringing soul-aligned partnerships to life, through AI and emotional intelligence."
            </p>
          </section>

          {/* Executive Summary Sections */}
          {sections.map((section, idx) => (
            <section key={idx} id={`section-${idx}`} className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-4 text-indigo-700 text-center">{section}</h2>
              <div
                className="text-lg text-gray-800 leading-relaxed bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto"
                dangerouslySetInnerHTML={{ __html: sectionContent[idx] }}
              />
            </section>
          ))}

          {/* CTA Section */}
<section className="py-20 text-center border-t border-gray-300">
  <h2 className="text-2xl font-semibold mb-6 text-indigo-800">Let’s Talk</h2>
  <p className="text-md max-w-xl mx-auto mb-6 text-gray-600">
    Interested in investing or becoming an advisor? ARIA is ready to answer your questions 24/7. Or reach out to our team directly.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[1.618rem] max-w-[1440px] mx-auto">
    {/* Connect With Us opens modal */}
    <Button
      onClick={() => setShowContactModal(true)}
      className="w-full aspect-[1.618] bg-indigo-600 text-white px-6 py-3 text-lg rounded-2xl shadow-md transition-transform duration-300 hover:scale-105"
    >
      💬 Connect With Us
    </Button>

    <a href="tel:+17607078542">
      <Button className="w-full aspect-[1.618] bg-green-600 text-white px-6 py-3 text-lg rounded-2xl shadow-md">
        <Phone className="mr-2" /> Call Us
      </Button>
    </a>

    <Button
      className="w-full aspect-[1.618] bg-green-600 text-white px-6 py-3 text-lg rounded-2xl shadow-md"
      onClick={() => window.open('/financials', '_blank')}
    >
      <BarChart className="mr-2" /> Financials
    </Button>

    <Button
      className="w-full aspect-[1.618] bg-green-600 text-white px-6 py-3 text-lg rounded-2xl shadow-md"
      onClick={() => window.open('/pitch-deck', '_blank')}
    >
      <FileText className="mr-2" /> Pitch Deck
    </Button>
  </div>

  {/* Modal Render */}
  {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
</section>


          {/* ARIA Chat for Investor Questions */}
          <section className="py-20 bg-indigo-50">
            <div className="max-w-2xl mx-auto text-center mb-6">
              <h3 className="text-2xl font-bold text-indigo-700">Talk to ARIA</h3>
              <p className="text-md text-gray-600 mt-2">
                Got questions about investing, advising, or LoveGPT’s mission? Ask ARIA — our AI assistant trained to help investors like you.
              </p>
            </div>
            <div className="max-w-2xl mx-auto animate-fade-in-up transition duration-700 ease-out">
              <ARIAChat />
            </div>
          </section>
        </main>
      </div>
    </MainLayout>
  );
}
