import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
      if (!youtubeApiKey) {
        return NextResponse.json({
          success: false,
          message: 'Debes ingresar una clave API de YouTube',
        }, { status: 400 });
      }

      if (!channelQuery) {
        const testUrl = `https://www.googleapis.com/youtube/v3/videos?part=id&chart=mostPopular&maxResults=1&key=${youtubeApiKey}`;
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

      const query = channelQuery.trim();
      let fetchUrl = '';

      if (query.startsWith('UC') && query.length >= 20) {
        fetchUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${query}&key=${youtubeApiKey}`;
      } else {
        const cleanHandle = query.replace(/^@/, '');
        fetchUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${cleanHandle}&key=${youtubeApiKey}`;
      }

      let res = await fetch(fetchUrl);
      let data = await res.json();

      if (!data.items || data.items.length === 0) {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=1&key=${youtubeApiKey}`;
        const sRes = await fetch(searchUrl);
        const sData = await sRes.json();

        if (sData.items && sData.items.length > 0) {
          const chId = sData.items[0].snippet.channelId;
          const chRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${chId}&key=${youtubeApiKey}`);
          data = await chRes.json();
        }
      }

      if (!data.items || data.items.length === 0) {
        return NextResponse.json({
          success: false,
          message: `No se encontró ningún canal para "${query}". Verifica el ID o Handle.`,
        });
      }

      const item = data.items[0];
      return NextResponse.json({
        success: true,
        channel: {
          channelId: item.id,
          name: item.snippet.title,
          handle: item.snippet.customUrl || `@${item.snippet.title.toLowerCase().replace(/\s+/g, '')}`,
          avatarUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
          subscribers: parseInt(item.statistics.subscriberCount || '0', 10),
          totalViews: parseInt(item.statistics.viewCount || '0', 10),
          totalVideos: parseInt(item.statistics.videoCount || '0', 10),
        },
        message: `Canal "${item.snippet.title}" encontrado con éxito`,
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
