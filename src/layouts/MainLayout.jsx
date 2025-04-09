import React, { useState } from 'react';
import Link from 'next/link';
import ARIAChat from '@/components/ARIAChat';

export default function MainLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 text-gray-800 overflow-x-hidden">
      {/* Header */}
      <header className="px-4 py-3 shadow bg-white w-full">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo with homepage link + responsive scaling */}
          <Link href="/" title="Home">
            <a className="flex items-center gap-2 md:gap-3">
              <img
                src="/lovegpt-logo.png"
                alt="LoveGPT Logo"
                width={32}
                height={32}
                className="object-contain w-8 md:w-10"
              />
              <h1 className="text-lg md:text-2xl font-bold">
                <span className="text-pink-500">Love</span>
                <span className="text-blue-500">GPT</span>
              </h1>
            </a>
          </Link>

          {/* Hamburger Button (mobile only) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-5 text-sm font-medium">
            <Link href="/"><a className="hover:text-pink-500">Home</a></Link>
            <Link href="/about"><a className="hover:text-pink-500">About Us</a></Link>
            <Link href="/aria"><a className="hover:text-pink-500">Meet ARIA</a></Link>
            <Link href="/pricing"><a className="hover:text-pink-500">Cost</a></Link>
            <Link href="/signup"><a className="text-pink-600 hover:text-pink-700">Sign Up</a></Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden mt-4 flex flex-col items-start space-y-3 px-4 text-sm font-medium">
            <Link href="/"><a onClick={() => setMenuOpen(false)} className="hover:text-pink-500">Home</a></Link>
            <Link href="/about"><a onClick={() => setMenuOpen(false)} className="hover:text-pink-500">About Us</a></Link>
            <Link href="/aria"><a onClick={() => setMenuOpen(false)} className="hover:text-pink-500">Meet ARIA</a></Link>
            <Link href="/pricing"><a onClick={() => setMenuOpen(false)} className="hover:text-pink-500">Cost</a></Link>
            <Link href="/signup"><a onClick={() => setMenuOpen(false)} className="text-pink-600 hover:text-pink-700">Sign Up</a></Link>
          </nav>
        )}
      </header>

      {/* Main Content with padding to prevent footer overlap */}
      <main className="flex-1 p-6 pb-28 overflow-x-hidden">
        {children}
      </main>

      {/* ARIA Chat Component (safe position on mobile) */}
      <ARIAChat />

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 p-4 mt-10">
        <div className="space-x-4 mb-2">
          <Link href="/privacy"><a className="hover:underline">Privacy Policy</a></Link>
          <Link href="/terms"><a className="hover:underline">Terms of Use</a></Link>
          <Link href="/investors"><a className="hover:underline">Investors</a></Link>
        </div>
        © {new Date().getFullYear()} LoveGPT • Built with ❤️ by ARIA
      </footer>
    </div>
  );
}
