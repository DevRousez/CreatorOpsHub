/**
 * Conector para TikTok (Arquitectura Híbrida / Dual-Mode)
 * 
 * Modo 1 (Sin cuenta de desarrollador):
 *   Extractor mediante perfil público o endpoints creator locales con cookies de sesión.
 * 
 * Modo 2 (API Oficial de Desarrollador - Preparado):
 *   Endpoints listos para Display API / TikTok for Developers cuando se tengan credenciales.
 */

export interface TikTokProfileStats {
  handle: string;
  nickname: string;
  avatarUrl: string;
  followerCount: number;
  followingCount: number;
  heartCount: number; // likes totales
  videoCount: number;
}

/**
 * Modo 1: Extractor ligero para cuentas públicas / perfil sin Developer Account.
 * Puede ser invocado desde tu script local en tu PC para evitar bloqueos de IP.
 */
export async function fetchTikTokPublicProfile(username: string): Promise<TikTokProfileStats | null> {
  const cleanHandle = username.replace('@', '');
  
  try {
    // Nota: TikTok suele proteger sus páginas con verificación.
    // Un worker en tu PC local usando fetch con user-agent o sesión local puede poblar esto.
    const res = await fetch(`https://www.tiktok.com/@${cleanHandle}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`No se pudo obtener datos públicos directos de TikTok para @${cleanHandle}`);
      return null;
    }

    // Retorna estructura base
    return null;
  } catch (err) {
    console.error(`Error al consultar TikTok (@${cleanHandle}):`, err);
    return null;
  }
}

/**
 * Modo 2: Conector Oficial con TikTok for Developers (OAuth2)
 * Se activará en cuanto se ingrese TIKTOK_CLIENT_KEY en .env
 */
export async function fetchTikTokOfficialStats(accessToken: string) {
  if (!accessToken) return null;

  try {
    const res = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,follower_count,following_count,likes_count', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('Error en TikTok Official API:', e);
    return null;
  }
}
