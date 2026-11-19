import { NextResponse } from 'next/server';
import { getAppSettings, saveAppSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    console.warn('Autorización de TikTok cancelada o con error:', error);
    return NextResponse.redirect(new URL('/?error=tiktok_auth_cancelled', req.url));
  }

  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const getCookie = (name: string): string => {
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
      return match ? decodeURIComponent(match[1]) : '';
    };
    const cookieKey = getCookie('creatorops_tt_key');
    const cookieSecret = getCookie('creatorops_tt_secret');
    const cookieRedirectUri = getCookie('creatorops_tt_redirect_uri');

    const settings = getAppSettings();
    const clientKey = cookieKey || settings.tiktok?.clientKey || process.env.TIKTOK_CLIENT_KEY || 'awo7pvamgk3831x0';
    const clientSecret = cookieSecret || settings.tiktok?.clientSecret || process.env.TIKTOK_CLIENT_SECRET;

    if (!clientKey || !clientSecret) {
      console.error('Faltan credenciales de TikTok Client Key / Secret');
      return NextResponse.redirect(new URL('/?error=missing_credentials_or_secret', req.url));
    }

    const host = req.headers.get('host') || url.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const redirectUri = cookieRedirectUri || `${protocol}://${host}/api/auth/tiktok/callback`;

    // Intercambiar código por Access Token en TikTok
    const tokenParams = new URLSearchParams();
    tokenParams.append('client_key', clientKey);
    tokenParams.append('client_secret', clientSecret);
    tokenParams.append('code', code);
    tokenParams.append('grant_type', 'authorization_code');
    tokenParams.append('redirect_uri', redirectUri);

    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error || !tokenData.data?.access_token) {
      console.error('Error al obtener token de TikTok:', tokenData);
      return NextResponse.redirect(new URL(`/?error=token_exchange_failed&msg=${encodeURIComponent(tokenData.message || tokenData.error_description || '')}`, req.url));
    }

    const accessToken = tokenData.data.access_token;
    const openId = tokenData.data.open_id;

    // Obtener información del perfil del creador
    let creatorName = 'Mi Cuenta TikTok';
    let creatorHandle = '@tiktok_creator';
    let creatorAvatar = '';

    try {
      const userRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const userData = await userRes.json();
      if (userData?.data?.user) {
        const u = userData.data.user;
        creatorName = u.display_name || creatorName;
        creatorHandle = u.username ? `@${u.username}` : creatorHandle;
        creatorAvatar = u.avatar_url || creatorAvatar;
      }
    } catch (uErr) {
      console.warn('Aviso: no se pudo consultar /user/info/ de TikTok, continuando con token guardado:', uErr);
    }

    // Actualizar configuración persistente
    const existingAccounts = settings.accounts || [];
    const hasAccount = existingAccounts.some(a => a.platform === 'tiktok' && (a.channelId === openId || a.handle.toLowerCase() === creatorHandle.toLowerCase()));

    const updatedAccounts = hasAccount
      ? existingAccounts.map(a => (a.platform === 'tiktok' && (a.channelId === openId || a.handle.toLowerCase() === creatorHandle.toLowerCase()))
          ? { ...a, name: creatorName, handle: creatorHandle, avatarUrl: creatorAvatar || a.avatarUrl, enabled: true, accessToken }
          : a
        )
      : [
          ...existingAccounts,
          {
            id: `tt-oauth-${Date.now()}`,
            platform: 'tiktok' as const,
            name: creatorName,
            handle: creatorHandle,
            channelId: openId || `tt_${Date.now()}`,
            badge: 'TikTok OAuth',
            color: '#06B6D4',
            avatarUrl: creatorAvatar,
            enabled: true,
            accessToken,
            subscribers: 0,
            subscribersChange24h: 1,
            totalViews: 0,
            views24h: 0,
            totalVideos: 0,
            avgEngagementRate: 8.0,
          },
        ];

    saveAppSettings({
      tiktok: {
        ...settings.tiktok,
        accessToken,
      },
      accounts: updatedAccounts,
    });

    return NextResponse.redirect(new URL('/?tiktok_connected=true', req.url));
  } catch (error: any) {
    console.error('Excepción en callback de TikTok OAuth:', error);
    return NextResponse.redirect(new URL('/?error=tiktok_callback_exception', req.url));
  }
}
