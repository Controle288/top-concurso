import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Search, BookOpen, Play, HelpCircle, MessageSquare, X, Sparkles } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  description?: string
  type: 'pdf' | 'aula' | 'questao' | 'forum'
  url: string
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setLoading(true)
      const q = `%${query}%`

      const [pdfs, aulas, questoes, forum] = await Promise.all([
        supabase.from('pdfs').select('id, titulo, descricao').ilike('titulo', q).limit(3),
        supabase.from('aulas').select('id, titulo, descricao').ilike('titulo', q).limit(3),
        supabase.from('questoes').select('id, enunciado').ilike('enunciado', q).limit(3),
        supabase.from('forum_topics').select('id, titulo, descricao').ilike('titulo', q).limit(3),
      ])

      const all: SearchResult[] = [
        ...(pdfs.data?.map(p => ({ id: p.id, title: p.titulo, description: p.descricao, type: 'pdf' as const, url: '/pdfs' })) || []),
        ...(aulas.data?.map(a => ({ id: a.id, title: a.titulo, description: a.descricao, type: 'aula' as const, url: '/videos' })) || []),
        ...(questoes.data?.map(q => ({ id: q.id, title: q.enunciado.slice(0, 100), type: 'questao' as const, url: '/questoes' })) || []),
        ...(forum.data?.map(f => ({ id: f.id, title: f.titulo, description: f.descricao, type: 'forum' as const, url: '/forum' })) || []),
      ]

      setResults(all)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    setQuery('')
    navigate(result.url)
  }

  const typeIcon = { pdf: BookOpen, aula: Play, questao: HelpCircle, forum: MessageSquare }
  const typeColor = { pdf: 'text-blue-400', aula: 'text-emerald-400', questao: 'text-orange-400', forum: 'text-purple-400' }

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-400 hover:border-zinc-700/60 transition-all"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">Pesquisar...</span>
        <kbd className="hidden sm:inline-flex text-[10px] bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-500 font-mono">⌘K</kbd>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60">
              <Search className="w-5 h-5 text-zinc-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar PDFs, aulas, questões, fórum..."
                className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none"
              />
              {loading && <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />}
              <button onClick={() => setOpen(false)} className="text-zinc-600 hover:text-zinc-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto p-2 space-y-0.5">
                {results.map((r, i) => {
                  const Icon = typeIcon[r.type]
                  return (
                    <button
                      key={`${r.type}-${r.id}-${i}`}
                      onClick={() => handleSelect(r)}
                      className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800/60 transition-all text-left"
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${typeColor[r.type]}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-zinc-200 truncate">{r.title}</p>
                        {r.description && (
                          <p className="text-[11px] text-zinc-500 truncate mt-0.5">{r.description}</p>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-600 uppercase font-bold mt-0.5 shrink-0">{r.type}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {query.length >= 2 && results.length === 0 && !loading && (
              <div className="py-8 text-center">
                <Sparkles className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">Nenhum resultado para "{query}"</p>
              </div>
            )}

            {query.length < 2 && (
              <div className="py-6 text-center text-xs text-zinc-600">
                Digite pelo menos 2 caracteres para buscar
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
