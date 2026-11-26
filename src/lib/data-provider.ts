import { Account, GlobalOverview, MetricPoint, RecentContent } from '@/types';
import { MOCK_ACCOUNTS, MOCK_OVERVIEW, generateMockHistory, MOCK_RECENT_CONTENT } from './mock-data';

export interface DashboardData {
  accounts: Account[];
  overview: GlobalOverview;
  history: MetricPoint[];
  recentContent: RecentContent[];
  isMockData: boolean;
  supabaseReady: boolean;
}

/**
 * Cliente frontend para obtener los datos del dashboard desde el backend
 */
export async function getDashboardData(forceMock?: boolean): Promise<DashboardData> {
  try {
    const url = forceMock !== undefined ? `/api/dashboard?mock=${forceMock}` : '/api/dashboard';
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const data: DashboardData = await res.json();
    return data;
  } catch (err) {
    console.warn('Fallo al consultar /api/dashboard, usando datos de respaldo:', err);
    return {
      accounts: forceMock ? MOCK_ACCOUNTS : [],
      overview: forceMock ? MOCK_OVERVIEW : {
        totalAudience: 0,
        audienceGrowth24h: 0,
        totalViews24h: 0,
        viewsGrowthPercent: 0,
        avgEngagement: 0,
        engagementTrend: 0,
        topVideo24h: {
          title: 'Sin datos disponibles',
          views: 0,
          accountName: '',
          platform: 'youtube',
        },
      },
      history: forceMock ? generateMockHistory() : [],
      recentContent: forceMock ? MOCK_RECENT_CONTENT : [],
      isMockData: Boolean(forceMock),
      supabaseReady: false,
    };
  }
}
