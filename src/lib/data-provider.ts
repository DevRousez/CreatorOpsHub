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
      accounts: MOCK_ACCOUNTS,
      overview: MOCK_OVERVIEW,
      history: generateMockHistory(),
      recentContent: MOCK_RECENT_CONTENT,
      isMockData: true,
      supabaseReady: false,
    };
  }
}
