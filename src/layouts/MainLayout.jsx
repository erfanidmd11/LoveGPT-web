import React from 'react';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 text-gray-800">
      {/* Header (simplified - no sticky, no blur, no nav) */}
      <header className="px-4 py-3 shadow bg-white w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-pink-500">Love</span>
            <span className="text-blue-500">GPT</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 p-4 mt-10">
        <div className="space-x-4 mb-2">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Use</a>
          <a href="/investors" className="hover:underline">Investors</a>
        </div>
        © {new Date().getFullYear()} LoveGPT • Built with ❤️ by ARIA
      </footer>
    </div>
  );
}
