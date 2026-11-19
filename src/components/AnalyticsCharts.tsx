'use client';

import React, { useState } from 'react';
import { MetricPoint, Account } from '@/types';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface AnalyticsChartsProps {
  history: MetricPoint[];
  accounts: Account[];
  selectedAccountId: string | null;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  history,
  accounts,
  selectedAccountId,
}) => {
  const [metricTab, setMetricTab] = useState<'views' | 'subs'>('views');

  const formatCompact = (num: number) => {
    return new Intl.NumberFormat('es-MX', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
  };

  // Cuentas a mostrar según la selección
  const visibleAccounts = selectedAccountId
    ? accounts.filter((a) => a.id === selectedAccountId)
    : accounts;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950/95 border border-zinc-800 p-3 rounded-xl shadow-xl text-xs backdrop-blur-md">
          <p className="font-bold text-zinc-200 mb-2">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span
                    className="h-2 w-2 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="truncate max-w-[150px]">{entry.name}:</span>
                </span>
                <span className="font-extrabold text-white">
                  {formatCompact(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-5">
      {/* Encabezado y Pestañas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-rose-500" />
            <span>Rendimiento Histórico Comparativo (Últimos 14 días)</span>
          </h2>
          <p className="text-xs text-zinc-400">
            {selectedAccountId
              ? `Mostrando historial detallado de ${visibleAccounts[0]?.name || 'la cuenta seleccionada'}`
              : `Compara el ritmo de crecimiento de tus ${accounts.length} cuentas vinculadas en tiempo real`}
          </p>
        </div>

        {/* Controles de vista */}
        <div className="flex items-center gap-2">
          {/* Pestañas de Métrica */}
          <div className="flex p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setMetricTab('views')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                metricTab === 'views'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Reproducciones
            </button>
            <button
              onClick={() => setMetricTab('subs')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                metricTab === 'subs'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Nuevos Seguidores
            </button>
          </div>
        </div>
      </div>

      {/* Gráfico Principal Dinámico */}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {metricTab === 'views' ? (
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                {accounts.map((acc) => (
                  <linearGradient key={`grad-${acc.id}`} id={`color_${acc.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={acc.color || '#EF4444'} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={acc.color || '#EF4444'} stopOpacity={0.0} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={formatCompact} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />

              {visibleAccounts.map((acc) => (
                <Area
                  key={`area-${acc.id}`}
                  type="monotone"
                  dataKey={`views_${acc.id}`}
                  name={`${acc.platform === 'youtube' ? 'YouTube' : 'TikTok'}: ${acc.name}`}
                  stroke={acc.color || '#EF4444'}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#color_${acc.id})`}
                />
              ))}
            </AreaChart>
          ) : (
            <BarChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={formatCompact} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />

              {visibleAccounts.map((acc) => (
                <Bar
                  key={`bar-${acc.id}`}
                  dataKey={`subs_${acc.id}`}
                  name={`${acc.platform === 'youtube' ? 'YT' : 'TT'}: ${acc.name}`}
                  fill={acc.color || '#EF4444'}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
