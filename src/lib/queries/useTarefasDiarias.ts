import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface TarefaDiaria {
  id: string
  user_id: string
  data: string
  titulo: string
  tipo: string
  assunto: string
  duracao: string
  concluida: boolean
  created_at: string
}

const defaultTasks: Omit<TarefaDiaria, 'id' | 'user_id' | 'created_at' | 'data'>[] = [
  { titulo: 'Estudar Controle de Constitucionalidade', tipo: 'Teoria', assunto: 'Direito Constitucional', concluida: false, duracao: '45 min' },
  { titulo: 'Revisar Atos Administrativos', tipo: 'Revisão', assunto: 'Direito Administrativo', concluida: false, duracao: '30 min' },
  { titulo: 'Resolver 15 Questões de Crase', tipo: 'Exercícios', assunto: 'Língua Portuguesa', concluida: false, duracao: '40 min' },
  { titulo: 'Ler Lei 8.112/90 (Arts. 1º ao 20)', tipo: 'Teoria', assunto: 'Direito Administrativo', concluida: false, duracao: '25 min' },
]

export function useTarefasDiarias(userId: string | undefined) {
  const hoje = new Date().toISOString().split('T')[0]

  return useQuery<TarefaDiaria[]>({
    queryKey: ['tarefas_diarias', userId, hoje],
    queryFn: async () => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('tarefas_diarias')
        .select('*')
        .eq('user_id', userId)
        .eq('data', hoje)
        .order('created_at', { ascending: true })

      if (error) throw error

      if (!data || data.length === 0) {
        const { data: inserted } = await supabase
          .from('tarefas_diarias')
          .insert(defaultTasks.map(t => ({ ...t, user_id: userId, data: hoje })))
          .select()

        return inserted ?? []
      }

      return data
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useToggleTarefa() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, concluida }: { id: string; concluida: boolean }) => {
      const { error } = await supabase
        .from('tarefas_diarias')
        .update({ concluida })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarefas_diarias'] })
    },
  })
}
