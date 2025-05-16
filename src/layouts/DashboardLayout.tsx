import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleLogout = () => {
    auth.signOut();
    router.push('/');
  };

  return (
    <div className="dashboard-layout">
      <header className="header">
        <div className="logo">
          <Link href="/dashboard">LoveGPT</Link>
        </div>
        {user ? (
          <div className="menu">
            <span>Hello, {user.displayName || 'User'}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>Powered by ARIA — Your Emotional AI</p>
      </footer>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .header {
          background: #f9fafb;
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .menu {
          display: flex;
          align-items: center;
        }
        .footer {
          background: #f3f4f6;
          padding: 10px;
          text-align: center;
        }
        .main-content {
          flex: 1;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
