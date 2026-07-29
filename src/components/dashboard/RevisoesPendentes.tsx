import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { RefreshCw, ChevronRight } from 'lucide-react'

interface RevisoesPendentesProps {
  userId: string | undefined
}

export default function RevisoesPendentes({ userId }: RevisoesPendentesProps) {
  const navigate = useNavigate()

  const { data: pendentes = 0 } = useQuery({
    queryKey: ['revisoes_pendentes', userId],
    queryFn: async () => {
      if (!userId) return 0
      const hoje = new Date().toISOString().split('T')[0]
      const { count } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .lte('next_review', hoje)
      return count ?? 0
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
  })

  if (pendentes === 0) return null

  return (
    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-purple-200">{pendentes} revisão{pendentes !== 1 ? 'ões' : ''} pendente{pendentes !== 1 ? 's' : ''}</p>
          <p className="text-[10px] text-purple-400/60">Flashcards para revisar hoje</p>
        </div>
      </div>
      <button onClick={() => navigate('/revisao')}
        className="bg-purple-500/20 text-purple-300 text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-purple-500/30 transition-all">
        Revisar <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  )
}
