import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export function useQuestaoComentarios(questaoId: string) {
  return useQuery<any[]>({
    queryKey: ['questao_comentarios', questaoId],
    queryFn: async () => {
      const { data } = await supabase.from('questao_comentarios').select('*').eq('questao_id', questaoId).order('created_at')
      return data ?? []
    },
    enabled: !!questaoId,
  })
}

export function useCriarComentario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { questao_id: string; user_id: string; conteudo: string }) => {
      const { error } = await supabase.from('questao_comentarios').insert(payload)
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      toast.success('Comentário enviado!')
      queryClient.invalidateQueries({ queryKey: ['questao_comentarios', variables.questao_id] })
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'Erro ao enviar comentário'),
  })
}

export function useDeletarComentario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, questaoId }: { id: string; questaoId: string }) => {
      const { error } = await supabase.from('questao_comentarios').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questao_comentarios'] })
    },
  })
}
