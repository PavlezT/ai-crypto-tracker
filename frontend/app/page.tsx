'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (user) {
    // Redirect authenticated users to dashboard
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            Welcome to CryptoTracker
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            You are logged in. Go to your dashboard to manage your watchlist.
          </p>
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg text-white font-semibold transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          CryptoTracker
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Track your favorite cryptocurrencies in one place. Create an account to manage your personal watchlist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-lg text-white font-semibold transition-colors"
          >
            Get Started
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center border border-slate-700 hover:bg-slate-800 px-8 py-3 rounded-lg text-white font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Add up to 50 cryptocurrencies to your watchlist</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Track your favorite digital assets</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Secure and private with your personal account</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
