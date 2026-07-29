import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface ConcursoProgress {
  id: string
  titulo: string
  total: number
  concluido: number
}

interface DashboardData {
  aulasConcluidas: number
  concursoProgress: ConcursoProgress[]
}

export function useDashboardData(userId: string | undefined) {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', userId],
    queryFn: async () => {
      const [aulasCount, todasAulas, concluidas] = await Promise.all([
        supabase.from('aulas_concluidas').select('*', { count: 'exact', head: true }).eq('user_id', userId!),
        supabase.from('aulas').select('id, concurso_id'),
        supabase.from('aulas_concluidas').select('aula_id').eq('user_id', userId!),
      ])

      const aulasConcluidas = aulasCount.count ?? 0
      let concursoProgress: ConcursoProgress[] = []

      if (todasAulas.data && concluidas.data) {
        const setId = new Set(concluidas.data.map(c => c.aula_id))
        const { data: concursos } = await supabase.from('concursos').select('id, titulo').limit(5)
        if (concursos) {
          concursoProgress = concursos
            .map(c => {
              const aulasDoConcurso = todasAulas.data!.filter(a => a.concurso_id === c.id)
              const total = aulasDoConcurso.length
              if (total === 0) return null
              const concluido = aulasDoConcurso.filter(a => setId.has(a.id)).length
              return { id: c.id, titulo: c.titulo, total, concluido }
            })
            .filter((p): p is ConcursoProgress => p !== null)
        }
      }

      return { aulasConcluidas, concursoProgress }
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
  })
}

export function useAulasConcluidas(userId: string | undefined) {
  return useQuery({
    queryKey: ['aulas_concluidas', userId],
    queryFn: async () => {
      const { count } = await supabase
        .from('aulas_concluidas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId!)
      return count ?? 0
    },
    enabled: !!userId,
  })
}
