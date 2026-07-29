import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Materia } from '@/types'

export function useMaterias(concursoId: string) {
  return useQuery<Materia[]>({
    queryKey: ['materias', concursoId],
    queryFn: async () => {
      const { data } = await supabase
        .from('materias')
        .select('*, disciplinas(nome), aulas(*)')
        .eq('concurso_id', concursoId)
        .order('ordem')
      return data ?? []
    },
    enabled: !!concursoId,
    staleTime: 0,
    refetchOnMount: true,
  })
}

export function useMateriasPorDisciplina(disciplinaId: string) {
  return useQuery<Materia[]>({
    queryKey: ['materias', 'disciplina', disciplinaId],
    queryFn: async () => {
      const { data } = await supabase
        .from('materias')
        .select('*, aulas(*)')
        .eq('disciplina_id', disciplinaId)
        .order('ordem')
      return data ?? []
    },
    enabled: !!disciplinaId,
  })
}

export function useCriarMateria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { concurso_id: string; disciplina_id: string; nome: string; ordem: number }) => {
      const { error } = await supabase.from('materias').insert(payload)
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      toast.success('Matéria criada!')
      queryClient.invalidateQueries({ queryKey: ['materias', variables.concurso_id] })
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'Erro ao criar matéria'),
  })
}

export function useAtualizarMateria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { id: string; nome?: string; ordem?: number; disciplina_id?: string }) => {
      const { error } = await supabase.from('materias').update(payload).eq('id', payload.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materias'] })
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'Erro ao atualizar matéria'),
  })
}

export function useDeletarMateria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('materias').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Matéria excluída')
      queryClient.invalidateQueries({ queryKey: ['materias'] })
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'Erro ao excluir matéria'),
  })
}
