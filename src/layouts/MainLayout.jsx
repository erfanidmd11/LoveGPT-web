import { useState } from 'react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';

export default function MainLayout({ children }) {
  const router = useRouter();
  // const [user] = useAuthState(auth);
  const user = null; // 🚧 Temporarily disable Firebase auth for crash isolation
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    // await auth.signOut();
    router.push('/');
  };

  const isActive = (path) => router.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 text-gray-800">
      {/* Header */}
      <header className="px-4 py-3 shadow bg-white/80 backdrop-blur-md sticky top-0 z-50 w-full">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/lovegpt-logo.png"
              alt="LoveGPT Logo"
              width={48}
              height={48}
              className="object-contain"
            />
            <h1 className="text-2xl font-bold">
              <span className="text-pink-500">Love</span>
              <span className="text-blue-500">GPT</span>
            </h1>
          </div>

          {/* Hamburger Button (mobile only) - TEMPORARILY DISABLED */}
          {/*
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
          */}
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-5 text-sm font-medium">
            <Link href="/" className={isActive('/') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'}>
              Home
            </Link>
            <Link href="/about" className={isActive('/about') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'}>
              About Us
            </Link>
            <Link href="/aria" className={isActive('/aria') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'}>
              Meet ARIA
            </Link>
            <Link href="/pricing" className={isActive('/pricing') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'}>
              Cost
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className={isActive('/dashboard') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'}>
                  Dashboard
                </Link>
                <Link href="/resume" className={isActive('/resume') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'}>
                  Resume
                </Link>
              </>
            )}
            {!user ? (
              <>
                <Link href="/signup" className="text-pink-600 hover:text-pink-700">
                  Sign Up
                </Link>
                <button
                  onClick={() => {
                    const loginEvent = new CustomEvent('open-login-modal');
                    window.dispatchEvent(loginEvent);
                  }}
                  className="bg-pink-500 text-white px-4 py-1.5 rounded-md hover:bg-pink-600 transition"
                >
                  Login
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-300"
              >
                Logout
              </button>
            )}
          </nav>
        </div>

        {/* Mobile Navigation Dropdown - TEMPORARILY DISABLED */}
        {/*
        {menuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-3 text-sm font-medium">
            <Link href="/" className={isActive('/') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'} onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about" className={isActive('/about') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'} onClick={() => setMenuOpen(false)}>
              About Us
            </Link>
            <Link href="/aria" className={isActive('/aria') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'} onClick={() => setMenuOpen(false)}>
              Meet ARIA
            </Link>
            <Link href="/pricing" className={isActive('/pricing') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'} onClick={() => setMenuOpen(false)}>
              Cost
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className={isActive('/dashboard') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'} onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/resume" className={isActive('/resume') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'} onClick={() => setMenuOpen(false)}>
                  Resume
                </Link>
              </>
            )}
            {!user ? (
              <>
                <Link href="/signup" className="text-pink-600 hover:text-pink-700" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
                <button
                  onClick={() => {
                    const loginEvent = new CustomEvent('open-login-modal');
                    window.dispatchEvent(loginEvent);
                    setMenuOpen(false);
                  }}
                  className="bg-pink-500 text-white px-4 py-1.5 rounded-md hover:bg-pink-600 transition"
                >
                  Login
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-300"
              >
                Logout
              </button>
            )}
          </nav>
        )}
        */}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>

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
