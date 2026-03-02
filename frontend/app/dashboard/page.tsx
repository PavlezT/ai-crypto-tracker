'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '@/lib/api-client';
import { Loader2, Plus } from 'lucide-react';

interface WatchlistItem {
  id: string;
  symbol: string;
  created_at: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSymbol, setNewSymbol] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load watchlist from API
  useEffect(() => {
    if (user) {
      loadWatchlist();
    }
  }, [user]);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await apiClient.getWatchlist();
      setWatchlist(items);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load watchlist');
      console.error('Error loading watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSymbol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;

    try {
      setError(null);
      await apiClient.addToWatchlist(newSymbol.toUpperCase());
      await loadWatchlist();
      setNewSymbol('');
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to add to watchlist');
    }
  };

  const removeFromWatchlist = async (id: string) => {
    try {
      setError(null);
      await apiClient.removeFromWatchlist(id);
      await loadWatchlist();
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to remove from watchlist');
    }
  };

  if (authLoading || (loading && watchlist.length > 0)) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/50 rounded-lg text-rose-500 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            My Watchlist
          </h1>
          <p className="text-slate-400">
            Manage your favorite cryptocurrencies ({watchlist.length}/50)
          </p>
        </div>
        
        <div className="relative w-full md:w-96">
          <form onSubmit={handleAddSymbol} className="relative">
            <input
              type="text"
              placeholder="Add symbol (e.g. BTC/USDT)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-4 pr-12 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              disabled={watchlist.length >= 50}
            />
            <button
              type="submit"
              disabled={watchlist.length >= 50}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {watchlist.length > 0 ? (
        <div className="bg-slate-900/30 rounded-lg border border-slate-800 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800 bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-300">Symbol</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-300">Added</th>
                <th className="px-6 py-4 text-right font-semibold text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {watchlist.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{item.symbol}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removeFromWatchlist(item.id)}
                      className="px-3 py-1 rounded bg-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white transition-colors text-xs font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/30 rounded-lg border border-slate-800 border-dashed">
          <p className="text-slate-500">
            Your watchlist is empty. Add crypto symbols to get started.
          </p>
        </div>
      )}
    </div>
  );
}
