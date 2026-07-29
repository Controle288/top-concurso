import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Calendar, ChevronRight, Clock, Play } from 'lucide-react'

interface CronogramaHojeProps {
  userId: string | undefined
}

export default function CronogramaHoje({ userId }: CronogramaHojeProps) {
  const navigate = useNavigate()
  const hoje = new Date().toISOString().split('T')[0]

  const { data: aulas = [] } = useQuery({
    queryKey: ['cronograma_hoje', userId, hoje],
    queryFn: async () => {
      if (!userId) return []

      const { data: cronogramas } = await supabase
        .from('cronogramas')
        .select('id')
        .eq('user_id', userId)
        .eq('ativo', true)

      if (!cronogramas || cronogramas.length === 0) return []

      const ids = cronogramas.map(c => c.id)

      const { data: dias } = await supabase
        .from('cronograma_dias')
        .select('id, cronograma_aulas(*)')
        .in('cronograma_id', ids)
        .eq('data', hoje)

      if (!dias) return []

      const todas = dias.flatMap(d => d.cronograma_aulas || [])
      return todas.filter(a => !a.concluido).slice(0, 5)
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
  })

  if (aulas.length === 0) return null

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          Estudos de Hoje
        </h3>
        <button onClick={() => navigate('/cronograma')} className="text-xs text-orange-500 font-bold flex items-center gap-1 hover:gap-1.5 transition-all">
          Ver tudo <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-1.5">
        {aulas.map((aula: any) => (
          <div key={aula.id} className="flex items-center gap-2.5 bg-zinc-950/50 rounded-xl px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
            <span className="text-xs text-zinc-200 flex-1 truncate">
              {aula.titulo_personalizado || 'Aula'}
            </span>
            {aula.duracao_minutos && (
              <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> {aula.duracao_minutos}min
              </span>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/cronograma')}
        className="w-full bg-orange-500 text-black text-xs font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all">
        <Play className="w-4 h-4" /> Começar a Estudar
      </button>
    </div>
  )
}
