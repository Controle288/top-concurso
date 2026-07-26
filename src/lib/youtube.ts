const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || ''
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

export interface YouTubeSearchResult {
  id: string
  title: string
  description: string
  channelTitle: string
  publishedAt: string
  thumbnailUrl: string
  duration: string
}

export async function searchYouTubeVideos(query: string, maxResults = 10): Promise<YouTubeSearchResult[]> {
  if (!YOUTUBE_API_KEY) return []

  try {
    // Step 1: Search for videos
    const searchRes = await fetch(
      `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${YOUTUBE_API_KEY}`
    )
    const searchData = await searchRes.json()
    if (!searchData.items) return []

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

    // Step 2: Get video details (duration)
    const detailsRes = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    )
    const detailsData = await detailsRes.json()

    return (detailsData.items || []).map((item: any) => {
      const duration = item.contentDetails?.duration || 'PT0S'
      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
        duration: formatDuration(duration),
      }
    })
  } catch {
    return []
  }
}

function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return '0:00'
  const hours = parseInt(match[1]?.replace('H', '') || '0')
  const minutes = parseInt(match[2]?.replace('M', '') || '0')
  const seconds = parseInt(match[3]?.replace('S', '') || '0')
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
