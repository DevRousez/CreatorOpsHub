/**
 * Conector para YouTube Data API v3
 * Soporta múltiples canales simultáneos con sus respectivos channelIds o tokens.
 */

export interface YouTubeChannelStats {
  channelId: string;
  title: string;
  customUrl: string;
  avatarUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
}

export async function fetchYouTubeChannel(channelId: string, apiKey: string): Promise<YouTubeChannelStats | null> {
  if (!apiKey || !channelId) return null;

  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Error al consultar YouTube API:', res.statusText);
      return null;
    }
    const data = await res.json();
    const item = data.items?.[0];
    if (!item) return null;

    return {
      channelId: item.id,
      title: item.snippet.title,
      customUrl: item.snippet.customUrl || '',
      avatarUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      subscriberCount: parseInt(item.statistics.subscriberCount || '0', 10),
      viewCount: parseInt(item.statistics.viewCount || '0', 10),
      videoCount: parseInt(item.statistics.videoCount || '0', 10),
    };
  } catch (error) {
    console.error('Fallo en conector YouTube:', error);
    return null;
  }
}
