'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Save,
  Check,
  Search,
  Sparkles,
  Sliders,
  Tv,
  Power,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from 'lucide-react';
import { YouTubeIcon, TikTokIcon } from './Icons';
import { ConfigAccount, AppSettings } from '@/types/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: () => void;
}

const COLOR_PALETTE = [
  '#EF4444', // Rojo
  '#F97316', // Naranja
  '#EAB308', // Amarillo
  '#10B981', // Verde
  '#06B6D4', // Cian
  '#3B82F6', // Azul
  '#8B5CF6', // Violeta
  '#EC4899', // Rosa
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'apis' | 'mode'>('accounts');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados de configuración
  const [useMockData, setUseMockData] = useState<boolean>(false);
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState<string>('');
  const [youtubeApiKey, setYoutubeApiKey] = useState<string>('');
  const [tiktokMonitoredHandles, setTiktokMonitoredHandles] = useState<string>('');
  const [tiktokClientKey, setTiktokClientKey] = useState<string>('');
  const [tiktokClientSecret, setTiktokClientSecret] = useState<string>('');
  const [tiktokAccessToken, setTiktokAccessToken] = useState<string>('');
  const [accounts, setAccounts] = useState<ConfigAccount[]>([]);

  // Estados de pruebas de conexión
  const [sbTesting, setSbTesting] = useState(false);
  const [sbStatus, setSbStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [ytTesting, setYtTesting] = useState(false);
  const [ytStatus, setYtStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [ttTesting, setTtTesting] = useState(false);
  const [ttStatus, setTtStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [connectingTikTok, setConnectingTikTok] = useState(false);

  // Estado para agregar/editar cuenta
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [accountForm, setAccountForm] = useState<{
    platform: 'youtube' | 'tiktok';
    name: string;
    handle: string;
    channelId: string;
    badge: string;
    color: string;
    avatarUrl: string;
    enabled: boolean;
    subscribers: number;
    views24h: number;
    totalViews?: number;
    totalVideos?: number;
  }>({
    platform: 'youtube',
    name: '',
    handle: '',
    channelId: '',
    badge: 'Principal',
    color: '#EF4444',
    avatarUrl: '',
    enabled: true,
    subscribers: 0,
    views24h: 100,
    totalViews: 0,
    totalVideos: 0,
  });

  const [detectingChannel, setDetectingChannel] = useState(false);
  const [detectMsg, setDetectMsg] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedRedirectUri, setCopiedRedirectUri] = useState(false);

  // Cargar configuraciones al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadSettings();
      setSuccessMsg(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      
      // Respaldo de localStorage en cliente (máxima persistencia en entornos serverless)
      let localBackup: any = null;
      try {
        const rawLocal = localStorage.getItem('creatorops_settings_backup');
        if (rawLocal) localBackup = JSON.parse(rawLocal);
      } catch {}

      if (data.success && data.settings) {
        const s = data.settings;
        setUseMockData(s.useMockData ?? localBackup?.useMockData ?? false);
        setSupabaseUrl(s.supabase?.url || localBackup?.supabase?.url || '');
        setSupabaseAnonKey(s.supabase?.anonKey || localBackup?.supabase?.anonKey || '');
        setYoutubeApiKey(s.youtube?.apiKey || localBackup?.youtube?.apiKey || '');
        setTiktokMonitoredHandles(s.tiktok?.monitoredHandles || localBackup?.tiktok?.monitoredHandles || 'mundoanitoonia,pequemundotoon5');
        setTiktokClientKey(s.tiktok?.clientKey || localBackup?.tiktok?.clientKey || '');
        setTiktokClientSecret(s.tiktok?.clientSecret || localBackup?.tiktok?.clientSecret || '');
        setTiktokAccessToken(s.tiktok?.accessToken || localBackup?.tiktok?.accessToken || '');
        setAccounts(
          (s.accounts || localBackup?.accounts || []).map((acc: any) => ({
            ...acc,
            enabled: acc.enabled !== false,
          }))
        );
      } else if (localBackup) {
        setUseMockData(localBackup.useMockData ?? false);
        setSupabaseUrl(localBackup.supabase?.url || '');
        setSupabaseAnonKey(localBackup.supabase?.anonKey || '');
        setYoutubeApiKey(localBackup.youtube?.apiKey || '');
        setTiktokMonitoredHandles(localBackup.tiktok?.monitoredHandles || 'mundoanitoonia,pequemundotoon5');
        setTiktokClientKey(localBackup.tiktok?.clientKey || '');
        setTiktokClientSecret(localBackup.tiktok?.clientSecret || '');
        setTiktokAccessToken(localBackup.tiktok?.accessToken || '');
        if (Array.isArray(localBackup.accounts)) {
          setAccounts(localBackup.accounts);
        }
      }
    } catch (err: any) {
      setErrorMsg('No se pudieron cargar las configuraciones');
    } finally {
      setLoading(false);
    }
  };

  // Alternar activación/desactivación de una cuenta
  const handleToggleAccountEnabled = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, enabled: acc.enabled === false ? true : false } : acc
      )
    );
  };

  // Activar todas las cuentas
  const handleEnableAllAccounts = () => {
    setAccounts((prev) => prev.map((a) => ({ ...a, enabled: true })));
  };

  // Probar conexión a Supabase
  const handleTestSupabase = async () => {
    setSbTesting(true);
    setSbStatus(null);
    try {
      const res = await fetch('/api/settings/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'supabase',
          supabaseUrl,
          supabaseAnonKey,
        }),
      });
      const data = await res.json();
      setSbStatus({
        success: data.success,
        message: data.message,
      });
    } catch (e: any) {
      setSbStatus({ success: false, message: 'Fallo al contactar el servidor de pruebas' });
    } finally {
      setSbTesting(false);
    }
  };

  // Probar YouTube API Key
  const handleTestYouTube = async () => {
    setYtTesting(true);
    setYtStatus(null);
    try {
      const res = await fetch('/api/settings/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'youtube',
          youtubeApiKey,
        }),
      });
      const data = await res.json();
      setYtStatus({
        success: data.success,
        message: data.message,
      });
    } catch (e: any) {
      setYtStatus({ success: false, message: 'Fallo al verificar la clave de YouTube' });
    } finally {
      setYtTesting(false);
    }
  };

  // Probar TikTok API / Credenciales
  const handleTestTikTok = async () => {
    setTtTesting(true);
    setTtStatus(null);
    try {
      const res = await fetch('/api/settings/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tiktok',
          tiktokClientKey,
          tiktokClientSecret,
          tiktokAccessToken,
          tiktokHandle: tiktokMonitoredHandles.split(',')[0],
        }),
      });
      const data = await res.json();
      setTtStatus({
        success: data.success,
        message: data.message,
      });
    } catch (e: any) {
      setTtStatus({ success: false, message: 'Fallo al verificar credenciales de TikTok' });
    } finally {
      setTtTesting(false);
    }
  };

  // Conexión rápida OAuth de TikTok (envía las credenciales actuales para asegurar el canje del token)
  const handleConnectTikTok = async () => {
    setConnectingTikTok(true);
    try {
      const res = await fetch('/api/auth/tiktok/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientKey: tiktokClientKey || 'awo7pvamgk3831x0',
          clientSecret: tiktokClientSecret,
        }),
      });
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
        return;
      }
    } catch {}
    window.location.href = `/api/auth/tiktok/login?client_key=${encodeURIComponent(tiktokClientKey || 'awo7pvamgk3831x0')}`;
  };

  // Auto-detectar canal de YouTube (usa la clave del sistema o extracción pública sin que el usuario configure nada)
  const handleDetectYouTubeChannel = async () => {
    if (!accountForm.channelId && !accountForm.handle) {
      setDetectMsg('Ingresa un @Handle, enlace de YouTube o Channel ID (UC...)');
      return;
    }

    setDetectingChannel(true);
    setDetectMsg(null);
    try {
      const query = accountForm.channelId || accountForm.handle;
      const res = await fetch('/api/settings/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'youtube',
          youtubeApiKey: youtubeApiKey || undefined,
          channelQuery: query,
        }),
      });
      const data = await res.json();
      if (data.success && data.channel) {
        setAccountForm((prev) => ({
          ...prev,
          channelId: data.channel.channelId,
          name: data.channel.name,
          handle: data.channel.handle,
          avatarUrl: data.channel.avatarUrl || prev.avatarUrl,
          subscribers: data.channel.subscribers || prev.subscribers,
          totalViews: data.channel.totalViews || prev.totalViews,
          totalVideos: data.channel.totalVideos || prev.totalVideos,
        }));
        setDetectMsg(`✅ ¡Encontrado! "${data.channel.name}"`);
      } else {
        setDetectMsg(data.message || 'No se encontró el canal');
      }
    } catch (err) {
      setDetectMsg('Error buscando canal');
    } finally {
      setDetectingChannel(false);
    }
  };

  // Abrir formulario para agregar cuenta
  const handleStartAddAccount = () => {
    setEditingAccountId(null);
    setAccountForm({
      platform: 'youtube',
      name: '',
      handle: '',
      channelId: '',
      badge: 'Principal',
      color: COLOR_PALETTE[accounts.length % COLOR_PALETTE.length],
      avatarUrl: '',
      enabled: true,
      subscribers: 0,
      views24h: 150,
      totalViews: 0,
      totalVideos: 0,
    });
    setDetectMsg(null);
    setIsAddingAccount(true);
  };

  // Abrir formulario para editar cuenta existente
  const handleStartEditAccount = (acc: ConfigAccount) => {
    setEditingAccountId(acc.id);
    setAccountForm({
      platform: acc.platform,
      name: acc.name,
      handle: acc.handle,
      channelId: acc.channelId,
      badge: acc.badge || '',
      color: acc.color,
      avatarUrl: acc.avatarUrl || '',
      enabled: acc.enabled !== false,
      subscribers: acc.subscribers || 0,
      views24h: acc.views24h || 100,
      totalViews: acc.totalViews || 0,
      totalVideos: acc.totalVideos || 0,
    });
    setDetectMsg(null);
    setIsAddingAccount(true);
  };

  // Guardar cuenta (nueva o editada) en la lista local
  const handleSaveAccountForm = () => {
    if (!accountForm.name.trim()) {
      alert('Debes ingresar un nombre para el canal o cuenta');
      return;
    }

    if (editingAccountId) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === editingAccountId
            ? {
                ...a,
                ...accountForm,
                handle: accountForm.handle.startsWith('@') ? accountForm.handle : `@${accountForm.handle}`,
                channelId: accountForm.channelId || `acc_${Date.now()}`,
              }
            : a
        )
      );
    } else {
      const newAcc: ConfigAccount = {
        id: `${accountForm.platform === 'youtube' ? 'yt' : 'tt'}-${Date.now()}`,
        ...accountForm,
        handle: accountForm.handle.startsWith('@') ? accountForm.handle : `@${accountForm.handle}`,
        channelId: accountForm.channelId || `${accountForm.platform}_${Date.now()}`,
        subscribersChange24h: 2,
        totalViews: accountForm.subscribers * 25,
        totalVideos: 10,
        avgEngagementRate: 8.0,
      };
      setAccounts((prev) => [...prev, newAcc]);
    }

    setIsAddingAccount(false);
    setEditingAccountId(null);
  };

  // Eliminar cuenta de la lista
  const handleDeleteAccount = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar "${name}" de las cuentas? (Tip: puedes simplemente pausarla para no perderla)`)) {
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Guardar todo en el servidor (persistir en disco y DB)
  const handleSaveAll = async (andSync: boolean = false) => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload: Partial<AppSettings> = {
      useMockData,
      supabase: {
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
      },
      youtube: {
        apiKey: youtubeApiKey,
      },
      tiktok: {
        monitoredHandles: tiktokMonitoredHandles,
        clientKey: tiktokClientKey,
        clientSecret: tiktokClientSecret,
        accessToken: tiktokAccessToken,
      },
      accounts,
    };

    try {
      // Respaldo inmediato en el navegador del usuario
      try {
        localStorage.setItem('creatorops_settings_backup', JSON.stringify(payload));
      } catch {}

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Error al guardar');
      }

      if (andSync) {
        setSuccessMsg('Configuración guardada. Sincronizando cuentas con las APIs...');
        const syncRes = await fetch('/api/sync', { method: 'POST' });
        const syncData = await syncRes.json();
        if (syncData.success) {
          setSuccessMsg('✅ ¡Configuración guardada y cuentas sincronizadas con éxito!');
        } else {
          setSuccessMsg('Configuración guardada. Aviso de sincronización: ' + (syncData.error || 'verifica tus claves'));
        }
      } else {
        setSuccessMsg('✅ ¡Configuración guardada con éxito en el sistema!');
      }

      if (onConfigSaved) {
        onConfigSaved();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'No se pudieron guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const copySqlToClipboard = () => {
    const sqlText = `-- Tabla de Cuentas Conectadas
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  handle VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  channel_id VARCHAR(255) NOT NULL UNIQUE,
  badge VARCHAR(100),
  color VARCHAR(20) DEFAULT '#3B82F6',
  status VARCHAR(50) DEFAULT 'connected',
  subscribers BIGINT DEFAULT 0,
  subscribers_change_24h INT DEFAULT 0,
  total_views BIGINT DEFAULT 0,
  views_24h INT DEFAULT 0,
  total_videos INT DEFAULT 0,
  avg_engagement_rate NUMERIC(5, 2) DEFAULT 0.0,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Métricas Diarias Históricas
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  recorded_date DATE NOT NULL,
  views INT DEFAULT 0,
  followers_gained INT DEFAULT 0,
  total_followers BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, recorded_date)
);

-- Tabla de Contenido Reciente
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  video_id VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  views BIGINT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  type VARCHAR(50) DEFAULT 'video',
  performance_tag VARCHAR(50) DEFAULT 'promedio',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, video_id)
);`;

    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const activeAccountsCount = (accounts || []).filter((a) => a && a.enabled !== false).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Cabecera del Panel */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-md shadow-rose-900/30 ring-1 ring-zinc-700/80 bg-zinc-900 shrink-0">
              <img
                src="/logo.jpg"
                alt="CreatorOps Hub"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Panel de Configuración del Dashboard
                </h3>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded-full border border-rose-500/30">
                  Sin tocar código
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Gestiona tus canales de YouTube, cuentas de TikTok y conexiones de datos de forma visual
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex border-b border-zinc-800 bg-zinc-950 px-4 sm:px-6 gap-2 text-xs">
          <button
            onClick={() => { setActiveTab('accounts'); setIsAddingAccount(false); }}
            className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'accounts'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Tv className="h-4 w-4" />
            <span>1. Canales y Cuentas ({activeAccountsCount} activas de {accounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('apis')}
            className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'apis'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>2. Claves API (YouTube, TikTok & Supabase)</span>
          </button>

          <button
            onClick={() => setActiveTab('mode')}
            className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'mode'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>3. Modo y Sincronización</span>
          </button>
        </div>

        {/* Notificaciones de éxito o error */}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Contenido según pestaña */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-zinc-300 flex-1">
          
          {/* ======================================================== */}
          {/* TAB 1: CANALES Y CUENTAS */}
          {/* ======================================================== */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              
              {!isAddingAccount ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Canales y Cuentas Monitoreadas</span>
                        <span className="text-[11px] font-normal text-zinc-400">
                          ({activeAccountsCount} de {accounts.length} activas en dashboard)
                        </span>
                      </h4>
                      <p className="text-zinc-400 mt-0.5">
                        Puedes activar o pausar cuentas con el switch sin necesidad de borrarlas para aislar y analizar los canales que te interesen.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {activeAccountsCount < accounts.length && (
                        <button
                          type="button"
                          onClick={handleEnableAllAccounts}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-all"
                        >
                          Activar todas
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={handleConnectTikTok}
                        disabled={connectingTikTok}
                        className="px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 hover:text-white border border-cyan-700/60 font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                        title="Inicia sesión con TikTok para vincular una nueva cuenta con sus estadísticas y videos automáticamente"
                      >
                        {connectingTikTok ? <RefreshCw className="h-4 w-4 animate-spin" /> : <TikTokIcon className="h-4 w-4 text-cyan-400" />}
                        <span>+ Conectar TikTok (1-Clic)</span>
                      </button>

                      <button
                        onClick={handleStartAddAccount}
                        className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-rose-950/40 transition-all cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Agregar Manual</span>
                      </button>
                    </div>
                  </div>

                  {/* Lista de cuentas en cuadrícula */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {accounts.map((acc) => {
                      const isYT = acc.platform === 'youtube';
                      const isEnabled = acc.enabled !== false;

                      return (
                        <div
                          key={acc.id}
                          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                            isEnabled
                              ? 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                              : 'bg-zinc-950/60 border-zinc-800/60 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="relative shrink-0">
                              <img
                                src={acc.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'}
                                alt={acc.name}
                                className={`h-11 w-11 rounded-xl object-cover border ${
                                  isEnabled ? 'border-zinc-700' : 'border-zinc-800 grayscale'
                                }`}
                              />
                              <div
                                className={`absolute -bottom-1 -right-1 p-0.5 rounded text-white ${
                                  isYT ? 'bg-red-600' : 'bg-cyan-600'
                                }`}
                              >
                                {isYT ? <YouTubeIcon className="h-2.5 w-2.5" /> : <TikTokIcon className="h-2.5 w-2.5" />}
                              </div>
                            </div>

                            <div className="overflow-hidden">
                              <div className="flex items-center gap-1.5">
                                <h5 className={`font-bold truncate text-sm ${isEnabled ? 'text-zinc-100' : 'text-zinc-400'}`}>
                                  {acc.name}
                                </h5>
                                <span
                                  className="h-2.5 w-2.5 rounded-full inline-block shrink-0"
                                  style={{ backgroundColor: acc.color }}
                                  title={`Color en gráficas: ${acc.color}`}
                                />
                              </div>
                              <p className="text-[11px] text-zinc-400 truncate">{acc.handle}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {acc.badge && (
                                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                                    {acc.badge}
                                  </span>
                                )}
                                {!isEnabled && (
                                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                                    En Pausa
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Switch de activación/desactivación */}
                            <button
                              type="button"
                              onClick={() => handleToggleAccountEnabled(acc.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isEnabled
                                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/60'
                                  : 'bg-zinc-850 text-zinc-500 border border-zinc-700 hover:text-zinc-300'
                              }`}
                              title={isEnabled ? 'Cuenta activa en el dashboard (clic para pausar)' : 'Cuenta pausada (clic para activar)'}
                            >
                              <span className={`h-2 w-2 rounded-full ${isEnabled ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                              <span>{isEnabled ? 'Activa' : 'Pausada'}</span>
                            </button>

                            <button
                              onClick={() => handleStartEditAccount(acc)}
                              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                              title="Editar cuenta"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(acc.id, acc.name)}
                              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar cuenta permanentemente"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Formulario de agregar o editar cuenta */
                <div className="p-4 sm:p-5 rounded-xl bg-zinc-900 border border-zinc-700 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Tv className="h-4 w-4 text-rose-500" />
                      <span>{editingAccountId ? 'Editar Canal / Cuenta' : 'Agregar Nuevo Canal o Cuenta'}</span>
                    </h4>
                    <button
                      onClick={() => setIsAddingAccount(false)}
                      className="text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  {/* Selector de plataforma */}
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1.5">
                      Plataforma
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAccountForm((p) => ({ ...p, platform: 'youtube', color: '#EF4444' }))}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                          accountForm.platform === 'youtube'
                            ? 'bg-red-950/40 border-red-500 text-red-300 ring-1 ring-red-500'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <YouTubeIcon className="h-4 w-4" />
                        <span>YouTube</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAccountForm((p) => ({ ...p, platform: 'tiktok', color: '#06B6D4' }))}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                          accountForm.platform === 'tiktok'
                            ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <TikTokIcon className="h-4 w-4" />
                        <span>TikTok</span>
                      </button>
                    </div>
                  </div>

                  {/* Si es YouTube: detección automática */}
                  {accountForm.platform === 'youtube' && (
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block font-semibold text-zinc-300">
                          Enlace de YouTube, @Handle o Channel ID (UC...)
                        </label>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold">
                          Sin API Key requerida
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={accountForm.channelId || accountForm.handle}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAccountForm((p) => ({
                              ...p,
                              channelId: val.startsWith('UC') ? val : (val.includes('youtube.com') ? val : p.channelId),
                              handle: val.startsWith('@') ? val : p.handle,
                            }));
                          }}
                          placeholder="Pega el enlace https://youtube.com/@micanal o escribe @mundoanitoonia"
                          className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                        />
                        <button
                          type="button"
                          onClick={handleDetectYouTubeChannel}
                          disabled={detectingChannel}
                          className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {detectingChannel ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Search className="h-3.5 w-3.5" />
                          )}
                          <span>Auto-Detectar</span>
                        </button>
                      </div>
                      {detectMsg ? (
                        <p className={`text-[11px] ${detectMsg.includes('✅') ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {detectMsg}
                        </p>
                      ) : (
                        <p className="text-[11px] text-zinc-500">
                          Solo pega el @usuario o link de YouTube y presiona <strong>Auto-Detectar</strong>. Descargará el nombre, foto, suscriptores y videos automáticamente.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Si es TikTok: opción de Login OAuth directo */}
                  {accountForm.platform === 'tiktok' && (
                    <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-800/40 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-semibold text-white flex items-center gap-1.5 text-xs">
                            <TikTokIcon className="h-4 w-4 text-cyan-400" />
                            <span>Vincular cuenta con Login Oficial de TikTok</span>
                          </span>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            ¿Quieres que se descarguen solos su foto, nombre, estadísticas y videos? Conecta esta cuenta con 1 clic.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleConnectTikTok}
                          disabled={connectingTikTok}
                          className="shrink-0 px-3 py-1.5 rounded-lg bg-black hover:bg-zinc-900 border border-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {connectingTikTok ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <TikTokIcon className="h-3.5 w-3.5 text-cyan-400" />}
                          <span>Iniciar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Campos de Nombre y Handle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">
                        Nombre que verás en pantalla
                      </label>
                      <input
                        type="text"
                        value={accountForm.name}
                        onChange={(e) => setAccountForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Ej. Mi Canal Principal"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">
                        Usuario / Handle público
                      </label>
                      <input
                        type="text"
                        value={accountForm.handle}
                        onChange={(e) => setAccountForm((p) => ({ ...p, handle: e.target.value }))}
                        placeholder="Ej. @micanal"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* Insignia y Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">
                        Insignia / Categoría (Etiqueta visual)
                      </label>
                      <input
                        type="text"
                        value={accountForm.badge}
                        onChange={(e) => setAccountForm((p) => ({ ...p, badge: e.target.value }))}
                        placeholder="Ej. Misterio, Infantil, Gaming, Clips"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">
                        Color en las Gráficas
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        {COLOR_PALETTE.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setAccountForm((p) => ({ ...p, color: c }))}
                            className={`h-6 w-6 rounded-full transition-transform cursor-pointer ${
                              accountForm.color === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Métricas manuales / sincronizadas del canal */}
                  <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-300">
                        Métricas del Canal / Cuenta
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {accountForm.platform === 'youtube'
                          ? 'Se actualizan automáticamente con YouTube API o puedes ajustarlas aquí'
                          : 'Ajusta tus seguidores y métricas reales de TikTok'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                          {accountForm.platform === 'youtube' ? 'Suscriptores' : 'Seguidores'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={accountForm.subscribers}
                          onChange={(e) => setAccountForm((p) => ({ ...p, subscribers: parseInt(e.target.value, 10) || 0 }))}
                          className="w-full px-2.5 py-1.5 bg-black border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                          Vistas Totales
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={accountForm.totalViews ?? 0}
                          onChange={(e) => setAccountForm((p) => ({ ...p, totalViews: parseInt(e.target.value, 10) || 0 }))}
                          className="w-full px-2.5 py-1.5 bg-black border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                          Videos Totales
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={accountForm.totalVideos ?? 0}
                          onChange={(e) => setAccountForm((p) => ({ ...p, totalVideos: parseInt(e.target.value, 10) || 0 }))}
                          className="w-full px-2.5 py-1.5 bg-black border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                          Vistas Últimas 24h
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={accountForm.views24h}
                          onChange={(e) => setAccountForm((p) => ({ ...p, views24h: parseInt(e.target.value, 10) || 0 }))}
                          className="w-full px-2.5 py-1.5 bg-black border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Switch para activar/desactivar directamente en el formulario */}
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-zinc-200 block">Estado de la cuenta</span>
                      <span className="text-[11px] text-zinc-400">Si está desactivada, no se incluirá en las gráficas ni en el resumen general.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccountForm((p) => ({ ...p, enabled: !p.enabled }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        accountForm.enabled
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${accountForm.enabled ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                      <span>{accountForm.enabled ? 'Activa' : 'Pausada'}</span>
                    </button>
                  </div>

                  {/* Botones de acción del formulario */}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAccount(false)}
                      className="px-3.5 py-2 rounded-xl text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAccountForm}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                      <span>{editingAccountId ? 'Actualizar Cuenta' : 'Agregar Cuenta'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CLAVES API Y BASES DE DATOS */}
          {/* ======================================================== */}
          {activeTab === 'apis' && (
            <div className="space-y-6">
              
              {/* Sección YouTube API */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <YouTubeIcon className="h-5 w-5 text-red-500" />
                    <h4 className="text-sm font-bold text-white">YouTube Data API v3</h4>
                  </div>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-red-400 hover:underline flex items-center gap-1"
                  >
                    <span>Google Cloud Console</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <p className="text-zinc-400">
                  Google ofrece 10,000 unidades gratuitas al día para consultar estadísticas de tus canales y videos en tiempo real.
                </p>

                <div className="space-y-2">
                  <label className="block text-zinc-300 font-semibold">
                    API Key de YouTube
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={youtubeApiKey}
                      onChange={(e) => setYoutubeApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-red-500"
                    />
                    <button
                      type="button"
                      onClick={handleTestYouTube}
                      disabled={ytTesting}
                      className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {ytTesting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      <span>Probar Clave</span>
                    </button>
                  </div>

                  {ytStatus && (
                    <div
                      className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                        ytStatus.success
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                          : 'bg-red-950/60 text-red-300 border border-red-800'
                      }`}
                    >
                      {ytStatus.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      <span>{ytStatus.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sección TikTok for Developers (Oficial & Modo Dual) */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TikTokIcon className="h-5 w-5 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">TikTok for Developers (API Oficial & Modo Dual)</h4>
                  </div>
                  <a
                    href="https://developers.tiktok.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Portal TikTok Developers</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <p className="text-zinc-400 leading-relaxed">
                  Cuando recibas aprobación en TikTok Developers, ingresa tus credenciales oficiales aquí para conectar directamente con Display API v2. Mientras tanto, puedes usar tus handles monitoreados.
                </p>

                {/* Botón de Conexión OAuth Oficial 1-Clic */}
                <div className="p-3.5 bg-gradient-to-r from-cyan-950/40 via-zinc-950 to-zinc-900 rounded-xl border border-cyan-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                      <span>Conexión con TikTok (Login Oficial 1-Clic)</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Inicia sesión con tu cuenta de TikTok para autorizar y sincronizar tus estadísticas y videos sin configurar tokens manualmente.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleConnectTikTok}
                    disabled={connectingTikTok}
                    className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-zinc-900 text-white font-bold text-xs border border-zinc-700 shadow-lg shadow-black/60 hover:border-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {connectingTikTok ? <RefreshCw className="h-4 w-4 animate-spin" /> : <TikTokIcon className="h-4 w-4 text-cyan-400" />}
                    <span>Conectar con TikTok</span>
                  </button>
                </div>

                {/* Configuración de Redirect URI para TikTok Login Kit */}
                <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">
                      Redirect URI obligatoria en TikTok Developers (Login Kit)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://creator-ops-hub-xi.vercel.app';
                        navigator.clipboard.writeText(`${origin}/api/auth/tiktok/callback`);
                        setCopiedRedirectUri(true);
                        setTimeout(() => setCopiedRedirectUri(false), 2500);
                      }}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-cyan-300 font-medium flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedRedirectUri ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedRedirectUri ? 'Copiado' : 'Copiar URI'}</span>
                    </button>
                  </div>
                  <div className="p-2 bg-black rounded-lg border border-zinc-800 font-mono text-[11px] text-cyan-400 break-all select-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/api/auth/tiktok/callback` : 'https://creator-ops-hub-xi.vercel.app/api/auth/tiktok/callback'}
                  </div>
                  <p className="text-[11px] text-amber-300/90 leading-tight">
                    ⚠️ <strong>Si TikTok te muestra &quot;client_key&quot; al iniciar sesión:</strong> En TikTok Developers ve a tu app &gt; <em>Login Kit</em> y pega esta URI exacta. Además, si la app está en modo desarrollo (Staging), ve a <em>App Details &gt; Test Accounts</em> y agrega tu usuario de TikTok.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Client Key (App Key)
                    </label>
                    <input
                      type="text"
                      value={tiktokClientKey}
                      onChange={(e) => setTiktokClientKey(e.target.value)}
                      placeholder="awxxxxxxxxx"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Client Secret
                    </label>
                    <input
                      type="password"
                      value={tiktokClientSecret}
                      onChange={(e) => setTiktokClientSecret(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Access Token de Usuario (Opcional si usas OAuth)
                    </label>
                    <input
                      type="password"
                      value={tiktokAccessToken}
                      onChange={(e) => setTiktokAccessToken(e.target.value)}
                      placeholder="act.xxxxxxxx"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Handles Públicos Monitoreados (Modo A)
                    </label>
                    <input
                      type="text"
                      value={tiktokMonitoredHandles}
                      onChange={(e) => setTiktokMonitoredHandles(e.target.value)}
                      placeholder="usuario1,usuario2"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-zinc-500">
                    Soporta autenticación oficial de desarrollador y extracción pública de perfiles.
                  </span>
                  <button
                    type="button"
                    onClick={handleTestTikTok}
                    disabled={ttTesting}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/30 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {ttTesting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                    <span>Probar Conexión TikTok</span>
                  </button>
                </div>

                {ttStatus && (
                  <div
                    className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                      ttStatus.success
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950/60 text-red-300 border border-red-800'
                    }`}
                  >
                    {ttStatus.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <span>{ttStatus.message}</span>
                  </div>
                )}
              </div>

              {/* Sección Supabase */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-emerald-500" />
                    <h4 className="text-sm font-bold text-white">Supabase (Base de Datos en la Nube)</h4>
                  </div>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Ir a Supabase</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <p className="text-zinc-400">
                  Almacena tu histórico de 14 días y el feed de videos para que no se pierdan nunca al apagar tu PC.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Project URL
                    </label>
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Anon Public Key
                    </label>
                    <input
                      type="password"
                      value={supabaseAnonKey}
                      onChange={(e) => setSupabaseAnonKey(e.target.value)}
                      placeholder="sb_publishable_... o eyJhbGci..."
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={copySqlToClipboard}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-zinc-800/80 px-2.5 py-1.5 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copiedSql ? '¡SQL Copiado!' : 'Copiar Script SQL para Supabase'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTestSupabase}
                      disabled={sbTesting}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {sbTesting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      <span>Probar Conexión Supabase</span>
                    </button>
                  </div>

                  {sbStatus && (
                    <div
                      className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                        sbStatus.success
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                          : 'bg-red-950/60 text-red-300 border border-red-800'
                      }`}
                    >
                      {sbStatus.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      <span>{sbStatus.message}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: MODO Y SINCRONIZACIÓN */}
          {/* ======================================================== */}
          {activeTab === 'mode' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-4">
                <h4 className="text-sm font-bold text-white">Modo de Funcionamiento del Dashboard</h4>
                
                {/* Selector de modo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setUseMockData(true)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      useMockData
                        ? 'bg-amber-950/40 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-white">Modo Demo</span>
                      {useMockData && <CheckCircle2 className="h-4 w-4 text-amber-400" />}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Utiliza datos de muestra simulados. Ideal si aún no tienes tus claves API listas y quieres explorar la interfaz.
                    </p>
                  </div>

                  <div
                    onClick={() => setUseMockData(false)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      !useMockData
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-white">Modo Real (Recomendado)</span>
                      {!useMockData && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Conecta directamente con tus canales activos configurados, YouTube Data API, TikTok y Supabase para obtener estadísticas 100% reales.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de Sincronizar Ahora */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 to-zinc-900 border border-rose-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h5 className="font-bold text-white text-sm">Sincronización Inmediata</h5>
                  <p className="text-xs text-zinc-400">
                    Consulta las APIs de tus canales ahora mismo y actualiza el gráfico de 14 días y las tarjetas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveAll(true)}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-rose-950/50 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />
                  <span>Guardar y Sincronizar Ahora</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer del Modal */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-500 text-center sm:text-left">
            <span>Las configuraciones se guardan de forma permanente en tu sistema.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={() => handleSaveAll(false)}
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
