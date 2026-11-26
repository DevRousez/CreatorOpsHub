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
      {filteredContent.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-xl bg-zinc-950/40 border border-dashed border-zinc-800">
          <Sparkles className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-zinc-300">No hay videos en este filtro</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
            {filterPlatform === 'tiktok'
              ? 'Conecta tu cuenta de TikTok con 1-clic o sincroniza publicaciones para ver su rendimiento aquí.'
              : 'Los videos de tus canales de YouTube aparecerán aquí automáticamente al sincronizar.'}
          </p>
        </div>
      ) : (
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
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 text-[11px] font-semibold text-white">
                    {isYouTube ? (
                      <YouTubeIcon className="h-3 w-3 text-red-500" />
                    ) : (
                      <TikTokIcon className="h-3 w-3 text-cyan-400" />
                    )}
                    <span>{item.accountName}</span>
                  </div>

                  {/* Tipo / Duración */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-zinc-300">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{item.duration || (item.type === 'short' ? '00:59' : 'Video')}</span>
                  </div>

                  {/* Badge viral o rendimiento */}
                  {item.performanceTag === 'viral' && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold uppercase shadow-lg shadow-amber-500/20">
                      <Flame className="h-3 w-3 fill-black" />
                      <span>Viral</span>
                    </div>
                  )}
                </div>

                {/* Info del Video */}
                <div className="p-3.5 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-white line-clamp-2 hover:text-rose-400 transition-colors"
                      title={item.title}
                    >
                      {item.title}
                    </a>
                    <span className="text-[11px] text-zinc-500 mt-1 block">
                      {item.publishedAt}
                    </span>
                  </div>

                  {/* Métricas del video */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
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
      )}
    </div>
  );
};
