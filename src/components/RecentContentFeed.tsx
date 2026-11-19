'use client';

import React, { useState } from 'react';
import { RecentContent, Platform } from '@/types';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Eye, 
  Sparkles,
  Flame,
  Clock
} from 'lucide-react';
import { YouTubeIcon, TikTokIcon } from './Icons';

interface RecentContentFeedProps {
  content: RecentContent[];
}

export const RecentContentFeed: React.FC<RecentContentFeedProps> = ({ content }) => {
  const [filterPlatform, setFilterPlatform] = useState<'all' | Platform>('all');

  const filteredContent = filterPlatform === 'all'
    ? content
    : content.filter((c) => c.platform === filterPlatform);

  const formatCompact = (num: number) => {
    return new Intl.NumberFormat('es-MX', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
  };

  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-4">
      {/* Encabezado y Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Radar de Contenido Reciente</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Tus últimas publicaciones en YouTube y TikTok y su tracción en las primeras 48h
          </p>
        </div>

        <div className="flex p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setFilterPlatform('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterPlatform === 'all'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Todos ({content.length})
          </button>
          <button
            onClick={() => setFilterPlatform('youtube')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              filterPlatform === 'youtube'
                ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <YouTubeIcon className="h-3 w-3" />
            <span>YouTube</span>
          </button>
          <button
            onClick={() => setFilterPlatform('tiktok')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              filterPlatform === 'tiktok'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TikTokIcon className="h-3 w-3" />
            <span>TikTok</span>
          </button>
        </div>
      </div>

      {/* Grid de Contenido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContent.map((item) => {
          const isYouTube = item.platform === 'youtube';

          return (
            <div
              key={item.id}
              className="group rounded-xl bg-zinc-950/70 border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all flex flex-col"
            >
              {/* Miniatura con badges */}
              <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badge de plataforma */}
                <div
                  className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1 shadow-md backdrop-blur-md ${
                    isYouTube ? 'bg-red-600/90' : 'bg-black/90 text-cyan-400'
                  }`}
                >
                  {isYouTube ? <YouTubeIcon className="h-3 w-3" /> : <TikTokIcon className="h-3 w-3" />}
                  <span className="uppercase">{item.type}</span>
                </div>

                {/* Badge de Performance (Viral, Alto, etc.) */}
                {item.performanceTag === 'viral' && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600/90 text-white flex items-center gap-1 shadow-md">
                    <Flame className="h-3 w-3 fill-white" />
                    VIRAL
                  </div>
                )}
                {item.performanceTag === 'alto' && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-black flex items-center gap-1 shadow-md">
                    SOBRE PROMEDIO 🚀
                  </div>
                )}

                {/* Duración */}
                {item.duration && (
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-zinc-300 font-mono">
                    {item.duration}
                  </div>
                )}
              </div>

              {/* Información del Video */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="font-medium text-zinc-300 truncate max-w-[160px]">
                      {item.accountName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.publishedAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                </div>

                {/* Métricas del video */}
                <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 font-extrabold text-white">
                    <Eye className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{formatCompact(item.views)}</span>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3 text-zinc-400" />
                      {formatCompact(item.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-zinc-400" />
                      {formatCompact(item.comments)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3 w-3 text-zinc-400" />
                      {formatCompact(item.shares)}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
