import { Account, MetricPoint, RecentContent, GlobalOverview } from '@/types';

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'yt-1',
    platform: 'youtube',
    name: 'Carlos Tech & Gaming',
    handle: '@carlostechgaming',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    channelId: 'UC_x1y2z3a4b5c6d7e8f901',
    status: 'demo',
    color: '#FF0000',
    badge: 'Canal Principal',
    subscribers: 84320,
    subscribersChange24h: 145,
    totalViews: 4892010,
    views24h: 38450,
    totalVideos: 142,
    avgEngagementRate: 6.8,
    lastSyncedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'yt-2',
    platform: 'youtube',
    name: 'Carlos Clips & Shorts',
    handle: '@carlosclips',
    avatarUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80',
    channelId: 'UC_z9y8x7w6v5u4t3s2r102',
    status: 'demo',
    color: '#E62117',
    badge: 'Shorts & Clips',
    subscribers: 142500,
    subscribersChange24h: 420,
    totalViews: 12450800,
    views24h: 92300,
    totalVideos: 380,
    avgEngagementRate: 8.4,
    lastSyncedAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
  },
  {
    id: 'tt-1',
    platform: 'tiktok',
    name: 'Carlos Oficial',
    handle: '@carlos.oficial',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    channelId: 'tt_carlos_main_9921',
    status: 'demo',
    color: '#00F2FE',
    badge: 'TikTok Principal',
    subscribers: 235800,
    subscribersChange24h: 780,
    totalViews: 28400000,
    views24h: 145200,
    totalVideos: 210,
    avgEngagementRate: 9.7,
    lastSyncedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: 'tt-2',
    platform: 'tiktok',
    name: 'Carlos Tech Hacks',
    handle: '@carlostechhacks',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    channelId: 'tt_carlos_hacks_4410',
    status: 'demo',
    color: '#FE2C55',
    badge: 'TikTok Secundario',
    subscribers: 68400,
    subscribersChange24h: 215,
    totalViews: 5930000,
    views24h: 41800,
    totalVideos: 94,
    avgEngagementRate: 7.2,
    lastSyncedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
];

export const MOCK_OVERVIEW: GlobalOverview = {
  totalAudience: 531020,
  audienceGrowth24h: 1560,
  totalViews24h: 317750,
  viewsGrowthPercent: 14.8,
  avgEngagement: 8.0,
  engagementTrend: 1.2,
  topVideo24h: {
    title: '5 Trucos de Windows que Nadie Conoce en 2026',
    views: 89400,
    accountName: 'Carlos Oficial',
    platform: 'tiktok',
  },
};

// Generar 14 días de historial
export const generateMockHistory = (): MetricPoint[] => {
  const points: MetricPoint[] = [];
  const now = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });

    // Base con variación aleatoria realista y tendencia ascendente
    const baseVariance = Math.sin(i * 0.7) * 4000;
    const views_yt1 = Math.round(32000 + (13 - i) * 600 + baseVariance * 0.8);
    const views_yt2 = Math.round(82000 + (13 - i) * 1100 + baseVariance * 1.8);
    const views_tt1 = Math.round(125000 + (13 - i) * 1800 + baseVariance * 2.5);
    const views_tt2 = Math.round(35000 + (13 - i) * 450 + baseVariance * 0.7);

    const total_views = views_yt1 + views_yt2 + views_tt1 + views_tt2;

    const subs_yt1 = Math.round(110 + (13 - i) * 3 + Math.random() * 30);
    const subs_yt2 = Math.round(350 + (13 - i) * 8 + Math.random() * 60);
    const subs_tt1 = Math.round(650 + (13 - i) * 12 + Math.random() * 120);
    const subs_tt2 = Math.round(170 + (13 - i) * 4 + Math.random() * 40);

    const total_subs_change = subs_yt1 + subs_yt2 + subs_tt1 + subs_tt2;

    points.push({
      date: dateStr,
      views_yt1,
      views_yt2,
      views_tt1,
      views_tt2,
      total_views,
      subs_yt1,
      subs_yt2,
      subs_tt1,
      subs_tt2,
      total_subs_change,
    });
  }

  return points;
};

export const MOCK_RECENT_CONTENT: RecentContent[] = [
  {
    id: 'cnt-1',
    accountId: 'tt-1',
    accountName: 'Carlos Oficial',
    platform: 'tiktok',
    title: '5 Trucos de Windows que Nadie Conoce en 2026 💻🔥',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=80',
    url: 'https://tiktok.com',
    publishedAt: 'Hace 6 horas',
    views: 89400,
    likes: 12400,
    comments: 842,
    shares: 2150,
    duration: '00:54',
    type: 'tiktok',
    performanceTag: 'viral',
  },
  {
    id: 'cnt-2',
    accountId: 'yt-2',
    accountName: 'Carlos Clips & Shorts',
    platform: 'youtube',
    title: 'La función SECRETA que cambiara tu setup de PC #shorts',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    url: 'https://youtube.com',
    publishedAt: 'Hace 14 horas',
    views: 45800,
    likes: 5820,
    comments: 312,
    shares: 490,
    duration: '00:48',
    type: 'short',
    performanceTag: 'alto',
  },
  {
    id: 'cnt-3',
    accountId: 'yt-1',
    accountName: 'Carlos Tech & Gaming',
    platform: 'youtube',
    title: 'Armé la PC definitiva para 2026 (¿Vale la pena todavía?)',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80',
    url: 'https://youtube.com',
    publishedAt: 'Ayer a las 18:00',
    views: 24300,
    likes: 3100,
    comments: 420,
    shares: 185,
    duration: '18:42',
    type: 'video',
    performanceTag: 'alto',
  },
  {
    id: 'cnt-4',
    accountId: 'tt-2',
    accountName: 'Carlos Tech Hacks',
    platform: 'tiktok',
    title: 'Cómo limpiar tu memoria RAM sin reiniciar #tech #tips',
    thumbnailUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=80',
    url: 'https://tiktok.com',
    publishedAt: 'Hace 1 día',
    views: 31200,
    likes: 3950,
    comments: 184,
    shares: 720,
    duration: '00:39',
    type: 'tiktok',
    performanceTag: 'promedio',
  },
  {
    id: 'cnt-5',
    accountId: 'yt-2',
    accountName: 'Carlos Clips & Shorts',
    platform: 'youtube',
    title: 'Cuando el bug se convierte en una feature jajaja #gaming',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    url: 'https://youtube.com',
    publishedAt: 'Hace 2 días',
    views: 68100,
    likes: 7420,
    comments: 290,
    shares: 880,
    duration: '00:29',
    type: 'short',
    performanceTag: 'viral',
  },
  {
    id: 'cnt-6',
    accountId: 'yt-1',
    accountName: 'Carlos Tech & Gaming',
    platform: 'youtube',
    title: 'Review a fondo: Los mejores micrófonos USB por menos de $100',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=80',
    url: 'https://youtube.com',
    publishedAt: 'Hace 4 días',
    views: 18900,
    likes: 1850,
    comments: 245,
    shares: 94,
    duration: '14:15',
    type: 'video',
    performanceTag: 'promedio',
  },
];
