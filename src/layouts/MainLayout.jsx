import React from 'react';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* Content */}
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
