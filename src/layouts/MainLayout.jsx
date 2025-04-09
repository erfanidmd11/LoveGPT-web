import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 text-gray-800">
      {/* Header */}
      <header className="px-4 py-3 shadow bg-white w-full">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-5 text-sm font-medium">
            <Link href="/" className="hover:text-pink-500">Home</Link>
            <Link href="/about" className="hover:text-pink-500">About Us</Link>
            <Link href="/aria" className="hover:text-pink-500">Meet ARIA</Link>
            <Link href="/pricing" className="hover:text-pink-500">Cost</Link>
            <Link href="/signup" className="text-pink-600 hover:text-pink-700">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
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
