import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, FileText, BarChart } from "lucide-react";
import ARIAChat from "@/components/ARIAChat";
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
];

const sectionContent: string[] = [
  // (same HTML content blocks you already have, unchanged)
];

export default function Investors(): JSX.Element {
  return (
    <MainLayout>
      <div className="flex bg-gradient-to-b from-white to-indigo-100 text-gray-800 font-sans">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 p-6 sticky top-0 h-screen overflow-y-auto bg-white border-r border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Executive Summary</h2>
          <ul className="space-y-2 text-base">
            {sections.map((section, idx) => (
              <li key={idx}>
                <a
                  href={`#section-${idx}`}
                  className="hover:text-indigo-600 transition-all duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById(`section-${idx}`);
                    if (target) target.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {section}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 md:px-16 pt-0 space-y-20 max-w-7xl mx-auto">
          <section className="text-center pt-40 pb-20 bg-gradient-to-r from-indigo-100 to-rose-100 rounded-xl shadow-lg">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-indigo-800">
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
              <h2 className="text-3xl font-bold mb-4 text-indigo-700">{section}</h2>
              <div
                className="text-lg text-gray-800 leading-relaxed bg-white p-6 rounded-xl shadow-md"
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
              <Link href="/contact">
                <Button className="w-full aspect-[1.618] bg-indigo-600 text-white px-6 py-3 text-lg rounded-2xl shadow-md">
                  💬 Connect With Us
                </Button>
              </Link>
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
