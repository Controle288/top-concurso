import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Concurso, Aula } from '@/types'
import { Sparkles, ArrowLeft, Clock, BookOpen, Plus, X } from 'lucide-react'
import { isBusinessDay } from '@/lib/businessDays'

interface GerarCronogramaProps {
  onVoltar: () => void
  onGerado: () => void
}

export default function GerarCronograma({ onVoltar, onGerado }: GerarCronogramaProps) {
  const [concursos, setConcursos] = useState<Concurso[]>([])
  const [concursoId, setConcursoId] = useState('')
  const [horasDia, setHorasDia] = useState('3')
  const [turno, setTurno] = useState<'manha' | 'tarde' | 'noite' | 'integral'>('integral')
  const [gerando, setGerando] = useState(false)
  const [diasPausa, setDiasPausa] = useState<string[]>([])
  const [novaPausa, setNovaPausa] = useState('')
  const [incluirRevisao, setIncluirRevisao] = useState(true)

  useEffect(() => {
    supabase.from('concursos').select('*').order('titulo').then(({ data }) => {
      if (data) setConcursos(data)
    })
  }, [])

  const addPauseDay = () => {
    if (novaPausa && !diasPausa.includes(novaPausa)) {
      setDiasPausa(prev => [...prev, novaPausa])
      setNovaPausa('')
    }
  }

  const removePauseDay = (date: string) => {
    setDiasPausa(prev => prev.filter(d => d !== date))
  }

  const handleGerar = async () => {
    if (!concursoId) return
    setGerando(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const concurso = concursos.find(c => c.id === concursoId)
    if (!concurso) return

    const { data: aulasData } = await supabase.from('aulas').select('*').eq('concurso_id', concursoId).order('created_at')
    if (!aulasData || aulasData.length === 0) {
      setGerando(false)
      return
    }

    const horasPorDia = parseFloat(horasDia)

    const { data: cronograma, error } = await supabase.from('cronogramas').insert({
      user_id: user.id,
      concurso_id: concursoId,
      titulo: `Cronograma - ${concurso.titulo}`,
      horas_dia: horasPorDia,
      turno: turno,
      data_inicio: new Date().toISOString().split('T')[0],
      ativo: true,
    }).select().single()

    if (error || !cronograma) {
      setGerando(false)
      return
    }

    let aulasRestantes = [...aulasData]
    let diaAtual = new Date()
    let diaIndex = 0

    // Calculate total study days and add revision days
    const totalAulas = aulasData.length
    const aulasPorDia = Math.floor((horasPorDia * 60) / 45) // avg 45min per aula
    const diasEstudo = Math.ceil(totalAulas / Math.max(aulasPorDia, 1))
    const revisoesPorSemana = incluirRevisao ? Math.ceil(diasEstudo / 5) : 0
    let revisoesAdicionadas = 0

    while (aulasRestantes.length > 0) {
      const diaData = new Date(diaAtual)
      diaData.setDate(diaData.getDate() + diaIndex)

      const dataStr = diaData.toISOString().split('T')[0]

      // Skip weekends, holidays, and user-defined pause days
      if (!isBusinessDay(diaData) || diasPausa.includes(dataStr)) {
        diaIndex++
        continue
      }

      let minutosRestantes = horasPorDia * 60
      const aulasDoDia: Aula[] = []

      while (aulasRestantes.length > 0 && minutosRestantes > 0) {
        const aula = aulasRestantes[0]
        if (aula.duracao_minutos <= minutosRestantes) {
          aulasDoDia.push(aula)
          minutosRestantes -= aula.duracao_minutos
          aulasRestantes.shift()
        } else {
          break
        }
      }

      if (aulasDoDia.length > 0) {
        await createDayWithAulas(cronograma.id, diaData, horasPorDia, minutosRestantes, aulasDoDia)
      }

      diaIndex++
    }

    // Add revision days periodically
    if (revisoesPorSemana > 0) {
      let diaRevisao = new Date(diaAtual)
      let revisaoIndex = 0
      while (revisoesAdicionadas < revisoesPorSemana) {
        diaRevisao.setDate(diaRevisao.getDate() + revisaoIndex)
        const dataStr = diaRevisao.toISOString().split('T')[0]
        if (isBusinessDay(diaRevisao) && !diasPausa.includes(dataStr)) {
          await supabase.from('cronograma_dias').insert({
            cronograma_id: cronograma.id,
            data: dataStr,
            horas_previstas: horasPorDia * 0.5,
            observacao: 'Dia de Revisão',
          })
          revisoesAdicionadas++
        }
        revisaoIndex++
      }
    }

    setGerando(false)
    onGerado()
  }

  const createDayWithAulas = async (
    cronogramaId: string,
    date: Date,
    horasPorDia: number,
    minutosRestantes: number,
    aulas: Aula[]
  ) => {
    const { data: dia } = await supabase.from('cronograma_dias').insert({
      cronograma_id: cronogramaId,
      data: date.toISOString().split('T')[0],
      horas_previstas: horasPorDia - (minutosRestantes / 60),
    }).select().single()

    if (dia && aulas.length > 0) {
      await supabase.from('cronograma_aulas').insert(
        aulas.map(a => ({
          cronograma_dia_id: dia.id,
          aula_id: a.id,
          titulo_personalizado: a.titulo,
          duracao_minutos: a.duracao_minutos,
          concluido: false,
          estourou_tempo: false,
        }))
      )
    }
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex items-center gap-3">
        <button onClick={onVoltar} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-orange-500 text-xs font-bold uppercase tracking-wider block">CRONOGRAMA</span>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            Gerar Cronograma
          </h2>
        </div>
      </div>

      <div className="card-glass-static p-5 space-y-5">
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Concurso / Curso</label>
          <select value={concursoId} onChange={(e) => setConcursoId(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50">
            <option value="">Selecione um concurso...</option>
            {concursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Horas de estudo por dia
          </label>
          <div className="flex gap-2">
            {['1', '2', '3', '4', '5', '6'].map(h => (
              <button key={h} onClick={() => setHorasDia(h)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  horasDia === h ? 'bg-orange-500 border-orange-500 text-black' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}>
                {h}h
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Turno preferencial
          </label>
          <div className="flex gap-2">
            {([['manha', 'Manhã'], ['tarde', 'Tarde'], ['noite', 'Noite'], ['integral', 'Integral']] as const).map(([value, label]) => (
              <button key={value} onClick={() => setTurno(value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  turno === value ? 'bg-orange-500 border-orange-500 text-black' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dias de Pausa */}
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Dias de Pausa (opcional)</label>
          <div className="flex gap-2">
            <input type="date" value={novaPausa} onChange={(e) => setNovaPausa(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50" />
            <button onClick={addPauseDay}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 rounded-xl transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {diasPausa.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {diasPausa.map(d => (
                <span key={d} className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold px-2 py-1 rounded-lg">
                  {new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')}
                  <button onClick={() => removePauseDay(d)} className="hover:text-red-300"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
          <p className="text-[10px] text-zinc-600">Feriados nacionais e finais de semana são pulados automaticamente.</p>
        </div>

        {/* Incluir Revisões */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className={`w-10 h-5 rounded-full transition-all duration-200 relative ${
            incluirRevisao ? 'bg-orange-500' : 'bg-zinc-800'
          }`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
              incluirRevisao ? 'left-5' : 'left-0.5'
            }`} />
          </div>
          <div>
            <span className="text-xs font-bold text-zinc-200">Incluir dias de revisão</span>
            <p className="text-[10px] text-zinc-600">Adiciona dias periódicos apenas para revisão</p>
          </div>
          <input type="checkbox" checked={incluirRevisao} onChange={() => setIncluirRevisao(!incluirRevisao)} className="hidden" />
        </label>

        <button onClick={handleGerar} disabled={gerando || !concursoId}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-2">
          <Sparkles className="w-5 h-5" />
          {gerando ? 'Gerando...' : 'Gerar Cronograma Automático'}
        </button>
      </div>
    </div>
  )
}
