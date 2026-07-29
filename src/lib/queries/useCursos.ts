import { useSupabaseQuery } from './index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Curso, CursoModulo, CursoMatricula, CursoAula } from '@/types'

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

export function useMatriculaCurso(cursoId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['curso_matricula', cursoId, userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('curso_matriculas')
        .select('id')
        .eq('curso_id', cursoId)
        .eq('user_id', userId!)
        .maybeSingle()
      return !!data
    },
    enabled: !!cursoId && !!userId,
  })
}

export function useCursoAula(aulaId: string) {
  return useSupabaseQuery<CursoAula | null>(
    ['curso_aula', aulaId],
    async () => {
      const { data } = await supabase.from('curso_aulas').select('*').eq('id', aulaId).single()
      return data
    },
    { enabled: !!aulaId },
  )
}

export function useCursoProgresso(aulaId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['curso_progresso', aulaId, userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('curso_progresso')
        .select('id')
        .eq('aula_id', aulaId)
        .eq('user_id', userId!)
        .maybeSingle()
      return !!data
    },
    enabled: !!aulaId && !!userId,
  })
}

export function useMatricularCurso() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ cursoId, userId }: { cursoId: string; userId: string }) => {
      const { error } = await supabase.from('curso_matriculas').insert({ curso_id: cursoId, user_id: userId })
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Matrícula realizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['curso_matricula'] })
      queryClient.invalidateQueries({ queryKey: ['minhas_matriculas'] })
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Erro ao matricular')
    },
  })
}

export function useMarcarProgresso() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ aulaId, userId }: { aulaId: string; userId: string }) => {
      const { error } = await supabase.from('curso_progresso').insert({ aula_id: aulaId, user_id: userId })
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Aula concluída!')
      queryClient.invalidateQueries({ queryKey: ['curso_progresso'] })
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar progresso')
    },
  })
}
