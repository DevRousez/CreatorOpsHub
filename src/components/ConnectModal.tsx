'use client';

import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  FileCode,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { YouTubeIcon, TikTokIcon } from './Icons';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMockData: boolean;
  onToggleMode: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
  isMockData,
  onToggleMode,
}) => {
  const [activeTab, setActiveTab] = useState<'supabase' | 'youtube' | 'tiktok' | 'env'>('supabase');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Centro de Conexiones & Configuración
              </h3>
              <p className="text-xs text-zinc-400">
                Pasa de datos ficticios a tus cuentas reales en 3 pasos sencillos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pestañas del Modal */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/40 px-5 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`py-3 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'supabase'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>1. Supabase (BD Cloud)</span>
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`py-3 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'youtube'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <YouTubeIcon className="h-3.5 w-3.5" />
            <span>2. YouTube (2 Canales)</span>
          </button>
          <button
            onClick={() => setActiveTab('tiktok')}
            className={`py-3 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'tiktok'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TikTokIcon className="h-3.5 w-3.5" />
            <span>3. TikTok (2 Cuentas)</span>
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`py-3 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'env'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Variables (.env.local)</span>
          </button>
        </div>

        {/* Contenido del Tab */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-zinc-300">
          
          {/* TAB 1: SUPABASE */}
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <strong className="block font-semibold">Esquema SQL listo para usar</strong>
                  Ya dejamos generado el archivo <code className="bg-emerald-950 px-1 py-0.5 rounded text-emerald-200">supabase/schema.sql</code> en tu proyecto con todas las tablas optimizadas.
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Pasos para conectar hoy cuando crees tu cuenta:</h4>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>
                    Crea un proyecto gratis en{' '}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 underline inline-flex items-center gap-0.5"
                    >
                      supabase.com <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    En el menú lateral de Supabase, entra a <strong>SQL Editor</strong>.
                  </li>
                  <li>
                    Abre el archivo <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200">supabase/schema.sql</code> de este proyecto, copia todo su contenido y haz clic en <strong>RUN</strong>.
                  </li>
                  <li>
                    Ve a <strong>Project Settings → API</strong> y copia tu <strong>Project URL</strong> y tu <strong>anon public key</strong> a tu archivo <code className="bg-zinc-800 px-1 py-0.5 rounded">.env.local</code>.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: YOUTUBE */}
          {activeTab === 'youtube' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300 flex items-start gap-2.5">
                <YouTubeIcon className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <strong className="block font-semibold">Conexión de tus 2 canales de YouTube</strong>
                  Google te da 10,000 unidades diarias gratis de cuota en YouTube Data API v3, más que suficiente para actualizar tus canales cada hora.
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Cómo obtener tu API Key en 2 minutos:</h4>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>
                    Entra a{' '}
                    <a
                      href="https://console.cloud.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-400 underline inline-flex items-center gap-0.5"
                    >
                      Google Cloud Console <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>Crea un proyecto nuevo (ej. "Creator Dashboard").</li>
                  <li>Ve a <strong>APIs & Services → Library</strong> y busca <strong>YouTube Data API v3</strong> y dale a Habilitar.</li>
                  <li>Ve a <strong>Credentials → Create Credentials → API Key</strong>.</li>
                  <li>Pega esa clave en tu <code className="bg-zinc-800 px-1.5 py-0.5 rounded">.env.local</code> en <code className="text-red-300">YOUTUBE_API_KEY</code>.</li>
                  <li>Tus dos IDs de canal (ej. UCxxxx) los puedes ingresar para empezar a monitorearlos automáticamente.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: TIKTOK */}
          {activeTab === 'tiktok' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <strong className="block font-semibold">Estrategia Dual para TikTok (Sin cuenta Dev)</strong>
                  Dejamos configurado el sistema para que funcione hoy mismo sin depender de la aprobación de desarrollador de TikTok.
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                  <h5 className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    Modo A (Actual - Recomendado):
                  </h5>
                  <p className="text-zinc-400">
                    Solo ingresas tus dos usuarios de TikTok en <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-cyan-300">TIKTOK_MONITORED_HANDLES=carlos.oficial,carlostechhacks</code>. El conector local toma las métricas públicas de seguidores, likes y videos recientes directamente.
                  </p>
                </div>

                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                  <h5 className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-400" />
                    Modo B (Oficial TikTok for Developers):
                  </h5>
                  <p className="text-zinc-400">
                    El día que crees tu cuenta en TikTok Developers y te aprueben la app, solo pones tu <code className="bg-zinc-950 px-1 py-0.5 rounded text-purple-300">TIKTOK_CLIENT_KEY</code> y <code className="bg-zinc-950 px-1 py-0.5 rounded text-purple-300">TIKTOK_CLIENT_SECRET</code> en el <code className="bg-zinc-950 px-1 py-0.5 rounded">.env.local</code>. El código ya está listo para recibirlo sin rehacer nada.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ENV VARIABLES */}
          {activeTab === 'env' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Variable para cambiar a Cuentas Reales</h4>
                  <p className="text-zinc-400">
                    En <code className="bg-zinc-800 px-1 py-0.5 rounded">.env.local</code> puedes alternar en cualquier momento:
                  </p>
                </div>
                <button
                  onClick={onToggleMode}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs border ${
                    isMockData
                      ? 'bg-amber-950/60 text-amber-300 border-amber-700'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                  }`}
                >
                  {isMockData ? 'Actualmente: Modo Demo' : 'Actualmente: Modo Real'}
                </button>
              </div>

              <div className="relative rounded-xl bg-zinc-900 p-4 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto">
                <button
                  onClick={() => copyToClipboard('NEXT_PUBLIC_USE_MOCK_DATA=false')}
                  className="absolute top-3 right-3 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] text-zinc-200 flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  {copied ? '¡Copiado!' : 'Copiar'}
                </button>
                <p className="text-zinc-500"># Para usar datos ficticios:</p>
                <p className="text-amber-300">NEXT_PUBLIC_USE_MOCK_DATA=true</p>
                <br />
                <p className="text-zinc-500"># Para usar tus cuentas reales con Supabase y APIs:</p>
                <p className="text-emerald-400">NEXT_PUBLIC_USE_MOCK_DATA=false</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer del Modal */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="text-[11px] text-zinc-500">
            Archivo de configuración: <code className="text-zinc-300">.env.local</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            Entendido, cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
