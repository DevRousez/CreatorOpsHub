'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { OverviewCards } from '@/components/OverviewCards';
import { AccountCards } from '@/components/AccountCards';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { RecentContentFeed } from '@/components/RecentContentFeed';
import { SettingsModal } from '@/components/SettingsModal';
import { getDashboardData, DashboardData } from '@/lib/data-provider';
import { Sun, ArrowRight, Settings, Smartphone } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [syncTimestamp, setSyncTimestamp] = useState<string>('Hace unos momentos');
  const [authBanner, setAuthBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Cargar datos
  const loadData = async (mock?: boolean) => {
    setLoading(true);
    const result = await getDashboardData(mock !== undefined ? mock : isMockMode);
    setData(result);
    setIsMockMode(result.isMockData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Registro de Service Worker para PWA instalable
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('PWA Service Worker registration:', err);
        });
      });
    }

    // Capturar evento de instalación de la app
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tiktok_connected') === 'true') {
        setAuthBanner({
          type: 'success',
          message: '🎉 ¡Cuenta de TikTok vinculada con éxito! Tus estadísticas y videos han sido sincronizados.',
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (params.get('error')) {
        setAuthBanner({
          type: 'error',
          message: `Aviso de autorización TikTok: ${params.get('error')}`,
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Alternar entre modo ficticio y real
  const handleToggleMode = () => {
    const nextMode = !isMockMode;
    setIsMockMode(nextMode);
    loadData(nextMode);
  };

  // Acción de sincronización
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/sync', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    await loadData(isMockMode);
    setIsSyncing(false);
    setSyncTimestamp('Justo ahora');
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-4">
        <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-2xl shadow-rose-900/40 ring-1 ring-zinc-700/80 bg-zinc-900 animate-pulse">
          <img
            src="/logo.jpg"
            alt="CreatorOps Hub"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-300">
          <div className="h-4 w-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span>Iniciando CreatorOps Hub...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      {/* 1. Header Principal */}
      <Header
        isMockData={isMockMode}
        onToggleMode={handleToggleMode}
        onSync={handleSync}
        isSyncing={isSyncing}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        lastSyncedText={syncTimestamp}
        accountsCount={data.accounts.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Banner Instalador PWA para Móvil */}
        {deferredPrompt && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-zinc-900 to-zinc-900 border border-rose-500/30 flex items-center justify-between gap-3 shadow-lg shadow-rose-950/20 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 shrink-0">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Instalar CreatorOps Hub en tu teléfono</p>
                <p className="text-[11px] text-zinc-400">Accede directamente desde tu pantalla de inicio en pantalla completa.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallPWA}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Instalar App
              </button>
              <button
                onClick={() => setDeferredPrompt(null)}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Banner de Estado de Autenticación */}
        {authBanner && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              authBanner.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-800 text-emerald-200 shadow-lg shadow-emerald-950/30'
                : 'bg-amber-950/70 border-amber-800 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-medium">
              <span>{authBanner.message}</span>
            </div>
            <button
              onClick={() => setAuthBanner(null)}
              className="text-xs px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Banner Snapshot Matutino */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-900 border border-rose-900/40 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">
                  Resumen Matutino de Creador
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold">
                  Hoy al encender tu PC
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Tus <strong className="text-white font-bold">{data.accounts.length} cuentas vinculadas</strong> crecieron <strong className="text-emerald-400 font-bold">+{data.overview.audienceGrowth24h.toLocaleString('es-MX')} seguidores</strong> en las últimas 24 horas y acumularon <strong className="text-white font-bold">{data.overview.totalViews24h.toLocaleString('es-MX')} reproducciones</strong>.
                {data.overview.topVideo24h?.title && (
                  <span> Tu publicación <span className="text-rose-400 font-medium">"{data.overview.topVideo24h.title}"</span> encabeza el crecimiento.</span>
                )}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5 text-rose-400" />
              <span>Configuración</span>
            </button>
          </div>
        </div>

        {/* 2. Tarjetas de Métricas Consolidadas */}
        <OverviewCards overview={data.overview} accounts={data.accounts} />

        {/* 3. Cuentas Vinculadas (Dinámico según lo configurado en el Dashboard) */}
        <AccountCards
          accounts={data.accounts}
          selectedAccountId={selectedAccountId}
          onSelectAccount={setSelectedAccountId}
        />

        {/* 4. Gráficas Comparativas (14 Días reales dinámicos de Supabase y APIs) */}
        <AnalyticsCharts
          history={data.history}
          accounts={data.accounts}
          selectedAccountId={selectedAccountId}
        />

        {/* 5. Radar de Contenido Reciente */}
        <RecentContentFeed content={data.recentContent} />

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            CreatorOps Hub • Diseñado para monitorear YouTube & TikTok sin fricción.
          </p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Configurable 100% desde el Dashboard</span>
            <span>•</span>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-rose-400 hover:underline cursor-pointer"
            >
              Abrir Configuración
            </button>
          </div>
        </div>
      </footer>

      {/* Modal de Configuración y Gestión de Cuentas */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onConfigSaved={() => loadData(isMockMode)}
      />

    </div>
  );
}
