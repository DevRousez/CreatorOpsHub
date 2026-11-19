'use client';

import React from 'react';
import { 
  RefreshCw, 
  Settings, 
  Database, 
  Radio
} from 'lucide-react';

interface HeaderProps {
  isMockData: boolean;
  onToggleMode: () => void;
  onSync: () => void;
  isSyncing: boolean;
  onOpenSettingsModal: () => void;
  lastSyncedText?: string;
  accountsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  isMockData,
  onToggleMode,
  onSync,
  isSyncing,
  onOpenSettingsModal,
  lastSyncedText = 'Hace unos momentos',
  accountsCount = 4,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Logo y Titular */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-cyan-400 p-[1.5px] shadow-lg shadow-red-500/10">
            <div className="h-full w-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Radio className="h-5 w-5 text-rose-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                CreatorOps <span className="text-rose-500 font-extrabold">Hub</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                v1.1
              </span>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-1.5">
              <span>{accountsCount} Cuentas Vinculadas</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Sincronizado {lastSyncedText}
              </span>
            </p>
          </div>
        </div>

        {/* Snapshot matutino y Controles */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Badge de Modo (Ficticio vs Real) */}
          <button
            onClick={onToggleMode}
            title="Haz clic para alternar entre datos de prueba y cuentas reales"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              isMockData
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/40'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>
              {isMockData ? 'Modo Demo' : 'Modo Real'}
            </span>
            <span className="text-[10px] underline ml-1 text-zinc-400">
              cambiar
            </span>
          </button>

          {/* Botón de Sincronización */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-rose-400' : 'text-zinc-400'}`} />
            <span>{isSyncing ? 'Actualizando...' : 'Actualizar'}</span>
          </button>

          {/* Botón de Configuración del Dashboard */}
          <button
            onClick={onOpenSettingsModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-900/20 transition-all cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Configuración</span>
          </button>
        </div>

      </div>
    </header>
  );
};
