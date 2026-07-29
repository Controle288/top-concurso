import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { useCurso, useCursoModulos, useMatriculaCurso, useMatricularCurso } from '@/lib/queries/useCursos'
import { ArrowLeft, Clock, User, Play, CheckCircle, Lock, GraduationCap } from 'lucide-react'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'

export default function CursoDetalhe() {
  const { id } = useParams()
  const { session } = useAuth()
  const userId = session?.user?.id
  const { data: curso, isLoading: loadingCurso } = useCurso(id || '')
  const { data: modulos = [] } = useCursoModulos(id || '')
  const { data: matriculado = false } = useMatriculaCurso(id || '', userId)
  const matricular = useMatricularCurso()

  if (loadingCurso) return <LoadingSkeleton />

  if (!curso) return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-4">
      <GraduationCap className="w-12 h-12" />
      <p>Curso não encontrado</p>
      <Link to="/cursos" className="text-orange-500 hover:text-orange-400 text-sm font-medium">Voltar</Link>
    </div>
  )

  const totalAulas = modulos.reduce((acc, m) => acc + (m.aulas?.length || 0), 0)
  const totalMinutos = modulos.reduce((acc, m) => acc + (m.aulas?.reduce((s, a) => s + (a.duracao_minutos || 0), 0) || 0), 0)

  return (
    <div className="flex flex-col gap-6 py-4">
      <Link to="/cursos" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Voltar para cursos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-black text-white tracking-tight">{curso.titulo}</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">{curso.descricao}</p>
          <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{curso.instrutor}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{Math.round(totalMinutos / 60)}h ({totalAulas} aulas)</span>
            {curso.preco === 0 && <span className="text-emerald-400 font-bold">Grátis</span>}
          </div>
          {!matriculado ? (
            <button onClick={() => id && userId && matricular.mutate({ cursoId: id, userId })} disabled={matricular.isPending} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all">
              {matricular.isPending ? 'Matriculando...' : 'Matricular-se Grátis'}
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 text-sm font-bold rounded-xl border border-emerald-500/20">
              <CheckCircle className="w-4 h-4" /> Matriculado
            </span>
          )}
        </div>

        <div className="aspect-video bg-zinc-800/50 rounded-xl overflow-hidden">
          {curso.video_apresentacao ? (
            <iframe src={`https://www.youtube-nocookie.com/embed/${curso.video_apresentacao}`} className="w-full h-full" allowFullScreen />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><GraduationCap className="w-16 h-16 text-zinc-700" /></div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white">Conteúdo do Curso</h2>
        {modulos.map((modulo, mi) => (
          <div key={modulo.id} className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl overflow-hidden">
            <div className="px-5 py-3 flex items-center justify-between bg-zinc-900/80">
              <div>
                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Módulo {mi + 1}</span>
                <h3 className="text-sm font-bold text-white">{modulo.titulo}</h3>
              </div>
              <span className="text-[11px] text-zinc-500">{modulo.aulas?.length || 0} aulas</span>
            </div>
            {modulo.aulas?.map((aula, ai) => (
              <Link
                key={aula.id}
                to={matriculado ? `/cursos/${id}/${aula.id}` : '#'}
                className={`flex items-center gap-3 px-5 py-3 border-t border-zinc-800/30 transition-colors ${
                  matriculado ? 'hover:bg-zinc-800/30 cursor-pointer' : 'opacity-60'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  matriculado ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-800 text-zinc-600'
                }`}>
                  {matriculado ? <Play className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-zinc-600">Aula {ai + 1}</span>
                  <p className="text-sm text-zinc-300 truncate">{aula.titulo}</p>
                </div>
                {aula.duracao_minutos > 0 && (
                  <span className="text-[11px] text-zinc-600 shrink-0">{aula.duracao_minutos}min</span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}