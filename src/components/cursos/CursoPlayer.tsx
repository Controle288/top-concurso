import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { useCurso, useCursoModulos, useCursoAula, useCursoProgresso, useMarcarProgresso } from '@/lib/queries/useCursos'
import { ArrowLeft, CheckCircle, Play, GraduationCap } from 'lucide-react'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'

export default function CursoPlayer() {
  const { id, aulaId } = useParams()
  const { session } = useAuth()
  const userId = session?.user?.id

  const { data: curso, isLoading: loadingCurso } = useCurso(id || '')
  const { data: modulos = [] } = useCursoModulos(id || '')
  const { data: aula, isLoading: loadingAula } = useCursoAula(aulaId || '')
  const { data: concluido = false } = useCursoProgresso(aulaId || '', userId)
  const marcarProgresso = useMarcarProgresso()

  useEffect(() => {
    if (aula && !concluido && userId && aulaId) {
      marcarProgresso.mutate({ aulaId, userId })
    }
  }, [aula?.id])

  if (loadingCurso || loadingAula) return <LoadingSkeleton />

  if (!curso || !aula) return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-4">
      <GraduationCap className="w-12 h-12" />
      <p>Aula não encontrada</p>
      <Link to="/cursos" className="text-orange-500 hover:text-orange-400 text-sm font-medium">Voltar</Link>
    </div>
  )

  const todasAulas = modulos.flatMap(m => m.aulas || [])
  const idx = todasAulas.findIndex((a: { id: string }) => a.id === aulaId)
  const prevAula = idx > 0 ? todasAulas[idx - 1] : null
  const nextAula = idx < todasAulas.length - 1 ? todasAulas[idx + 1] : null

  return (
    <div className="flex flex-col gap-6 py-4">
      <Link to={`/cursos/${id}`} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        {curso.titulo}
      </Link>

      <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden">
        {aula.video_url ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${aula.video_url}?autoplay=1`}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm">Vídeo indisponível</div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Aula {idx + 1} de {todasAulas.length}</span>
          <h1 className="text-xl font-bold text-white">{aula.titulo}</h1>
          <p className="text-sm text-zinc-500">{aula.descricao}</p>
        </div>
        {concluido && (
          <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <CheckCircle className="w-5 h-5" /> Concluído
          </span>
        )}
      </div>

      <div className="flex gap-3">
        {prevAula && (
          <Link to={`/cursos/${id}/${prevAula.id}`} className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-zinc-300 hover:bg-zinc-900 transition-all">
            <Play className="w-4 h-4 rotate-180" /> Anterior
          </Link>
        )}
        {nextAula && (
          <Link to={`/cursos/${id}/${nextAula.id}`} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-all ml-auto">
            Próxima Aula <Play className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}