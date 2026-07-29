import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface EstudoDiario {
  minutosHoje: number
  streak: number
}

export function useEstudoDiario(userId: string | undefined) {
  return useQuery<EstudoDiario>({
    queryKey: ['estudo_diario', userId],
    queryFn: async () => {
      if (!userId) return { minutosHoje: 0, streak: 0 }

      const hoje = new Date().toISOString().split('T')[0]

      const { data: hojeData } = await supabase
        .from('study_sessions')
        .select('minutos')
        .eq('user_id', userId)
        .eq('data', hoje)
        .maybeSingle()

      const minutosHoje = hojeData?.minutos ?? 0

      const { data: todas } = await supabase
        .from('study_sessions')
        .select('data')
        .eq('user_id', userId)
        .order('data', { ascending: false })

      let streak = 0
      if (todas) {
        const datas = [...new Set(todas.map(s => s.data))].sort().reverse()
        const hojeObj = new Date(hoje + 'T00:00:00')
        for (let i = 0; i < datas.length; i++) {
          const esperada = new Date(hojeObj)
          esperada.setDate(esperada.getDate() - i)
          const esperadaStr = esperada.toISOString().split('T')[0]
          if (datas[i] === esperadaStr) {
            streak++
          } else {
            break
          }
        }
      }

      return { minutosHoje, streak }
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
  })
}
