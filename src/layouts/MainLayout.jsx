import React, { useState } from 'react';
import Link from 'next/link';

export default function MainLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 text-gray-800 overflow-x-hidden">
      {/* Header */}
      <header className="px-4 py-3 shadow bg-white w-full">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/lovegpt-logo.png"
              alt="LoveGPT Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <h1 className="text-2xl font-bold">
              <span className="text-pink-500">Love</span>
              <span className="text-blue-500">GPT</span>
            </h1>
          </div>

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
            <Link href="/" className="hover:text-pink-500">Home</Link>
            <Link href="/about" className="hover:text-pink-500">About Us</Link>
            <Link href="/aria" className="hover:text-pink-500">Meet ARIA</Link>
            <Link href="/pricing" className="hover:text-pink-500">Cost</Link>
            <Link href="/signup" className="text-pink-600 hover:text-pink-700">Sign Up</Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden mt-4 flex flex-col items-start space-y-3 px-4 text-sm font-medium">
            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-pink-500">Home</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-pink-500">About Us</Link>
            <Link href="/aria" onClick={() => setMenuOpen(false)} className="hover:text-pink-500">Meet ARIA</Link>
            <Link href="/pricing" onClick={() => setMenuOpen(false)} className="hover:text-pink-500">Cost</Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)} className="text-pink-600 hover:text-pink-700">Sign Up</Link>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-x-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 p-4 mt-10">
        <div className="space-x-4 mb-2">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Use</Link>
          <Link href="/investors" className="hover:underline">Investors</Link>
        </div>
        © {new Date().getFullYear()} LoveGPT • Built with ❤️ by ARIA
      </footer>
    </div>
  );
}
