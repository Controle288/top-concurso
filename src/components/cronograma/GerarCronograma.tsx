import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Concurso, Aula } from '@/types';
import { Sparkles, ArrowLeft, Clock, BookOpen } from 'lucide-react';

interface GerarCronogramaProps {
  onVoltar: () => void;
  onGerado: () => void;
}

export default function GerarCronograma({ onVoltar, onGerado }: GerarCronogramaProps) {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [concursoId, setConcursoId] = useState('');
  const [horasDia, setHorasDia] = useState('3');
  const [turno, setTurno] = useState<'manha' | 'tarde' | 'noite' | 'integral'>('integral');
  const [gerando, setGerando] = useState(false);

  useEffect(() => {
    supabase.from('concursos').select('*').order('titulo').then(({ data }) => {
      if (data) setConcursos(data);
    });
  }, []);

  const handleGerar = async () => {
    if (!concursoId) return;
    setGerando(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const concurso = concursos.find(c => c.id === concursoId);
    if (!concurso) return;

    const { data: aulasData } = await supabase.from('aulas').select('*').eq('concurso_id', concursoId).order('created_at');
    if (!aulasData || aulasData.length === 0) {
      setGerando(false);
      return;
    }

    const horasPorDia = parseFloat(horasDia);
    const turnoStr = turno;

    const { data: cronograma, error } = await supabase.from('cronogramas').insert({
      user_id: user.id,
      concurso_id: concursoId,
      titulo: `Cronograma - ${concurso.titulo}`,
      horas_dia: horasPorDia,
      turno: turnoStr,
      data_inicio: new Date().toISOString().split('T')[0],
      ativo: true,
    }).select().single();

    if (error || !cronograma) {
      setGerando(false);
      return;
    }

    // Distribui as aulas nos dias
    let aulasRestantes = [...aulasData];
    let diaAtual = new Date();
    let diaIndex = 0;

    while (aulasRestantes.length > 0) {
      const diaData = new Date(diaAtual);
      diaData.setDate(diaData.getDate() + diaIndex);

      // Pula sábado e domingo
      if (diaData.getDay() === 0 || diaData.getDay() === 6) {
        diaIndex++;
        continue;
      }

      let minutosRestantes = horasPorDia * 60;
      const aulasDoDia: Aula[] = [];

      while (aulasRestantes.length > 0 && minutosRestantes > 0) {
        const aula = aulasRestantes[0];
        if (aula.duracao_minutos <= minutosRestantes) {
          aulasDoDia.push(aula);
          minutosRestantes -= aula.duracao_minutos;
          aulasRestantes.shift();
        } else {
          // Aula é mais longa que o tempo restante - recalcula para próximo dia
          break;
        }
      }

      if (aulasDoDia.length > 0 || aulasRestantes.length > 0) {
        const { data: dia } = await supabase.from('cronograma_dias').insert({
          cronograma_id: cronograma.id,
          data: diaData.toISOString().split('T')[0],
          horas_previstas: horasPorDia - (minutosRestantes / 60),
        }).select().single();

        if (dia && aulasDoDia.length > 0) {
          await supabase.from('cronograma_aulas').insert(
            aulasDoDia.map(a => ({
              cronograma_dia_id: dia.id,
              aula_id: a.id,
              titulo_personalizado: a.titulo,
              duracao_minutos: a.duracao_minutos,
              concluido: false,
              estourou_tempo: false,
            }))
          );
        }
      }

      diaIndex++;
    }

    setGerando(false);
    onGerado();
  };

  return (
    <div className="flex flex-col gap-5 p-4 pb-24">
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

      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-5">
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

        <button onClick={handleGerar} disabled={gerando || !concursoId}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-2">
          <Sparkles className="w-5 h-5" />
          {gerando ? 'Gerando...' : 'Gerar Cronograma Automático'}
        </button>
      </div>
    </div>
  );
}
