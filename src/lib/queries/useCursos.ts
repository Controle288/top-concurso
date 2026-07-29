import { useSupabaseQuery } from './index'
import { supabase } from '@/lib/supabase'
import type { Curso, CursoModulo, CursoMatricula } from '@/types'

export function useCursos() {
  return useSupabaseQuery<Curso[]>(
    ['cursos'],
    async () => {
      const { data } = await supabase.from('cursos').select('*').eq('ativo', true).order('created_at', { ascending: false })
      return data ?? []
    },
  )
}

export function useCurso(id: string) {
  return useSupabaseQuery<Curso | null>(
    ['curso', id],
    async () => {
      const { data } = await supabase.from('cursos').select('*').eq('id', id).single()
      return data
    },
    { enabled: !!id },
  )
}

export function useCursoModulos(cursoId: string) {
  return useSupabaseQuery<CursoModulo[]>(
    ['curso_modulos', cursoId],
    async () => {
      const { data } = await supabase
        .from('curso_modulos')
        .select('*, curso_aulas(*)')
        .eq('curso_id', cursoId)
        .order('ordem', { ascending: true })
      return data ?? []
    },
    { enabled: !!cursoId },
  )
}

export function useMinhasMatriculas(userId: string | undefined) {
  return useSupabaseQuery<CursoMatricula[]>(
    ['minhas_matriculas', userId],
    async () => {
      const { data } = await supabase.from('curso_matriculas').select('*, cursos(*)').eq('user_id', userId!)
      return data ?? []
    },
    { enabled: !!userId },
  )
}
