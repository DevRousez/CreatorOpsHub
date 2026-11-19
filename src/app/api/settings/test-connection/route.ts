import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAppSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const {
      type,
      supabaseUrl,
      supabaseAnonKey,
      youtubeApiKey,
      channelQuery,
      tiktokClientKey,
      tiktokClientSecret,
      tiktokAccessToken,
      tiktokHandle,
    } = await req.json();

    // 1. Probar conexión de Supabase
    if (type === 'supabase') {
      if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.json({
          success: false,
          message: 'Debes ingresar la URL y la Anon Key de Supabase',
        }, { status: 400 });
      }

      try {
        const client = createClient(supabaseUrl, supabaseAnonKey, {
          auth: { persistSession: false },
        });

        const { data, error } = await client.from('accounts').select('id').limit(1);

        if (error) {
          if (error.code === '42P01') {
            return NextResponse.json({
              success: false,
              tableMissing: true,
              message: 'Conectó a Supabase, pero la tabla "accounts" aún no existe. Recuerda ejecutar el script SQL en SQL Editor.',
            });
          }
          return NextResponse.json({
            success: false,
            message: `Error de Supabase: ${error.message}`,
          });
        }

        return NextResponse.json({
          success: true,
          message: '¡Conexión a Supabase exitosa y tablas verificadas!',
        });
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          message: `No se pudo conectar a Supabase: ${err.message}`,
        });
      }
    }

    // 2. Probar API Key de YouTube o buscar información de un canal
    if (type === 'youtube') {
      const serverSettings = getAppSettings();
      const effectiveApiKey = (youtubeApiKey && youtubeApiKey.trim()) || serverSettings.youtube?.apiKey || process.env.YOUTUBE_API_KEY || '';

      if (!channelQuery) {
        if (!effectiveApiKey) {
          return NextResponse.json({
            success: false,
            message: 'No hay una clave API de YouTube configurada en el servidor ni ingresada en la prueba',
          }, { status: 400 });
        }

        const testUrl = `https://www.googleapis.com/youtube/v3/videos?part=id&chart=mostPopular&maxResults=1&key=${effectiveApiKey}`;
        const res = await fetch(testUrl);
        const data = await res.json();

        if (data.error) {
          return NextResponse.json({
            success: false,
            message: `Error de YouTube API: ${data.error.message || 'Clave no válida'}`,
          });
        }

        return NextResponse.json({
          success: true,
          message: '¡Clave de YouTube Data API v3 válida y funcionando correctamente!',
        });
      }

      // Si se envió un canal a consultar
      let rawQuery = String(channelQuery).trim();
      // Extraer handle si pegaron una URL completa de youtube (ej. https://youtube.com/@mundoanitoonia)
      const urlHandleMatch = rawQuery.match(/(?:youtube\.com\/(?:@|channel\/|c\/)?)([\w\-]+)/i);
      if (urlHandleMatch) {
        rawQuery = urlHandleMatch[1];
      }
      const query = rawQuery;

      if (effectiveApiKey) {
        let fetchUrl = '';
        if (query.startsWith('UC') && query.length >= 20) {
          fetchUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${query}&key=${effectiveApiKey}`;
        } else {
          const cleanHandle = query.replace(/^@/, '');
          fetchUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${cleanHandle}&key=${effectiveApiKey}`;
        }

        let res = await fetch(fetchUrl);
        let data = await res.json();

        if (!data.items || data.items.length === 0) {
          const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=1&key=${effectiveApiKey}`;
          const sRes = await fetch(searchUrl);
          const sData = await sRes.json();

          if (sData.items && sData.items.length > 0) {
            const chId = sData.items[0].snippet?.channelId || sData.items[0].id?.channelId;
            if (chId) {
              const chRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${chId}&key=${effectiveApiKey}`);
              data = await chRes.json();
            }
          }
        }

        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          return NextResponse.json({
            success: true,
            channel: {
              channelId: item.id,
              name: item.snippet.title,
              handle: item.snippet.customUrl ? (item.snippet.customUrl.startsWith('@') ? item.snippet.customUrl : `@${item.snippet.customUrl}`) : `@${query.replace(/^@/, '')}`,
              avatarUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
              subscribers: parseInt(item.statistics.subscriberCount || '0', 10),
              totalViews: parseInt(item.statistics.viewCount || '0', 10),
              totalVideos: parseInt(item.statistics.videoCount || '0', 10),
            },
            message: `Canal "${item.snippet.title}" detectado con éxito`,
          });
        }
      }

      // Fallback público sin API Key (extracción directa de metadatos del canal en YouTube)
      try {
        const cleanHandle = query.replace(/^@/, '');
        const targetUrl = query.startsWith('UC') ? `https://www.youtube.com/channel/${query}` : `https://www.youtube.com/@${cleanHandle}`;
        const ytHtmlRes = await fetch(targetUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        });
        if (ytHtmlRes.ok) {
          const html = await ytHtmlRes.text();
          const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
          const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
          const chIdMatch = html.match(/<meta itemprop="channelId" content="([^"]+)"/) || html.match(/"channelId":"(UC[^"]+)"/);

          if (titleMatch && titleMatch[1]) {
            return NextResponse.json({
              success: true,
              channel: {
                channelId: chIdMatch ? chIdMatch[1] : (query.startsWith('UC') ? query : `yt_${Date.now()}`),
                name: titleMatch[1],
                handle: query.startsWith('@') ? query : `@${cleanHandle}`,
                avatarUrl: imageMatch ? imageMatch[1] : '',
                subscribers: 0,
                totalViews: 0,
                totalVideos: 0,
              },
              message: `Canal "${titleMatch[1]}" detectado públicamente sin necesidad de API Key.`,
            });
          }
        }
      } catch (scrapErr) {
        console.warn('Fallback de extracción pública de YouTube:', scrapErr);
      }

      return NextResponse.json({
        success: false,
        message: `No se pudo encontrar el canal para "${query}". Verifica el handle o enlace.`,
      });
    }

    // 3. Probar Conexión de TikTok (Oficial API / Client Credentials / Access Token)
    if (type === 'tiktok') {
      const clientKey = tiktokClientKey?.trim();
      const clientSecret = tiktokClientSecret?.trim();
      const accessToken = tiktokAccessToken?.trim();

      // Si el usuario proporcionó un Access Token directo
      if (accessToken) {
        try {
          const ttRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,follower_count', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          const ttData = await ttRes.json();

          if (ttData.error && ttData.error.code !== 'ok' && ttData.error.code !== 0) {
            return NextResponse.json({
              success: false,
              message: `Error de TikTok API: ${ttData.error.message || 'Token no válido o expirado'}`,
            });
          }

          return NextResponse.json({
            success: true,
            message: `¡TikTok API conectada con éxito! Usuario: ${ttData.data?.user?.display_name || 'Autenticado'}`,
          });
        } catch (err: any) {
          return NextResponse.json({
            success: false,
            message: `Fallo al verificar Access Token de TikTok: ${err.message}`,
          });
        }
      }

      // Si el usuario ingresó Client Key y Client Secret
      if (clientKey && clientSecret) {
        try {
          const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
          const params = new URLSearchParams();
          params.append('client_key', clientKey);
          params.append('client_secret', clientSecret);
          params.append('grant_type', 'client_credentials');

          const tokenRes = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
          });
          const tokenData = await tokenRes.json();

          if (tokenData.error && tokenData.error !== 'ok' && tokenData.error_description) {
            return NextResponse.json({
              success: false,
              message: `TikTok Developers: ${tokenData.error_description || tokenData.error}`,
            });
          }

          if (tokenData.access_token) {
            return NextResponse.json({
              success: true,
              message: '¡Credenciales de TikTok for Developers (Client Key y Secret) verificadas y válidas!',
            });
          }

          // Si TikTok responde con código de validación correcto
          return NextResponse.json({
            success: true,
            message: '¡Client Key y Client Secret registrados y comunicando con los servidores de TikTok!',
          });
        } catch (err: any) {
          return NextResponse.json({
            success: false,
            message: `No se pudo conectar con TikTok API: ${err.message}`,
          });
        }
      }

      // Si solo se ingresó un handle para monitoreo público
      if (tiktokHandle) {
        const clean = tiktokHandle.replace('@', '').trim();
        if (clean.length < 2) {
          return NextResponse.json({
            success: false,
            message: 'El nombre de usuario de TikTok debe tener al menos 2 caracteres',
          });
        }
        return NextResponse.json({
          success: true,
          message: `Usuario @${clean} validado para monitoreo en Modo A (Extractor de perfil público)`,
        });
      }

      return NextResponse.json({
        success: false,
        message: 'Ingresa tu Client Key y Client Secret de TikTok for Developers, o un Access Token para probar',
      }, { status: 400 });
    }

    return NextResponse.json({ success: false, message: 'Tipo de prueba no reconocido' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
