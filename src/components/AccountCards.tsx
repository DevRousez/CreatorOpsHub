'use client';

import React from 'react';
import { Account } from '@/types';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { YouTubeIcon, TikTokIcon } from './Icons';

interface AccountCardsProps {
  accounts: Account[];
  selectedAccountId: string | null;
  onSelectAccount: (accountId: string | null) => void;
}

export const AccountCards: React.FC<AccountCardsProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX').format(num);
  };

  const formatCompact = (num: number) => {
    return new Intl.NumberFormat('es-MX', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Tus Cuentas Vinculadas</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-normal">
              {accounts.length} activas
            </span>
          </h2>
        </div>
        {selectedAccountId && (
          <button
            onClick={() => onSelectAccount(null)}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            Mostrar todas las cuentas
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {accounts.map((acc) => {
          const isSelected = selectedAccountId === acc.id;
          const isYouTube = acc.platform === 'youtube';

          return (
            <div
              key={acc.id}
              onClick={() => onSelectAccount(isSelected ? null : acc.id)}
              className={`cursor-pointer group relative rounded-2xl p-4 transition-all border ${
                isSelected
                  ? 'bg-zinc-900 border-rose-500 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90'
              }`}
            >
              {/* Encabezado de la cuenta */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={acc.avatarUrl}
                      alt={acc.name}
                      className="h-11 w-11 rounded-xl object-cover border border-zinc-700 group-hover:border-zinc-500 transition-all"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 p-1 rounded-md text-white shadow-sm ${
                        isYouTube ? 'bg-red-600' : 'bg-zinc-950 border border-zinc-700 text-cyan-400'
                      }`}
                    >
                      {isYouTube ? (
                        <YouTubeIcon className="h-3 w-3" />
                      ) : (
                        <TikTokIcon className="h-3 w-3" />
                      )}
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-zinc-100 truncate group-hover:text-white">
                        {acc.name}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 truncate">{acc.handle}</p>
                  </div>
                </div>

                {acc.badge && (
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 shrink-0">
                    {acc.badge}
                  </span>
                )}
              </div>

              {/* Estadísticas de Seguidores / Subs */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-zinc-400">
                    {isYouTube ? 'Suscriptores' : 'Seguidores'}
                  </span>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-white">
                      {formatNumber(acc.subscribers)}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end">
                      <ArrowUpRight className="h-3 w-3" />
                      +{acc.subscribersChange24h} hoy
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2x2 de métricas rápidas */}
              <div className="mt-3 grid grid-cols-2 gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/60 text-xs">
                <div>
                  <span className="text-[11px] text-zinc-500 block">Vistas 24h</span>
                  <span className="font-bold text-zinc-200">
                    {formatCompact(acc.views24h)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 block">Engagement</span>
                  <span className="font-bold text-emerald-400">
                    {acc.avgEngagementRate}%
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 block">Videos Totales</span>
                  <span className="font-bold text-zinc-300">
                    {acc.totalVideos}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 block">Vistas Totales</span>
                  <span className="font-bold text-zinc-300">
                    {formatCompact(acc.totalViews)}
                  </span>
                </div>
              </div>

              {/* Botón flotante para Studio */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Conectado
                </span>
                <a
                  href={isYouTube ? `https://studio.youtube.com/channel/${acc.channelId}` : `https://www.tiktok.com/${acc.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <span>Abrir Studio</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
