import { useConcursosAbertos } from '@/lib/queries/useConcursos'
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react'
import type { Concurso } from '@/types'

export default function ConcursosAbertos() {
  const { data: concursos = [] } = useConcursosAbertos()

  if (concursos.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-md font-bold text-white tracking-tight flex items-center gap-2">
        <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span>
        Concursos Abertos & Previstos
      </h2>
      <div className="space-y-2">
        {concursos.map((c: Concurso) => {
          const chance = c.vagas > 0 && c.inscritos_estimados > 0
            ? ((c.vagas / c.inscritos_estimados) * 100).toFixed(2)
            : null
          return (
            <div key={c.id} className="bg-zinc-900/60 rounded-xl p-3.5 border border-zinc-800/80">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-zinc-100 line-clamp-1">{c.titulo}</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">{c.orgao}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                  c.status === 'aberto' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  c.status === 'previsto' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                  'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}>
                  {c.status === 'aberto' ? 'Aberto' : c.status === 'previsto' ? 'Previsto' : 'Encerrado'}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-zinc-400">
                {c.vagas > 0 && (
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {c.vagas} vagas</span>
                )}
                {c.inscritos_estimados > 0 && (
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> ~{c.inscritos_estimados} inscritos</span>
                )}
                {c.data_prova && (
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Prova: {new Date(c.data_prova).toLocaleDateString('pt-BR')}</span>
                )}
                {chance && (
                  <span className="flex items-center gap-1 text-orange-500 font-bold"><TrendingUp className="w-3 h-3" /> {chance}% chance</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}