import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
const youtubeApiKey = process.env.VITE_YOUTUBE_API_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — use --env-file=.env.local')
  process.exit(1)
}
if (!youtubeApiKey) {
  console.error('Missing VITE_YOUTUBE_API_KEY — use --env-file=.env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

interface YouTubeItem {
  id: { videoId: string }
  snippet: {
    title: string
    channelTitle: string
    thumbnails?: { high?: { url: string }; default?: { url: string } }
  }
}

interface YouTubeDetails {
  id: string
  contentDetails?: { duration: string }
}

function parseDuration(iso: string): number {
  const m = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!m) return 0
  const h = parseInt(m[1]?.replace('H', '') || '0')
  const min = parseInt(m[2]?.replace('M', '') || '0')
  return h * 60 + min
}

let quotaExhausted = false

async function searchYouTube(query: string): Promise<{ id: string; title: string; channel: string; thumbnail: string; duration: number }[]> {
  if (quotaExhausted) return []
  const searchRes = await fetch(
    `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=5&type=video&regionCode=BR&relevanceLanguage=pt&key=${youtubeApiKey}`
  )
  if (!searchRes.ok) {
    if (searchRes.status === 429) {
      console.log('  ! Cota da YouTube API excedida. Pulando as próximas disciplinas.')
      quotaExhausted = true
    }
    return []
  }
  const searchData: { items?: YouTubeItem[] } = await searchRes.json()
  if (!searchData.items?.length) return []

  const videoIds = searchData.items.map(i => i.id.videoId).join(',')

  const detailsRes = await fetch(
    `${YOUTUBE_API_BASE}/videos?part=contentDetails&id=${videoIds}&key=${youtubeApiKey}`
  )
  if (!detailsRes.ok) return []
  const detailsData: { items?: YouTubeDetails[] } = await detailsRes.json()
  const durationMap = new Map(detailsData.items?.map(i => [i.id, i.contentDetails?.duration || 'PT0S']) || [])

  return searchData.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
    duration: parseDuration(durationMap.get(item.id.videoId) || 'PT0S'),
  }))
}

async function main() {
  console.log('Buscando concursos e disciplinas...\n')

  const { data: concursos, error: cErr } = await supabase.from('concursos').select('id, titulo, orgao')
  if (cErr || !concursos) {
    console.error('Erro ao buscar concursos:', cErr)
    process.exit(1)
  }

  const { data: disciplinas, error: dErr } = await supabase
    .from('disciplinas')
    .select('id, nome, concurso_id')
  if (dErr || !disciplinas) {
    console.error('Erro ao buscar disciplinas:', dErr)
    process.exit(1)
  }

  const { data: existingAulas } = await supabase.from('aulas').select('youtube_id')
  const existingIds = new Set(existingAulas?.map(a => a.youtube_id).filter(Boolean) || [])

  console.log(`  ${concursos.length} concursos, ${disciplinas.length} disciplinas, ${existingIds.size} aulas existentes\n`)

  let inserted = 0
  let skipped = 0

  for (const disc of disciplinas) {
    if (!disc.concurso_id) continue

    const concurso = concursos.find(c => c.id === disc.concurso_id)
    if (!concurso) continue

    const concursoLabel = `${concurso.titulo || concurso.orgao || ''}`
    const query = `${disc.nome} ${concurso.orgao || concurso.titulo || ''} concurso`

    const seen = new Set<string>()
    const videos: { id: string; title: string; channel: string; thumbnail: string; duration: number }[] = []

    const results = await searchYouTube(query)
    for (const v of results) {
      if (videos.length >= 3) break
      if (existingIds.has(v.id) || seen.has(v.id)) continue
      if (v.duration < 5 || v.duration > 180) continue
      seen.add(v.id)
      videos.push(v)
    }

    if (videos.length === 0) {
      console.log(`  - ${disc.nome} (${concursoLabel}): nenhum video novo encontrado`)
      skipped++
      continue
    }

    await new Promise(r => setTimeout(r, 300))

    const rows = videos.map(v => ({
      titulo: v.title,
      concurso_id: disc.concurso_id,
      disciplina_id: disc.id,
      youtube_url: `https://www.youtube.com/watch?v=${v.id}`,
      youtube_id: v.id,
      duracao_minutos: v.duration,
      instrutor: v.channel,
      thumbnail_url: v.thumbnail,
      descricao: `Aula de ${disc.nome} para ${concursoLabel}.`,
    }))

    const { error: insertErr } = await supabase.from('aulas').insert(rows)
    if (insertErr) {
      console.log(`  X ${disc.nome} (${concursoLabel}): erro ao inserir - ${insertErr.message}`)
      continue
    }

    for (const v of videos) existingIds.add(v.id)
    inserted += videos.length
    console.log(`  + ${disc.nome} (${concursoLabel}): ${videos.length} video(s) inserido(s)`)
  }

  console.log(`\nResumo: ${inserted} aulas inseridas, ${skipped} disciplinas sem videos novos`)
}

main().catch(err => {
  console.error('Erro fatal:', err)
  process.exit(1)
})
