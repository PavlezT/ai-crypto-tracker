'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Menu, X, Bitcoin } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Bitcoin className="h-8 w-8 text-emerald-500" />
              <span className="font-bold text-xl tracking-tight">CryptoTracker</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="bg-rose-600 hover:bg-rose-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 pb-3 px-2 pt-2 space-y-1 sm:px-3 border-t border-slate-800">
          <Link
            href="/"
            className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left bg-rose-600 hover:bg-rose-700 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
