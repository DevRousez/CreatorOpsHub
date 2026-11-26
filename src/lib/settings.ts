import fs from 'fs';
import path from 'path';
import { ConfigAccount, AppSettings, DEFAULT_ACCOUNTS } from '@/types/settings';

export type { ConfigAccount, AppSettings };
export { DEFAULT_ACCOUNTS };

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'settings.json');
const TMP_SETTINGS_FILE_PATH = path.join('/tmp', 'creatorops_settings.json');

// Caché en memoria para entornos serverless (Vercel / Lambda)
let inMemorySettings: AppSettings | null = null;

function normalizeSettings(parsed: any): AppSettings {
  return {
    useMockData: parsed.useMockData ?? false,
    supabase: {
      url: parsed.supabase?.url || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      anonKey: parsed.supabase?.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    },
    youtube: {
      apiKey: parsed.youtube?.apiKey || process.env.YOUTUBE_API_KEY || '',
    },
    tiktok: {
      monitoredHandles: parsed.tiktok?.monitoredHandles || process.env.TIKTOK_MONITORED_HANDLES || 'mundoanitoonia,pequemundotoon5',
      clientKey: parsed.tiktok?.clientKey || process.env.TIKTOK_CLIENT_KEY || '',
      clientSecret: parsed.tiktok?.clientSecret || process.env.TIKTOK_CLIENT_SECRET || '',
      accessToken: parsed.tiktok?.accessToken || '',
    },
    accounts: Array.isArray(parsed.accounts) && parsed.accounts.length > 0
      ? parsed.accounts.map((acc: any) => ({
          ...acc,
          enabled: acc.enabled !== false,
        }))
      : DEFAULT_ACCOUNTS,
  };
}

/**
 * Carga la configuración actual desde memoria, /tmp, data/settings.json o .env.local
 */
export function getAppSettings(): AppSettings {
  if (inMemorySettings) {
    return inMemorySettings;
  }

  // 1. Probar en /tmp (persistencia en serverless durante vida de la función)
  try {
    if (fs.existsSync(TMP_SETTINGS_FILE_PATH)) {
      const raw = fs.readFileSync(TMP_SETTINGS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed) {
        inMemorySettings = normalizeSettings(parsed);
        return inMemorySettings;
      }
    }
  } catch {
    // Continuar al archivo local
  }

  // 2. Probar en data/settings.json
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const raw = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed) {
        inMemorySettings = normalizeSettings(parsed);
        return inMemorySettings;
      }
    }
  } catch (error) {
    console.error('Error al leer settings.json:', error);
  }

  // 3. Fallback con variables de entorno
  const envUseMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
  const defaultSettings: AppSettings = {
    useMockData: envUseMock,
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ljybqhmdycngepwlzsed.supabase.co',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_usmNFzrYinLKfyh9mnwN6Q_I8uw9MXG',
    },
    youtube: {
      apiKey: process.env.YOUTUBE_API_KEY || 'AIzaSyCwICBOXCuykW6RKHnXwbjknye-25WyEj0',
    },
    tiktok: {
      monitoredHandles: process.env.TIKTOK_MONITORED_HANDLES || 'mundoanitoonia,pequemundotoon5',
      clientKey: process.env.TIKTOK_CLIENT_KEY || 'awo7pvamgk3831x0',
      clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
      accessToken: '',
    },
    accounts: DEFAULT_ACCOUNTS,
  };

  inMemorySettings = defaultSettings;
  return defaultSettings;
}

/**
 * Guarda la configuración tanto en disco como en memoria y /tmp (tolerante a entornos serverless como Vercel)
 */
export function saveAppSettings(newSettings: Partial<AppSettings>): AppSettings {
  const current = getAppSettings();
  const updated: AppSettings = {
    useMockData: newSettings.useMockData !== undefined ? newSettings.useMockData : current.useMockData,
    supabase: {
      url: newSettings.supabase?.url !== undefined ? newSettings.supabase.url.trim() : current.supabase.url,
      anonKey: newSettings.supabase?.anonKey !== undefined ? newSettings.supabase.anonKey.trim() : current.supabase.anonKey,
    },
    youtube: {
      apiKey: newSettings.youtube?.apiKey !== undefined ? newSettings.youtube.apiKey.trim() : current.youtube.apiKey,
    },
    tiktok: {
      monitoredHandles: newSettings.tiktok?.monitoredHandles !== undefined ? newSettings.tiktok.monitoredHandles.trim() : current.tiktok.monitoredHandles,
      clientKey: newSettings.tiktok?.clientKey !== undefined ? newSettings.tiktok.clientKey.trim() : current.tiktok.clientKey,
      clientSecret: newSettings.tiktok?.clientSecret !== undefined ? newSettings.tiktok.clientSecret.trim() : current.tiktok.clientSecret,
      accessToken: newSettings.tiktok?.accessToken !== undefined ? newSettings.tiktok.accessToken.trim() : current.tiktok.accessToken,
    },
    accounts: newSettings.accounts !== undefined
      ? newSettings.accounts.map((acc) => ({
          ...acc,
          enabled: acc.enabled !== false,
        }))
      : current.accounts,
  };

  // 1. Guardar en memoria de inmediato
  inMemorySettings = updated;

  // 2. Intentar guardar en data/settings.json (entorno local con permisos de escritura)
  let savedToDisk = false;
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    savedToDisk = true;
  } catch (fsError) {
    // En Vercel Serverless el sistema de archivos de la app es de solo lectura (EROFS).
    // Guardamos en /tmp donde las funciones serverless sí tienen permiso de escritura.
    try {
      const tmpDir = path.dirname(TMP_SETTINGS_FILE_PATH);
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      fs.writeFileSync(TMP_SETTINGS_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
      savedToDisk = true;
    } catch (tmpError) {
      console.warn('Aviso: no se pudo escribir en /tmp:', tmpError);
    }
  }

  // 3. Sincronizar con .env.local si el entorno lo permite
  try {
    const ENV_FILE_PATH = path.join(process.cwd(), '.env.local');
    let envContent = '';
    if (fs.existsSync(ENV_FILE_PATH)) {
      envContent = fs.readFileSync(ENV_FILE_PATH, 'utf-8');
    }

    const setEnvVar = (content: string, key: string, value: string): string => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(content)) {
        return content.replace(regex, `${key}=${value}`);
      }
      return `${content}\n${key}=${value}`;
    };

    envContent = setEnvVar(envContent, 'NEXT_PUBLIC_USE_MOCK_DATA', String(updated.useMockData));
    if (updated.supabase.url) {
      envContent = setEnvVar(envContent, 'NEXT_PUBLIC_SUPABASE_URL', updated.supabase.url);
    }
    if (updated.supabase.anonKey) {
      envContent = setEnvVar(envContent, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', updated.supabase.anonKey);
    }
    if (updated.youtube.apiKey) {
      envContent = setEnvVar(envContent, 'YOUTUBE_API_KEY', updated.youtube.apiKey);
    }
    if (updated.tiktok.monitoredHandles) {
      envContent = setEnvVar(envContent, 'TIKTOK_MONITORED_HANDLES', updated.tiktok.monitoredHandles);
    }
    if (updated.tiktok.clientKey) {
      envContent = setEnvVar(envContent, 'TIKTOK_CLIENT_KEY', updated.tiktok.clientKey);
    }
    if (updated.tiktok.clientSecret) {
      envContent = setEnvVar(envContent, 'TIKTOK_CLIENT_SECRET', updated.tiktok.clientSecret);
    }

    fs.writeFileSync(ENV_FILE_PATH, envContent.trim() + '\n', 'utf-8');
  } catch {
    // En entornos de solo lectura como Vercel esto se ignora limpiamente
  }

  return updated;
}
