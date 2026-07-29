import { useSupabaseQuery } from './index'
import { supabase } from '@/lib/supabase'
import type { Aula } from '@/types'

export function useAulas() {
  return useSupabaseQuery<Aula[]>(
    ['aulas'],
    async () => {
      const { data } = await supabase.from('aulas').select('*').order('created_at', { ascending: false })
      return data ?? []
    },
  )
}

export function useAulasPorConcurso(concursoId: string) {
  return useSupabaseQuery<Aula[]>(
    ['aulas', concursoId],
    async () => {
      const { data } = await supabase.from('aulas').select('*').eq('concurso_id', concursoId).order('created_at', { ascending: false })
      return data ?? []
    },
    { enabled: !!concursoId },
  )
}
