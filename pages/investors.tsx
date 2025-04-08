// pages/investors.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowRight, FileText, BarChart } from "lucide-react";
import ARIAChat from "@/components/ARIAChat";
import MainLayout from "@/layouts/MainLayout";
import Link from "next/link";

export default function Investors() {
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-rose-50 to-indigo-100 text-gray-800 font-sans">
        {/* Hero Section */}
        <section className="text-center py-20 px-6 md:px-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Revolutionizing Love, One Conscious Connection at a Time
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            LoveGPT is more than a dating platform—it's a conscious relationship movement powered by AI, emotional intelligence, and value alignment.
          </p>
          <Button className="text-lg px-8 py-4" onClick={() => window.location.href = "mailto:s@joga.im"}>
            <Mail className="mr-2" /> Contact Us
          </Button>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 px-6 md:px-20 bg-white">
          <h2 className="text-3xl font-semibold mb-4">Our Vision</h2>
          <p className="text-lg max-w-3xl mb-6">
            To elevate the human experience of love and relationships by merging deep emotional intelligence with cutting-edge AI.
          </p>
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg max-w-3xl">
            Shift dating from superficial attraction to soul-aligned partnership. Help people become ready for love, emotionally, mentally, and spiritually.
          </p>
        </section>

        {/* Product Tour Section */}
        <section className="py-20 px-6 md:px-20 bg-indigo-50">
          <h2 className="text-3xl font-semibold mb-10 text-center">Product Tour</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["match-ui.png", "value-profile.png", "emotion-tracker.png"].map((src, idx) => (
              <Card key={idx} className="shadow-xl">
                <CardContent className="p-4">
                  <img
                    src={`/${src}`}
                    alt={`LoveGPT Screenshot ${idx + 1}`}
                    className="rounded-2xl mb-4 w-full object-cover"
                  />
                  <p className="text-center text-sm">Feature {idx + 1}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Market Opportunity & Fundraising Ask */}
        <section className="py-20 px-6 md:px-20">
          <h2 className="text-3xl font-semibold mb-6">Market Opportunity & Fundraising</h2>
          <p className="text-lg mb-4 max-w-3xl">
            The dating and relationship industry is worth over $60B. We are seeking a $3M seed round to build and scale LoveGPT’s AI-driven, value-matching platform.
          </p>
          <ul className="list-disc ml-6 mb-6 text-md">
            <li>35% Product Development</li>
            <li>20% Marketing & Community Growth</li>
            <li>15% Talent Acquisition</li>
            <li>10% Legal & Compliance</li>
            <li>10% Operational Costs</li>
            <li>10% R&D</li>
          </ul>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => window.open('/deck', '_blank')}>
              <FileText className="mr-2" /> View Pitch Deck
            </Button>
            <Button variant="outline" onClick={() => window.open('/financials', '_blank')}>
              <BarChart className="mr-2" /> View Financials
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 md:px-20 text-center bg-white">
          <h2 className="text-3xl font-semibold mb-6">Get Involved with LoveGPT</h2>
          <p className="text-md text-gray-700 mb-8 max-w-xl mx-auto">
            Whether you want to invest, collaborate, or explore the platform yourself, we’d love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-indigo-600 text-white px-6 py-3" onClick={() => window.location.href = 'mailto:s@joga.im'}>
              📩 Reach Out
            </Button>
            <Button className="bg-green-500 text-white px-6 py-3" onClick={() => window.location.href = '/signup'}>
              🚀 Sign Up for LoveGPT
            </Button>
          </div>
        </section>

        {/* Live ARIA Chat Component */}
        <section className="py-20 px-6 md:px-20 bg-indigo-50">
          <div className="max-w-2xl mx-auto">
            <ARIAChat />
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
