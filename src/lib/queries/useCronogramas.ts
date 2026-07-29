import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Cronograma, CronogramaDia, CronogramaAula } from '@/types'

export function useCronogramas(userId: string | undefined) {
  return useQuery<Cronograma[]>({
    queryKey: ['cronogramas', userId],
    queryFn: async () => {
      const { data } = await supabase.from('cronogramas').select('*, concursos(titulo)').eq('user_id', userId!).order('created_at', { ascending: false })
      return data ?? []
    },
    enabled: !!userId,
  })
}

export function useCronogramaDias(cronogramaId: string) {
  return useQuery<CronogramaDia[]>({
    queryKey: ['cronograma_dias', cronogramaId],
    queryFn: async () => {
      const { data } = await supabase.from('cronograma_dias').select('*, cronograma_aulas(*)').eq('cronograma_id', cronogramaId).order('data')
      return data ?? []
    },
    enabled: !!cronogramaId,
  })
}
