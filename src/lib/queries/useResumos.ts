import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Resumo } from '@/types'

export function useResumos(userId: string | undefined) {
  return useQuery<Resumo[]>({
    queryKey: ['resumos', userId],
    queryFn: async () => {
      const { data } = await supabase.from('resumos').select('*').eq('user_id', userId!)
      return data ?? []
    },
    enabled: !!userId,
  })
}

export function useSalvarResumo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (resumo: { id?: string; user_id: string; titulo: string; conteudo: string; disciplina_id?: string; updated_at?: string }) => {
      if (resumo.id) {
        const { error } = await supabase.from('resumos').update(resumo).eq('id', resumo.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('resumos').insert(resumo)
        if (error) throw error
      }
    },
    onSuccess: () => {
      toast.success('Resumo salvo!')
      queryClient.invalidateQueries({ queryKey: ['resumos'] })
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'Erro ao salvar resumo'),
  })
}

export function useDeletarResumo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('resumos').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Resumo excluído')
      queryClient.invalidateQueries({ queryKey: ['resumos'] })
    },
  })
}
