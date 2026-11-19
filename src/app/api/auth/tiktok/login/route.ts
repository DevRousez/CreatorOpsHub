import { NextResponse } from 'next/server';
import { getAppSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

function buildAuthUrl(req: Request, clientKey: string): { authUrl: string; redirectUri: string } {
  const url = new URL(req.url);
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

  return { authUrl: authUrl.toString(), redirectUri };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const queryKey = url.searchParams.get('client_key');
    const settings = getAppSettings();
    const clientKey = queryKey || settings.tiktok?.clientKey || process.env.TIKTOK_CLIENT_KEY || 'awo7pvamgk3831x0';

    const { authUrl } = buildAuthUrl(req, clientKey);
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('Error iniciando login de TikTok (GET):', error);
    return NextResponse.redirect(new URL('/?error=tiktok_login_failed', req.url));
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const settings = getAppSettings();
    const clientKey = body.clientKey?.trim() || settings.tiktok?.clientKey || process.env.TIKTOK_CLIENT_KEY || 'awo7pvamgk3831x0';
    const clientSecret = body.clientSecret?.trim() || settings.tiktok?.clientSecret || process.env.TIKTOK_CLIENT_SECRET || '';

    const { authUrl } = buildAuthUrl(req, clientKey);

    const response = NextResponse.json({ success: true, authUrl });

    // Guardar temporalmente en cookie segura para que el callback reciba las credenciales incluso tras reinicio de lambda
    if (clientSecret) {
      response.cookies.set('creatorops_tt_secret', clientSecret, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 3600, // 1 hora
      });
    }
    if (clientKey) {
      response.cookies.set('creatorops_tt_key', clientKey, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 3600,
      });
    }

    return response;
  } catch (error: any) {
    console.error('Error iniciando login de TikTok (POST):', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
