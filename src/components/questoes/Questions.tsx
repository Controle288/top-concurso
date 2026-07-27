import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import type { Questao } from '@/types'
import { Check, X, ChevronRight, Award, RotateCcw, AlertCircle, Sparkles, Trophy, Timer, Play, Crown, Search, SlidersHorizontal, GraduationCap } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import QuestionComments from '@/components/shared/QuestionComments'
import SectionHeader from '../shared/SectionHeader'

const NIVEL_OPTIONS = [
  { value: '', label: 'Todos Níveis' },
  { value: 'fundamental', label: 'Fundamental' },
  { value: 'medio', label: 'Médio' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'superior', label: 'Superior' },
]

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

interface AlternativaProps {
  altKey: string
  text: string
  isSelected: boolean
  isAnswered: boolean
  correta: string
  onSelect: (key: string) => void
}

const Alternativa = memo(function Alternativa({ altKey, text, isSelected, isAnswered, correta, onSelect }: AlternativaProps) {
  const showAsCorrect = isAnswered && altKey === correta
  const showAsWrong = isAnswered && isSelected && altKey !== correta

  let buttonStyle = 'bg-zinc-900/70 border-zinc-800/80 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900'
  let indicatorStyle = 'bg-zinc-950 border-zinc-700 text-zinc-400'

  if (isSelected && !isAnswered) {
    buttonStyle = 'bg-orange-500/10 border-orange-500 text-orange-200'
    indicatorStyle = 'bg-orange-500 border-orange-500 text-black font-bold'
  } else if (showAsCorrect) {
    buttonStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-200'
    indicatorStyle = 'bg-emerald-500 border-emerald-500 text-black'
  } else if (showAsWrong) {
    buttonStyle = 'bg-red-500/10 border-red-500 text-red-200'
    indicatorStyle = 'bg-red-500 border-red-500 text-black'
  } else if (isAnswered) {
    buttonStyle = 'bg-zinc-900/20 border-zinc-900/50 text-zinc-600 opacity-60'
    indicatorStyle = 'bg-zinc-950 border-zinc-800 text-zinc-700'
  }

  return (
    <button onClick={() => onSelect(altKey)} disabled={isAnswered}
      className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3.5 transition-all duration-200 cursor-pointer ${buttonStyle}`}>
      <div className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-xs font-semibold border transition-all ${indicatorStyle}`}>
        {showAsCorrect ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : showAsWrong ? <X className="w-3.5 h-3.5 stroke-[3px]" /> : altKey}
      </div>
      <span className="text-sm font-medium leading-relaxed">{text}</span>
    </button>
  )
})

export default function Questions() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [questions, setQuestions] = useState<Questao[]>([])
  const [bancas, setBancas] = useState<{ id: string; nome: string; sigla: string }[]>([])
  const [disciplinas, setDisciplinas] = useState<{ id: string; nome: string }[]>([])
  const [concursos, setConcursos] = useState<{ id: string; titulo: string }[]>([])
  const [anos, setAnos] = useState<number[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [scoreHistory, setScoreHistory] = useState<{ id: string; correct: boolean }[]>([])
  const [questionsSolved, setQuestionsSolved] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [filterBanca, setFilterBanca] = useState('')
  const [filterAno, setFilterAno] = useState('')
  const [filterDisciplina, setFilterDisciplina] = useState('')
  const [filterConcurso, setFilterConcurso] = useState('')
  const [filterNivel, setFilterNivel] = useState('')
  const [filterSearch, setFilterSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [modoProva, setModoProva] = useState(false)
  const [tempoRestante, setTempoRestante] = useState(0)
  const [tempoTotal, setTempoTotal] = useState(0)
  const [provaAtiva, setProvaAtiva] = useState(false)
  const [showPremiumGate, setShowPremiumGate] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const PAGE_SIZE = 20
  const TEMPO_POR_QUESTAO = 90

  useEffect(() => {
    Promise.all([
      supabase.from('bancas').select('id, nome, sigla'),
      supabase.from('disciplinas').select('id, nome'),
      supabase.from('concursos').select('id, titulo'),
      supabase.from('questoes').select('ano').not('ano', 'is', null).order('ano', { ascending: false }),
    ]).then(([bancasRes, disciplinasRes, concursosRes, anosRes]) => {
      if (bancasRes.data) setBancas(bancasRes.data)
      if (disciplinasRes.data) setDisciplinas(disciplinasRes.data)
      if (concursosRes.data) setConcursos(concursosRes.data)
      if (anosRes.data) {
        const uniqueAnos = [...new Set(anosRes.data.map(a => a.ano))].filter(Boolean) as number[]
        setAnos(uniqueAnos)
      }
    })
  }, [])

  useEffect(() => {
    setPage(0)
    setQuestions([])
    setHasMore(true)
    setCurrentIndex(0)
    setSelectedKey(null)
    setIsAnswered(false)
    setScoreHistory([])
    setQuestionsSolved(0)
    setCorrectAnswers(0)
    if (timerRef.current) clearInterval(timerRef.current)
    setProvaAtiva(false)
    setTempoRestante(0)
    loadQuestions(0, true)
  }, [filterBanca, filterAno, filterDisciplina, filterConcurso, filterNivel, filterSearch])

  useEffect(() => {
    if (!hasMore || loadingMore || page === 0) return
    loadQuestions(page)
  }, [page])

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current)
    return () => observerRef.current?.disconnect()
  }, [hasMore, loadingMore, loading])

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  type QuestaoComJoin = Questao & {
    bancas?: { nome: string } | null
    disciplinas?: { nome: string } | null
    concursos?: { titulo: string } | null
  }

  const loadQuestions = async (pageNum: number, replace = false) => {
    setLoadingMore(true)
    let query = supabase
      .from('questoes')
      .select('*, bancas(nome), disciplinas(nome), concursos(titulo)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

    if (filterBanca) query = query.eq('banca_id', filterBanca)
    if (filterAno) query = query.eq('ano', parseInt(filterAno))
    if (filterDisciplina) query = query.eq('disciplina_id', filterDisciplina)
    if (filterConcurso) query = query.eq('concurso_id', filterConcurso)
    if (filterNivel) query = query.eq('nivel', filterNivel)
    if (filterSearch) query = query.ilike('enunciado', `%${filterSearch}%`)

    const { data, count } = await query

    if (data) {
      setQuestions(prev => replace ? (data as QuestaoComJoin[]) : [...prev, ...(data as QuestaoComJoin[])])
      if (data.length < PAGE_SIZE) setHasMore(false)
    }
    setLoading(false)
    setLoadingMore(false)
  }

  useEffect(() => {
    if (provaAtiva && tempoRestante <= 0 && currentIndex < questions.length) {
      handleNext()
    }
  }, [tempoRestante])

  const currentQuestion = currentIndex < questions.length ? questions[currentIndex] : null
  const isFinished = !provaAtiva && currentIndex >= questions.length

  const handleSelect = useCallback((key: string) => {
    if (isAnswered) return
    setSelectedKey(key)
  }, [isAnswered])

  const handleAnswer = () => {
    if (!selectedKey || !currentQuestion || isAnswered) return
    const isCorrect = selectedKey === currentQuestion.correta
    setIsAnswered(true)
    setQuestionsSolved(prev => prev + 1)
    if (isCorrect) setCorrectAnswers(prev => prev + 1)
    const entry = { id: currentQuestion.id, correct: isCorrect }
    setScoreHistory(prev => [...prev, entry])
    const saved = localStorage.getItem('topconcurso_questoes')
    const history = saved ? JSON.parse(saved) : []
    history.push({ id: currentQuestion.id, correct: isCorrect, date: new Date().toISOString() })
    localStorage.setItem('topconcurso_questoes', JSON.stringify(history))
  }

  const handleNext = () => {
    if (provaAtiva && tempoRestante > 0) {
      if (!isAnswered && selectedKey) handleAnswer()
      else if (!isAnswered) {
        setScoreHistory(prev => [...prev, { id: currentQuestion?.id || '', correct: false }])
      }
    }
    const next = currentIndex + 1
    if (next >= questions.length) {
      if (timerRef.current) clearInterval(timerRef.current)
      setProvaAtiva(false)
    }
    setSelectedKey(null)
    setIsAnswered(false)
    setCurrentIndex(next)
  }

  const iniciarProva = async () => {
    const total = questions.length
    if (total === 0) return
    if (!profile?.assinatura_ativa && profile?.role !== 'admin') {
      setShowPremiumGate(true)
      return
    }
    const segundos = total * TEMPO_POR_QUESTAO
    setTempoTotal(segundos)
    setTempoRestante(segundos)
    setProvaAtiva(true)
    setCurrentIndex(0)
    setSelectedKey(null)
    setIsAnswered(false)
    setScoreHistory([])
    setQuestionsSolved(0)
    setCorrectAnswers(0)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedKey(null)
    setIsAnswered(false)
    setScoreHistory([])
    setQuestionsSolved(0)
    setCorrectAnswers(0)
    if (timerRef.current) clearInterval(timerRef.current)
    setProvaAtiva(false)
  }

  if (isFinished && questions.length > 0) {
    const total = scoreHistory.length
    const correctCount = scoreHistory.filter(h => h.correct).length
    const rate = total > 0 ? Math.round((correctCount / total) * 100) : 0

    return (
      <div className="flex flex-col gap-6 py-4 text-center select-none">
        <div className="py-8 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative w-20 h-20 bg-zinc-900 border-2 border-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <Trophy className="w-10 h-10 text-orange-500" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-4">Simulado Concluído!</h2>
          <p className="text-zinc-400 text-sm max-w-xs mx-auto">Você completou todas as questões disponíveis.</p>
        </div>

        <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/80 space-y-4 shadow-xl">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
            <span className="text-zinc-400 text-sm font-medium">Questões Respondidas:</span>
            <span className="text-white font-bold font-mono">{total}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
            <span className="text-zinc-400 text-sm font-medium">Acertos:</span>
            <span className="text-emerald-500 font-bold font-mono flex items-center gap-1"><Check className="w-4 h-4 stroke-[3px]" /> {correctCount}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
            <span className="text-zinc-400 text-sm font-medium">Erros:</span>
            <span className="text-red-500 font-bold font-mono flex items-center gap-1"><X className="w-4 h-4 stroke-[3px]" /> {total - correctCount}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-zinc-400 text-sm font-medium">Aproveitamento Final:</span>
            <span className={`text-xl font-black font-mono px-3 py-1 rounded-lg ${rate >= 70 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>{rate}%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-zinc-300 text-xs text-left leading-relaxed flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <b className="text-orange-400 block mb-1">Dica do Especialista:</b>
            {rate >= 75 ? "Excelente desempenho! Continue assim para gabaritar a prova!" : "Bom progresso! Sugerimos revisar as fundamentações teóricas nos Materiais."}
          </div>
        </div>

        <button onClick={handleRestart} className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(249,115,22,0.3)] transition-all">
          <RotateCcw className="w-5 h-5" /> Refazer Simulado
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <SectionHeader icon={Award} title="Simulados" subtitle="Pratique com questões de concursos" />

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-3 space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Buscar por palavra no enunciado..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none flex-wrap">
          <select value={filterConcurso} onChange={(e) => setFilterConcurso(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] text-zinc-300 focus:outline-none focus:border-orange-500/50 whitespace-nowrap flex-1 min-w-[120px]">
            <option value="">Todos Concursos</option>
            {concursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
          </select>
          <select value={filterDisciplina} onChange={(e) => setFilterDisciplina(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] text-zinc-300 focus:outline-none focus:border-orange-500/50 whitespace-nowrap flex-1 min-w-[100px]">
            <option value="">Todas Disciplinas</option>
            {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
          <select value={filterBanca} onChange={(e) => setFilterBanca(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] text-zinc-300 focus:outline-none focus:border-orange-500/50 whitespace-nowrap flex-1 min-w-[90px]">
            <option value="">Todas Bancas</option>
            {bancas.map(b => <option key={b.id} value={b.id}>{b.sigla || b.nome}</option>)}
          </select>
          <select value={filterAno} onChange={(e) => setFilterAno(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] text-zinc-300 focus:outline-none focus:border-orange-500/50 whitespace-nowrap flex-1 min-w-[70px]">
            <option value="">Todos Anos</option>
            {anos.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filterNivel} onChange={(e) => setFilterNivel(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] text-zinc-300 focus:outline-none focus:border-orange-500/50 whitespace-nowrap flex-1 min-w-[80px]">
            {NIVEL_OPTIONS.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
          </select>
        </div>
      </div>

      {!provaAtiva && questions.length > 0 && (
        <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80">
          <div className="flex items-center gap-3 mb-3">
            <Timer className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm font-bold text-white">Modo Prova</p>
              <p className="text-[10px] text-zinc-400">{questions.length} questões • {questions.length * TEMPO_POR_QUESTAO / 60} min</p>
            </div>
          </div>
          <button onClick={() => iniciarProva()}
            className="w-full bg-orange-500 text-black font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95">
            <Play className="w-5 h-5" /> Iniciar Simulado com Timer
          </button>
        </div>
      )}

      {showPremiumGate && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="card-glass p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-orange-500/30">
              <Crown className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Modo Prova é Premium</h3>
              <p className="text-sm text-zinc-400 mt-1">Assine o Premium e desbloqueie o simulado com timer cronometrado.</p>
            </div>
            <button onClick={() => navigate('/planos')}
              className="w-full bg-orange-500 text-black font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all">
              <Sparkles className="w-4 h-4" /> Ver Planos
            </button>
            <button onClick={() => setShowPremiumGate(false)}
              className="text-xs text-zinc-500 font-bold hover:text-zinc-300 transition-all">
              Voltar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-sm font-semibold">Nenhuma questão encontrada com esses filtros.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center select-none bg-zinc-900/40 px-3.5 py-2.5 rounded-xl border border-zinc-800/50">
            <span className="text-zinc-400 text-xs font-bold font-mono uppercase tracking-wider">
              {provaAtiva ? 'PROVA' : 'QUESTÃO'} {currentIndex + 1} DE {questions.length}
            </span>
            <div className="flex items-center gap-3">
              {provaAtiva && tempoRestante > 0 && (
                <span className={`text-xs font-bold font-mono ${tempoRestante < 60 ? 'text-red-500' : 'text-orange-400'}`}>
                  <Timer className="w-3.5 h-3.5 inline mr-1" />
                  {formatTime(tempoRestante)}
                </span>
              )}
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-xs text-zinc-300 font-mono font-bold">{correctAnswers}</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-xs text-zinc-300 font-mono font-bold">{questionsSolved - correctAnswers}</span></div>
            </div>
          </div>

          {currentQuestion && (
            <>
              <div className="space-y-1.5 select-none">
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-orange-600/10 text-orange-400 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider border border-orange-500/10">
                    {(currentQuestion as QuestaoComJoin).bancas?.nome || 'Banca'}
                  </span>
                  {(currentQuestion as QuestaoComJoin).concursos?.titulo && (
                    <span className="bg-zinc-800 text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                      {(currentQuestion as QuestaoComJoin).concursos?.titulo}
                    </span>
                  )}
                  {currentQuestion.ano && (
                    <span className="bg-zinc-800 text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded">{currentQuestion.ano}</span>
                  )}
                </div>
                <h2 className="text-md font-bold text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
                  {(currentQuestion as QuestaoComJoin).disciplinas?.nome || 'Disciplina'}
                </h2>
              </div>

              <div className="bg-zinc-900/60 rounded-2xl p-5 border border-zinc-800/80 shadow-md">
                <p className="text-[14.5px] text-zinc-100 leading-relaxed font-normal">{currentQuestion.enunciado}</p>
              </div>

              <div className="space-y-2.5">
                {currentQuestion.alternativas.map((alt) => (
                  <Alternativa
                    key={alt.key}
                    altKey={alt.key}
                    text={alt.text}
                    isSelected={selectedKey === alt.key}
                    isAnswered={isAnswered}
                    correta={currentQuestion.correta}
                    onSelect={handleSelect}
                  />
                ))}
              </div>

              {isAnswered && currentQuestion.explicacao && (
                <div className="bg-zinc-900/80 rounded-2xl p-5 border border-zinc-800/80 space-y-3 shadow-inner">
                  <div className="flex items-center gap-2 text-orange-500 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <span>Fundamentação Comentada</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{currentQuestion.explicacao}</p>
                </div>
              )}

              {isAnswered && (
                <QuestionComments questaoId={currentQuestion.id} />
              )}

              <div className="pt-2">
                {provaAtiva && tempoRestante > 0 ? (
                  <button onClick={handleNext}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(249,115,22,0.35)] active:scale-95 transition-all cursor-pointer">
                    {currentIndex === questions.length - 1 ? 'Ver Resultado Final' : 'Próxima Questão'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <>
                    {!isAnswered ? (
                      <button onClick={handleAnswer} disabled={!selectedKey}
                        className={`w-full py-4 rounded-xl font-extrabold text-sm transition-all duration-200 select-none ${
                          selectedKey ? 'bg-orange-500 hover:bg-orange-600 text-black shadow-[0_4px_20px_rgba(249,115,22,0.35)] cursor-pointer active:scale-95' : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                        }`}>
                        Responder
                      </button>
                    ) : (
                      <button onClick={handleNext} className="w-full bg-orange-500 hover:bg-orange-600 text-black font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(249,115,22,0.35)] active:scale-95 transition-all cursor-pointer">
                        {currentIndex === questions.length - 1 ? 'Ver Resultado Final' : 'Próxima Questão'}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}
              </div>

              {!provaAtiva && loadingMore && (
                <div className="flex items-center justify-center py-4">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {hasMore && !provaAtiva && (
                <div ref={loadMoreRef} className="h-4" />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
