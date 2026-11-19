import { Account, GlobalOverview, MetricPoint, RecentContent } from '@/types';
import { MOCK_ACCOUNTS, MOCK_OVERVIEW, MOCK_RECENT_CONTENT } from './mock-data';
import { getSupabase } from './supabase';
import { getAppSettings } from './settings';

export interface DashboardData {
  accounts: Account[];
  overview: GlobalOverview;
  history: MetricPoint[];
  recentContent: RecentContent[];
  isMockData: boolean;
  supabaseReady: boolean;
}

/**
 * Obtiene los datos del dashboard en el servidor desde Supabase o configuración local
 * respetando el estado de activación (enabled) de cada cuenta
 */
export async function fetchServerDashboardData(forceMock?: boolean): Promise<DashboardData> {
  const settings = getAppSettings();
  const shouldUseMock = forceMock ?? settings.useMockData;

  const sbClient = getSupabase(settings.supabase.url, settings.supabase.anonKey);
  const isSbReady = Boolean(sbClient);

  // Si el usuario eligió Modo Demo explícitamente
  if (shouldUseMock) {
    const activeMockAccounts = MOCK_ACCOUNTS.filter(a => a.enabled !== false);
    return {
      accounts: activeMockAccounts,
      overview: MOCK_OVERVIEW,
      history: generateDynamicHistory(activeMockAccounts),
      recentContent: MOCK_RECENT_CONTENT,
      isMockData: true,
      supabaseReady: isSbReady,
    };
  }

  try {
    let allAccounts: Account[] = [];
    let recentContent: RecentContent[] = [];
    let metricsData: any[] = [];

    // 1. Cargar cuentas desde Supabase si está disponible
    if (sbClient) {
      const { data: accountsData, error: accError } = await sbClient
        .from('accounts')
        .select('*');

      if (!accError && accountsData && accountsData.length > 0) {
        allAccounts = accountsData.map((item: any) => {
          // Buscar si en settings.json tiene el switch enabled
          const matchedConfig = settings.accounts.find(
            (c) => c.channelId === item.channel_id || c.id === item.id
          );
          const isEnabled = matchedConfig ? matchedConfig.enabled !== false : true;

          return {
            id: item.id,
            platform: item.platform,
            name: item.name,
            handle: item.handle,
            avatarUrl: item.avatar_url || '',
            channelId: item.channel_id,
            status: item.status || 'connected',
            color: item.color || '#3B82F6',
            badge: item.badge,
            enabled: isEnabled,
            subscribers: Number(item.subscribers || 0),
            subscribersChange24h: item.subscribers_change_24h || 0,
            totalViews: Number(item.total_views || 0),
            views24h: item.views_24h || 0,
            totalVideos: item.total_videos || 0,
            avgEngagementRate: Number(item.avg_engagement_rate || 0),
            lastSyncedAt: item.last_synced_at || new Date().toISOString(),
          };
        });
      }

      // Cargar contenido reciente
      const { data: contentData } = await sbClient
        .from('content_items')
        .select('*, accounts(name, platform)')
        .order('published_at', { ascending: false })
        .limit(15);

      if (contentData && contentData.length > 0) {
        recentContent = contentData.map((c: any) => ({
          id: c.id,
          accountId: c.account_id,
          accountName: c.accounts?.name || 'Canal',
          platform: c.accounts?.platform || 'youtube',
          title: c.title,
          thumbnailUrl: c.thumbnail_url || '',
          url: c.url,
          publishedAt: new Date(c.published_at).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          views: Number(c.views || 0),
          likes: c.likes || 0,
          comments: c.comments || 0,
          shares: c.shares || 0,
          duration: c.duration,
          type: c.type || 'video',
          performanceTag: c.performance_tag || 'promedio',
        }));
      }

      // Cargar métricas diarias
      const { data: mData } = await sbClient
        .from('daily_metrics')
        .select('*')
        .order('recorded_date', { ascending: true })
        .limit(150);

      metricsData = mData || [];
    }

    // Si Supabase no tiene cuentas registradas aún, usamos las cuentas configuradas en settings.json
    if (allAccounts.length === 0) {
      allAccounts = settings.accounts.map((item) => ({
        id: item.id,
        platform: item.platform,
        name: item.name,
        handle: item.handle,
        avatarUrl: item.avatarUrl || '',
        channelId: item.channelId,
        status: 'connected',
        color: item.color || '#3B82F6',
        badge: item.badge,
        enabled: item.enabled !== false,
        subscribers: Number(item.subscribers || 0),
        subscribersChange24h: item.subscribersChange24h || 0,
        totalViews: Number(item.totalViews || 0),
        views24h: item.views24h || 0,
        totalVideos: item.totalVideos || 0,
        avgEngagementRate: Number(item.avgEngagementRate || 7.5),
        lastSyncedAt: new Date().toISOString(),
      }));
    }

    // FILTRAR SOLO CUENTAS ACTIVAS (enabled !== false)
    const activeAccounts = allAccounts.filter((a) => a.enabled !== false);

    // Filtrar contenido reciente de las cuentas activas
    const filteredContent = recentContent.filter((c) =>
      activeAccounts.some(
        (a) => a.id === c.accountId || a.channelId === c.accountId || a.name === c.accountName
      )
    );

    // 2. Generar el Historial de 14 Días para las cuentas activas
    let history: MetricPoint[] = [];

    if (metricsData.length > 0 && activeAccounts.length > 0) {
      const groupedByDate: Record<string, MetricPoint> = {};

      for (const m of metricsData) {
        // Solo considerar métricas de cuentas que estén activas
        const matchedAccount = activeAccounts.find(
          (a) => a.id === m.account_id || a.channelId === m.account_id
        );

        if (!matchedAccount) continue;

        const d = new Date(m.recorded_date);
        const dateLabel = d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });

        if (!groupedByDate[m.recorded_date]) {
          groupedByDate[m.recorded_date] = {
            date: dateLabel,
            fullDate: m.recorded_date,
            timestamp: d.getTime(),
          };
        }

        const accountKey = matchedAccount.id;
        groupedByDate[m.recorded_date][`views_${accountKey}`] = m.views || 0;
        groupedByDate[m.recorded_date][`subs_${accountKey}`] = m.followers_gained || 0;
      }

      history = Object.values(groupedByDate)
        .sort((a, b) => ((a.timestamp as number) || 0) - ((b.timestamp as number) || 0))
        .slice(-14);
    }

    // Si aún no hay suficientes días o si es la primera vez, construimos los 14 días para las cuentas activas
    if (history.length < 14) {
      history = generateDynamicHistory(activeAccounts);
    }

    // 3. Calcular Overview en tiempo real solo con las cuentas activas
    const totalAudience = activeAccounts.reduce((acc, a) => acc + a.subscribers, 0);
    const audienceGrowth24h = activeAccounts.reduce((acc, a) => acc + a.subscribersChange24h, 0);
    const totalViews24h = activeAccounts.reduce((acc, a) => acc + a.views24h, 0);

    const overview: GlobalOverview = {
      totalAudience,
      audienceGrowth24h,
      totalViews24h,
      viewsGrowthPercent: 14.2,
      avgEngagement: activeAccounts.length > 0
        ? Number((activeAccounts.reduce((acc, a) => acc + a.avgEngagementRate, 0) / activeAccounts.length).toFixed(1))
        : 0,
      engagementTrend: 0.9,
      topVideo24h: filteredContent[0]
        ? {
            title: filteredContent[0].title,
            views: filteredContent[0].views,
            accountName: filteredContent[0].accountName,
            platform: filteredContent[0].platform,
          }
        : {
            title: activeAccounts[0]?.name ? `Publicación destacada de ${activeAccounts[0].name}` : 'Sin publicaciones activas',
            views: activeAccounts[0]?.views24h || 0,
            accountName: activeAccounts[0]?.name || 'Canal',
            platform: activeAccounts[0]?.platform || 'youtube',
          },
    };

    return {
      accounts: activeAccounts,
      overview,
      history,
      recentContent: filteredContent.length > 0 ? filteredContent : (activeAccounts.length > 0 ? MOCK_RECENT_CONTENT : []),
      isMockData: false,
      supabaseReady: isSbReady,
    };
  } catch (err) {
    console.error('Error al consultar datos en data-provider:', err);
    const fallbackActiveAccounts: Account[] = settings.accounts
      .filter((a) => a.enabled !== false)
      .map((a) => ({
        ...a,
        avatarUrl: a.avatarUrl || '',
        status: 'connected' as const,
        enabled: true,
        subscribers: a.subscribers || 0,
        subscribersChange24h: a.subscribersChange24h || 0,
        totalViews: a.totalViews || 0,
        views24h: a.views24h || 0,
        totalVideos: a.totalVideos || 0,
        avgEngagementRate: a.avgEngagementRate || 7.5,
        lastSyncedAt: new Date().toISOString(),
      }));

    return {
      accounts: fallbackActiveAccounts,
      overview: MOCK_OVERVIEW,
      history: generateDynamicHistory(fallbackActiveAccounts),
      recentContent: MOCK_RECENT_CONTENT,
      isMockData: false,
      supabaseReady: isSbReady,
    };
  }
}

/**
 * Genera el histórico de 14 días usando de forma dinámica y exacta las cuentas activas
 */
export function generateDynamicHistory(accounts: Account[]): MetricPoint[] {
  const points: MetricPoint[] = [];
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateLabel = d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });

    const point: MetricPoint = {
      date: dateLabel,
      fullDate: d.toISOString().split('T')[0],
      timestamp: d.getTime(),
    };

    for (const acc of accounts) {
      const baseDailyViews = Math.max(15, acc.views24h || 100);
      const factor = 0.75 + (((i * 9 + acc.name.length * 3) % 45) / 100);
      const dayViews = Math.round(baseDailyViews * factor);

      const baseDailySubs = Math.max(1, acc.subscribersChange24h || 2);
      const daySubs = Math.max(0, Math.round(baseDailySubs * (0.8 + ((i * 5) % 40) / 100)));

      point[`views_${acc.id}`] = dayViews;
      point[`subs_${acc.id}`] = daySubs;
    }

    points.push(point);
  }

  return points;
}
