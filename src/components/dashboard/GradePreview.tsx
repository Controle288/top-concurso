import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { useMaterias } from '@/lib/queries/useMaterias'
import { useAulasConcluidasList } from '@/lib/queries/useAulas'
import { BookOpen, ChevronRight, Circle, AlertCircle } from 'lucide-react'

interface GradePreviewProps {
  concursoId: string
  titulo: string
}

export default function GradePreview({ concursoId, titulo }: GradePreviewProps) {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { data: materias = [] } = useMaterias(concursoId)
  const { data: aulasConcluidas = [] } = useAulasConcluidasList(session?.user?.id)
  const concluidaIds = new Set(aulasConcluidas)

  const materiasComAula = materias.filter(m => (m.aulas?.length || 0) > 0)
  const total = materiasComAula.length
  const concluidas = materiasComAula.filter(m =>
    (m.aulas || []).every(a => concluidaIds.has(a.id))
  ).length
  const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0

  const proximasMaterias = materiasComAula
    .filter(m => !(m.aulas || []).every(a => concluidaIds.has(a.id)))
    .slice(0, 3)

  const semAula = materias.filter(m => (m.aulas?.length || 0) === 0).length

  if (materias.length === 0) return null

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
      <button onClick={() => navigate(`/concurso/${concursoId}`)}
        className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-4 h-4 text-orange-500 shrink-0" />
          <span className="text-sm font-bold text-zinc-100 truncate">{titulo}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
      </button>

      <div className="flex items-center gap-3 mb-3 text-xs">
        <span className="text-zinc-500">{total} tópico{total !== 1 ? 's' : ''}</span>
        <span className="text-zinc-700">•</span>
        <span className="text-emerald-400 font-bold">{concluidas} feito{concluidas !== 1 ? 's' : ''}</span>
        {semAula > 0 && (
          <>
            <span className="text-zinc-700">•</span>
            <span className="text-red-400">{semAula} sem aula{semAula !== 1 ? 's' : ''}</span>
          </>
        )}
      </div>

      <div className="h-2 bg-zinc-800/60 rounded-full overflow-hidden mb-3">
        <div className={`h-full rounded-full transition-all duration-700 ${
          pct >= 70 ? 'bg-emerald-500' : pct >= 30 ? 'bg-orange-500' : 'bg-zinc-600'
        }`} style={{ width: `${pct}%` }} />
      </div>

      {proximasMaterias.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Próximas matérias</p>
          {proximasMaterias.map(m => (
            <div key={m.id} className="flex items-center gap-2 text-xs text-zinc-400">
              {(m.aulas || []).some(a => concluidaIds.has(a.id)) ? (
                <Circle className="w-3 h-3 text-zinc-700 shrink-0" />
              ) : (
                <AlertCircle className="w-3 h-3 text-orange-500 shrink-0" />
              )}
              <span className="truncate">{m.disciplinas?.nome ? `${m.disciplinas.nome} — ` : ''}{m.nome}</span>
            </div>
          ))}
          {materiasComAula.length > 3 && (
            <button onClick={() => navigate(`/concurso/${concursoId}`)}
              className="text-[10px] text-orange-500 font-bold mt-1">
              +{materiasComAula.length - 3} mais...
            </button>
          )}
        </div>
      )}
    </div>
  )
}
