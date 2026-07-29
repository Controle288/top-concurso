import { useQuery } from '@tanstack/react-query'
import { useSupabaseQuery } from './index'
import { supabase } from '@/lib/supabase'
import type { Aula } from '@/types'

export function useAulas() {
  return useSupabaseQuery<Aula[]>(
    ['aulas'],
    async () => {
      const { data } = await supabase.from('aulas').select('*, disciplinas(nome)').order('created_at', { ascending: false })
      return data ?? []
    },
  )
}

export function useAulasPorConcurso(concursoId: string) {
  return useSupabaseQuery<Aula[]>(
    ['aulas', concursoId],
    async () => {
      const { data } = await supabase.from('aulas').select('*, disciplinas(nome)').eq('concurso_id', concursoId).order('created_at', { ascending: false })
      return data ?? []
    },
    { enabled: !!concursoId },
  )
}

export function useAulasConcluidasList(userId: string | undefined) {
  return useQuery<string[]>({
    queryKey: ['aulas_concluidas_list', userId],
    queryFn: async () => {
      const { data } = await supabase.from('aulas_concluidas').select('aula_id').eq('user_id', userId!)
      return data?.map(d => d.aula_id) ?? []
    },
    enabled: !!userId,
  })
}

export function useDisciplinasPorConcurso(concursoId: string) {
  return useSupabaseQuery<{ id: string; nome: string }[]>(
    ['disciplinas_por_concurso', concursoId],
    async () => {
      const { data } = await supabase.from('disciplinas').select('id, nome').eq('concurso_id', concursoId).order('nome')
      return data ?? []
    },
    { enabled: !!concursoId },
  )
}
