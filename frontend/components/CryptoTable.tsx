'use client';

import { Coin } from '@/lib/api';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';

interface CryptoTableProps {
  coins: Coin[];
  onRemove?: (id: string) => void;
  showRemove?: boolean;
}

export default function CryptoTable({ coins, onRemove, showRemove = false }: CryptoTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50">
      <table className="w-full text-left text-sm text-slate-400">
        <thead className="bg-slate-900 text-xs uppercase text-slate-400">
          <tr>
            <th scope="col" className="px-6 py-3">Rank</th>
            <th scope="col" className="px-6 py-3">Coin</th>
            <th scope="col" className="px-6 py-3 text-right">Price</th>
            <th scope="col" className="px-6 py-3 text-right">24h Change</th>
            <th scope="col" className="px-6 py-3 text-right">Market Cap</th>
            {showRemove && <th scope="col" className="px-6 py-3 text-right">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {coins.map((coin) => (
            <tr key={coin.id} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4 font-medium">{coin.market_cap_rank}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100">{coin.name}</div>
                    <div className="text-xs uppercase">{coin.symbol}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-right font-medium text-slate-100">
                ${coin.current_price.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-right">
                <div
                  className={`flex items-center justify-end gap-1 ${
                    coin.price_change_percentage_24h >= 0
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                  }`}
                >
                  {coin.price_change_percentage_24h >= 0 ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                ${coin.market_cap.toLocaleString()}
              </td>
              {showRemove && onRemove && (
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onRemove(coin.id)}
                    className="text-rose-500 hover:text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
