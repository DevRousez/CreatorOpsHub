import { NextResponse } from 'next/server';
import { getAppSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const settings = getAppSettings();
    const clientKey = settings.tiktok?.clientKey || process.env.TIKTOK_CLIENT_KEY;

    if (!clientKey) {
      return NextResponse.redirect(new URL('/?error=missing_tiktok_client_key', req.url));
    }

    // Determinar la URL base de redirección
    const url = new URL(req.url);
    const origin = url.origin;
    // Si estamos en Vercel o producción, preferir HTTPS oficial
    const host = req.headers.get('host') || url.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/auth/tiktok/callback`;

    const state = Math.random().toString(36).substring(2, 15);
    const scope = 'user.info.basic,video.list';

    const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
    authUrl.searchParams.set('client_key', clientKey);
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);

    return NextResponse.redirect(authUrl.toString());
  } catch (error: any) {
    console.error('Error iniciando login de TikTok:', error);
    return NextResponse.redirect(new URL('/?error=tiktok_login_failed', req.url));
  }
}
