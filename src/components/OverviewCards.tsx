'use client';

import React from 'react';
import { GlobalOverview, Account } from '@/types';
import { Users, Eye, TrendingUp, Flame, ArrowUpRight } from 'lucide-react';

interface OverviewCardsProps {
  overview: GlobalOverview;
  accounts: Account[];
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ overview, accounts }) => {
  // Desglose de audiencia por plataforma
  const ytAudience = accounts
    .filter((a) => a.platform === 'youtube')
    .reduce((sum, a) => sum + a.subscribers, 0);

  const ttAudience = accounts
    .filter((a) => a.platform === 'tiktok')
    .reduce((sum, a) => sum + a.subscribers, 0);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX').format(num);
  };

  const formatCompact = (num: number) => {
    return new Intl.NumberFormat('es-MX', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Audiencia Total Unificada */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 hover:border-zinc-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Audiencia Total
          </span>
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Users className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {formatNumber(overview.totalAudience)}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="inline-flex items-center text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              +{formatNumber(overview.audienceGrowth24h)}
            </span>
            <span className="text-zinc-500">en las últimas 24h</span>
          </div>
        </div>

        {/* Mini barra de distribución */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
            YT: <strong className="text-zinc-200">{formatCompact(ytAudience)}</strong>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block" />
            TikTok: <strong className="text-zinc-200">{formatCompact(ttAudience)}</strong>
          </span>
        </div>
      </div>

      {/* 2. Reproducciones Últimas 24 Horas */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 hover:border-zinc-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Vistas Hoy (24h)
          </span>
          <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Eye className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {formatNumber(overview.totalViews24h)}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="inline-flex items-center text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
              +{overview.viewsGrowthPercent}%
            </span>
            <span className="text-zinc-500">vs promedio 7 días</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex justify-between">
          <span>Ritmo actual:</span>
          <span className="text-purple-300 font-medium">~{formatNumber(Math.round(overview.totalViews24h / 24))} vistas/hora</span>
        </div>
      </div>

      {/* 3. Tasa de Engagement Promedio */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 hover:border-zinc-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Engagement Promedio
          </span>
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {overview.avgEngagement}%
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="inline-flex items-center text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              +{overview.engagementTrend}%
            </span>
            <span className="text-zinc-500">alta interacción</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex justify-between">
          <span>Likes + Comentarios + Shares</span>
          <span className="text-emerald-400 font-medium">Saludable 🔥</span>
        </div>
      </div>

      {/* 4. Top Video de las 24h */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-950/40 via-zinc-900/60 to-zinc-900/60 border border-rose-900/40 p-5 hover:border-rose-700/60 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-rose-400 fill-rose-500" />
            Más Viral (24h)
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {overview.topVideo24h.platform}
          </span>
        </div>

        <div className="mt-3">
          <div className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug">
            {overview.topVideo24h.title}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-extrabold text-rose-400">
              +{formatNumber(overview.topVideo24h.views)}{' '}
              <span className="text-xs font-normal text-zinc-400">vistas</span>
            </span>
            <span className="text-xs text-zinc-400 truncate max-w-[110px]">
              {overview.topVideo24h.accountName}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-rose-900/30 text-[11px] text-rose-300/80 flex items-center gap-1">
          <span>🔥 Impulsando el 28% del tráfico diario</span>
        </div>
      </div>

    </div>
  );
};
