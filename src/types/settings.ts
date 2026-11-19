export interface ConfigAccount {
  id: string;
  platform: 'youtube' | 'tiktok';
  name: string;
  handle: string;
  channelId: string;
  badge?: string;
  color: string;
  avatarUrl?: string;
  enabled?: boolean; // Permite activar o desactivar la cuenta sin borrarla
  accessToken?: string; // Token OAuth individual para sincronización multicuenta
  subscribers?: number;
  subscribersChange24h?: number;
  totalViews?: number;
  views24h?: number;
  totalVideos?: number;
  avgEngagementRate?: number;
}

export interface AppSettings {
  useMockData: boolean;
  supabase: {
    url: string;
    anonKey: string;
  };
  youtube: {
    apiKey: string;
  };
  tiktok: {
    monitoredHandles: string;
    clientKey?: string;
    clientSecret?: string;
    accessToken?: string;
  };
  accounts: ConfigAccount[];
}

export const DEFAULT_ACCOUNTS: ConfigAccount[] = [
  {
    id: 'yt-1',
    platform: 'youtube',
    name: 'MundoAniToonIa',
    handle: '@mundoanitoonia',
    channelId: 'UCI4ufWjJ_w-TqW_GyuRLkgg',
    badge: 'Misterio & Animación',
    color: '#EF4444',
    avatarUrl: 'https://yt3.ggpht.com/oWntvoBt290MGwA2ah7IRZSN3DDgDQz0tJPze9quShfLF6vsKj1bbujgP9dQtC15sq-WirfEOA=s88-c-k-c0x00ffffff-no-rj',
    enabled: true,
    subscribers: 1450,
    subscribersChange24h: 3,
    totalViews: 45200,
    views24h: 320,
    totalVideos: 32,
    avgEngagementRate: 8.5,
  },
  {
    id: 'yt-2',
    platform: 'youtube',
    name: 'PequeMundoToon',
    handle: '@pequemundotoon5',
    channelId: 'UCW42i49nrWseSe8qQKcuuPg',
    badge: 'Infantil & Educativo',
    color: '#F97316',
    avatarUrl: 'https://yt3.ggpht.com/LPFX4NuH0D0reurrqXtZPkyk6p4Gvxy0DvYqR2RUgf7ZEqrBrHpO3ID-FqHaVPbp_dopcpFpsA=s88-c-k-c0x00ffffff-no-rj',
    enabled: true,
    subscribers: 280,
    subscribersChange24h: 1,
    totalViews: 9800,
    views24h: 15,
    totalVideos: 18,
    avgEngagementRate: 7.2,
  },
  {
    id: 'tt-1',
    platform: 'tiktok',
    name: 'MundoAniToonIa',
    handle: '@mundoanitoonia',
    channelId: 'tiktok_mundoanitoonia',
    badge: 'TikTok Misterio',
    color: '#06B6D4',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    enabled: true,
    subscribers: 120,
    subscribersChange24h: 5,
    totalViews: 4500,
    views24h: 210,
    totalVideos: 28,
    avgEngagementRate: 9.2,
  },
  {
    id: 'tt-2',
    platform: 'tiktok',
    name: 'PequeMundoToon',
    handle: '@pequemundotoon5',
    channelId: 'tiktok_pequemundotoon5',
    badge: 'TikTok Infantil',
    color: '#EC4899',
    avatarUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=80',
    enabled: true,
    subscribers: 45,
    subscribersChange24h: 2,
    totalViews: 1200,
    views24h: 65,
    totalVideos: 14,
    avgEngagementRate: 7.8,
  },
];
