import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface QuestaoResposta {
  id: string
  user_id: string
  questao_id: string
  correta: boolean
  created_at: string
}

interface QuestStats {
  total: number
  correct: number
  rate: number
}

export function useQuestaoRespostas(userId: string | undefined) {
  return useQuery<QuestaoResposta[]>({
    queryKey: ['questao_respostas', userId],
    queryFn: async () => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('questao_respostas')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data ?? []
    },
    enabled: !!userId,
  })
}

export function useQuestStats(userId: string | undefined) {
  return useQuery<QuestStats>({
    queryKey: ['quest_stats', userId],
    queryFn: async () => {
      const saved = localStorage.getItem('topconcurso_questoes')
      if (saved) {
        const history = JSON.parse(saved)
        const total = history.length
        const correct = history.filter((h: any) => h.correct).length
        const rate = total > 0 ? Math.round((correct / total) * 100) : 0
        return { total, correct, rate }
      }

      if (!userId) return { total: 0, correct: 0, rate: 0 }

      const { count: total } = await supabase
        .from('questao_respostas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      const { count: correct } = await supabase
        .from('questao_respostas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('correta', true)

      const t = total ?? 0
      const c = correct ?? 0
      return { total: t, correct: c, rate: t > 0 ? Math.round((c / t) * 100) : 0 }
    },
    enabled: true,
    staleTime: 1000 * 30,
  })
}

export function useSalvarResposta() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ questaoId, correta }: { questaoId: string; correta: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('questao_respostas')
        .insert({ user_id: user.id, questao_id: questaoId, correta })

      if (error) throw error

      const saved = localStorage.getItem('topconcurso_questoes')
      const history = saved ? JSON.parse(saved) : []
      history.push({ id: questaoId, correct: correta, date: new Date().toISOString() })
      localStorage.setItem('topconcurso_questoes', JSON.stringify(history))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questao_respostas'] })
      queryClient.invalidateQueries({ queryKey: ['quest_stats'] })
    },
  })
}
