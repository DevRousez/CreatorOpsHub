export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'twitch' | 'x';

export type AccountStatus = 'connected' | 'demo' | 'error' | 'syncing';

export interface Account {
  id: string;
  platform: Platform;
  name: string;
  handle: string;
  avatarUrl: string;
  channelId: string;
  status: AccountStatus;
  color: string;
  badge?: string;
  enabled?: boolean;
  subscribers: number;
  subscribersChange24h: number;
  totalViews: number;
  views24h: number;
  totalVideos: number;
  avgEngagementRate: number; // porcentaje (ej. 5.8)
  lastSyncedAt: string;
}

export interface MetricPoint {
  date: string;
  timestamp?: number;
  [key: string]: string | number | undefined;
  // Dynamic keys for account metrics:
  // e.g. views_yt1, views_yt2, views_tt1, views_tt2, total_views
}

export interface RecentContent {
  id: string;
  accountId: string;
  accountName: string;
  platform: Platform;
  title: string;
  thumbnailUrl: string;
  url: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration?: string; // ej "00:58" para shorts o "14:20"
  type: 'video' | 'short' | 'tiktok';
  performanceTag: 'viral' | 'alto' | 'promedio' | 'nuevo';
}

export interface GlobalOverview {
  totalAudience: number;
  audienceGrowth24h: number;
  totalViews24h: number;
  viewsGrowthPercent: number;
  avgEngagement: number;
  engagementTrend: number;
  topVideo24h: {
    title: string;
    views: number;
    accountName: string;
    platform: Platform;
  };
}
