import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCursos } from '@/lib/queries/useCursos'
import { GraduationCap, Clock, User, Search } from 'lucide-react'
import SectionHeader from '@/components/shared/SectionHeader'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import type { Curso } from '@/types'

const categoriaLabels: Record<string, string> = {
  idiomas: 'Idiomas', musica: 'Música', artesanato: 'Artesanato',
  informatica: 'Informática', negocios: 'Negócios', saude: 'Saúde', outros: 'Outros',
}

const categoriaCores: Record<string, string> = {
  idiomas: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  musica: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  artesanato: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  informatica: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  negocios: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  saude: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  outros: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

export default function Cursos() {
  const [search, setSearch] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const { data: cursos = [], isLoading } = useCursos()

  const filtrados = cursos.filter((c: Curso) =>
    c.titulo.toLowerCase().includes(search.toLowerCase()) ||
    c.instrutor.toLowerCase().includes(search.toLowerCase())
  ).filter((c: Curso) => !filtroCategoria || c.categoria === filtroCategoria)

  return (
    <div className="flex flex-col gap-5 py-4">
      <SectionHeader
        icon={GraduationCap}
        title="Cursos Livres"
        subtitle="Aprenda novas habilidades com cursos gratuitos"
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar curso ou instrutor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <select
          value={filtroCategoria}
          onChange={e => setFiltroCategoria(e.target.value)}
          className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
        >
          <option value="">Todas as categorias</option>
          {Object.entries(categoriaLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : filtrados.length === 0 ? (
        <EmptyState icon={GraduationCap} title="Nenhum curso encontrado" description="Volte mais tarde para novos cursos" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map(curso => (
            <Link
              key={curso.id}
              to={`/cursos/${curso.id}`}
              className="group bg-zinc-900/40 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-orange-500/30 hover:bg-zinc-900/60 transition-all"
            >
              <div className="aspect-video bg-zinc-800/50 relative overflow-hidden">
                {curso.thumbnail_url ? (
                  <img src={curso.thumbnail_url} alt={curso.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <GraduationCap className="w-12 h-12 text-zinc-700" />
                  </div>
                )}
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-full border ${categoriaCores[curso.categoria] || categoriaCores.outros}`}>
                  {categoriaLabels[curso.categoria] || curso.categoria}
                </span>
                {curso.preco === 0 && (
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Grátis
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                  {curso.titulo}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {curso.instrutor}
                  </span>
                  {curso.carga_horaria_minutos > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.round(curso.carga_horaria_minutos / 60)}h
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-600 line-clamp-2">{curso.descricao}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}