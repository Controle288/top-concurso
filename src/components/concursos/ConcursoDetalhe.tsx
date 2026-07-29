import { useParams, useNavigate } from 'react-router-dom'
import { useConcurso } from '@/lib/queries/useConcursos'
import { ArrowLeft, Calendar, Building, Users, Trophy, ExternalLink, BookOpen } from 'lucide-react'
import GradeCurricular from './GradeCurricular'
import LoadingSkeleton from '../shared/LoadingSkeleton'

export default function ConcursoDetalhe() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: concurso, isLoading } = useConcurso(id || '')

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <LoadingSkeleton variant="list" lines={5} />
      </div>
    )
  }

  if (!concurso) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm font-semibold">Concurso não encontrado</p>
        </div>
      </div>
    )
  }

  const statusColor = {
    aberto: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    previsto: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    encerrado: 'bg-zinc-800 text-zinc-500 border-zinc-700',
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider block">CONCURSO</span>
          <h2 className="text-lg font-black text-white truncate">{concurso.titulo}</h2>
        </div>
      </div>

      <div className="bg-zinc-900/60 rounded-2xl p-5 border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${statusColor[concurso.status]}`}>
            {concurso.status === 'aberto' ? 'Aberto' : concurso.status === 'previsto' ? 'Previsto' : 'Encerrado'}
          </span>
          {concurso.edital_url && (
            <a href={concurso.edital_url} target="_blank" rel="noopener noreferrer"
              className="text-[10px] text-orange-500 font-bold flex items-center gap-1 hover:underline">
              <ExternalLink className="w-3 h-3" /> Edital
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-800/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mb-1">
              <Building className="w-3 h-3" /> Órgão
            </div>
            <p className="text-sm font-bold text-zinc-100">{concurso.orgao}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mb-1">
              <Users className="w-3 h-3" /> Vagas
            </div>
            <p className="text-sm font-bold text-zinc-100">{concurso.vagas}</p>
          </div>
          {concurso.data_prova && (
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mb-1">
                <Calendar className="w-3 h-3" /> Data da Prova
              </div>
              <p className="text-sm font-bold text-zinc-100">
                {new Date(concurso.data_prova).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
          <div className="bg-zinc-800/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mb-1">
              <Trophy className="w-3 h-3" /> Salário
            </div>
            <p className="text-sm font-bold text-zinc-100">
              {concurso.salario ? `R$ ${concurso.salario.toLocaleString('pt-BR')}` : '—'}
            </p>
          </div>
        </div>
      </div>

      <GradeCurricular concursoId={concurso.id} />
    </div>
  )
}
