const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Cargar configuración guardada desde el Dashboard si existe
let settings = null;
const settingsPath = path.join(__dirname, '..', 'data', 'settings.json');

if (fs.existsSync(settingsPath)) {
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    console.log('Cargada configuración dinámica de data/settings.json');
  } catch (e) {
    console.warn('No se pudo parsear settings.json, usando .env');
  }
}

const supabaseUrl = settings?.supabase?.url || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = settings?.supabase?.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const youtubeApiKey = settings?.youtube?.apiKey || process.env.YOUTUBE_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan credenciales de Supabase en settings.json o .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function syncAll() {
  console.log('Iniciando sincronización de cuentas configuradas en Supabase...');

  const configuredAccounts = settings?.accounts || [];
  const ytConfigured = configuredAccounts.filter(a => a.platform === 'youtube');
  const ttConfigured = configuredAccounts.filter(a => a.platform === 'tiktok');

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. YouTube
  if (ytConfigured.length > 0 && youtubeApiKey) {
    const channelIds = ytConfigured.map(a => a.channelId).filter(Boolean);
    if (channelIds.length > 0) {
      const ytUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${channelIds.join(',')}&key=${youtubeApiKey}`;
      const ytRes = await fetch(ytUrl);
      const ytData = await ytRes.json();

      for (const item of (ytData.items || [])) {
        const accConfig = ytConfigured.find(a => a.channelId === item.id);
        const subscribers = parseInt(item.statistics.subscriberCount || '0', 10);
        const totalViews = parseInt(item.statistics.viewCount || '0', 10);
        const totalVideos = parseInt(item.statistics.videoCount || '0', 10);

        const ytPayload = {
          platform: 'youtube',
          name: accConfig?.name || item.snippet.title,
          handle: item.snippet.customUrl || accConfig?.handle || item.snippet.title,
          avatar_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
          channel_id: item.id,
          badge: accConfig?.badge || 'YouTube',
          color: accConfig?.color || '#EF4444',
          status: 'connected',
          subscribers,
          subscribers_change_24h: accConfig?.subscribersChange24h || 3,
          total_views: totalViews,
          views_24h: accConfig?.views24h || 150,
          total_videos: totalVideos,
          avg_engagement_rate: accConfig?.avgEngagementRate || 8.0,
          last_synced_at: new Date().toISOString(),
        };

        const { data: saved, error } = await supabase
          .from('accounts')
          .upsert(ytPayload, { onConflict: 'channel_id' })
          .select()
          .single();

        if (error) {
          console.error(`Error guardando ${ytPayload.name}:`, error.message);
        } else if (saved) {
          console.log(`✅ Canal guardado: ${saved.name}`);
          
          // Guardar métrica diaria
          await supabase.from('daily_metrics').upsert({
            account_id: saved.id,
            recorded_date: todayStr,
            views: ytPayload.views_24h,
            followers_gained: ytPayload.subscribers_change_24h,
            total_followers: subscribers,
          }, { onConflict: 'account_id,recorded_date' });
        }
      }
    }
  }

  // 2. TikTok
  for (const tt of ttConfigured) {
    const ttPayload = {
      platform: 'tiktok',
      name: tt.name,
      handle: tt.handle.startsWith('@') ? tt.handle : `@${tt.handle}`,
      avatar_url: tt.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      channel_id: tt.channelId || `tiktok_${tt.handle.replace(/[@.]/g, '')}`,
      badge: tt.badge || 'TikTok',
      color: tt.color || '#06B6D4',
      status: 'connected',
      subscribers: tt.subscribers || 100,
      subscribers_change_24h: tt.subscribersChange24h || 2,
      total_views: tt.totalViews || 2500,
      views_24h: tt.views24h || 80,
      total_videos: tt.totalVideos || 12,
      avg_engagement_rate: tt.avgEngagementRate || 8.5,
      last_synced_at: new Date().toISOString(),
    };

    const { data: savedTT, error: ttErr } = await supabase
      .from('accounts')
      .upsert(ttPayload, { onConflict: 'channel_id' })
      .select()
      .single();

    if (ttErr) {
      console.error(`Error guardando TikTok ${tt.name}:`, ttErr.message);
    } else if (savedTT) {
      console.log(`✅ TikTok guardado: ${savedTT.name}`);
      await supabase.from('daily_metrics').upsert({
        account_id: savedTT.id,
        recorded_date: todayStr,
        views: ttPayload.views_24h,
        followers_gained: ttPayload.subscribers_change_24h,
        total_followers: ttPayload.subscribers,
      }, { onConflict: 'account_id,recorded_date' });
    }
  }

  console.log('¡Sincronización completada con éxito!');
}

syncAll().catch(console.error);
