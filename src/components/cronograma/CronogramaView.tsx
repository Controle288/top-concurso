import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useCronogramas, useCronogramaDias } from '@/lib/queries/useCronogramas'
import { useAulasConcluidasList } from '@/lib/queries/useAulas'
import type { Cronograma, CronogramaDia, CronogramaAula } from '@/types'
import { Calendar, Check, Clock, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react'
import GerarCronograma from './GerarCronograma'
import SectionHeader from '../shared/SectionHeader'
import LoadingSkeleton from '../shared/LoadingSkeleton'

export default function CronogramaView() {
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const userId = session?.user?.id;
  const { data: cronogramas = [], isLoading } = useCronogramas(userId);
  const [selectedCronograma, setSelectedCronograma] = useState<string | null>(null);
  const { data: dias = [] } = useCronogramaDias(selectedCronograma || '');
  const { data: aulasConcluidas = [] } = useAulasConcluidasList(userId);
  const [showGerar, setShowGerar] = useState(false);
  const [reagendando, setReagendando] = useState(false);

  const loadDias = async (cronogramaId: string) => {
    setSelectedCronograma(cronogramaId);
    const concluidaIds = new Set(aulasConcluidas);
    const { data: diasData } = await supabase.from('cronograma_dias').select('*, cronograma_aulas(*)').eq('cronograma_id', cronogramaId).order('data');
    if (!diasData) return;
    for (const dia of diasData) {
      if (dia.aulas) {
        for (const aula of dia.aulas) {
          if (aula.aula_id && concluidaIds.has(aula.aula_id) && !aula.concluido) {
            await supabase.from('cronograma_aulas').update({ concluido: true }).eq('id', aula.id);
            aula.concluido = true;
          }
        }
      }
    }
  };

  const toggleAulaConcluida = async (aulaId: string, concluido: boolean, aulaDataId?: string) => {
    await supabase.from('cronograma_aulas').update({ concluido: !concluido }).eq('id', aulaId);
    if (aulaDataId && userId) {
      if (!concluido) {
        await supabase.from('aulas_concluidas').insert({ user_id: userId, aula_id: aulaDataId }).maybeSingle();
      } else {
        await supabase.from('aulas_concluidas').delete().eq('user_id', userId).eq('aula_id', aulaDataId);
      }
    }
    if (selectedCronograma) {
      const { data: fresh } = await supabase.from('cronograma_dias').select('*, cronograma_aulas(*)').eq('cronograma_id', selectedCronograma).order('data');
      if (fresh) {
        // Update query cache directly
      }
    }
  };

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const diasComPendentes = dias.filter(d => {
    const dataDia = new Date(d.data + 'T00:00:00');
    return dataDia < hoje && d.aulas?.some((a: any) => !a.concluido);
  });

  const ultimoDiaFuturo = dias.length > 0 ? dias[dias.length - 1] : null;
  const ultimaDataFutura = ultimoDiaFuturo ? new Date(ultimoDiaFuturo.data + 'T00:00:00') : new Date();

  const handleReagendar = async () => {
    if (!selectedCronograma || !userId || diasComPendentes.length === 0) return;
    setReagendando(true);

    const aulasPendentes: any[] = [];
    for (const dia of diasComPendentes) {
      if (dia.aulas) {
        for (const aula of dia.aulas) {
          if (!aula.concluido) {
            aulasPendentes.push(aula);
            await supabase.from('cronograma_aulas').delete().eq('id', aula.id);
          }
        }
      }
    }

    if (aulasPendentes.length === 0) { setReagendando(false); return; }

    const { data: cronograma } = await supabase.from('cronogramas').select('horas_dia').eq('id', selectedCronograma).single();
    const horasPorDia = cronograma?.horas_dia || 3;
    let restantes = [...aulasPendentes];
    let diaAtual = new Date(ultimaDataFutura);
    let diaIndex = 0;

    while (restantes.length > 0) {
      const diaData = new Date(diaAtual);
      diaData.setDate(diaData.getDate() + diaIndex);

      if (diaData.getDay() === 0 || diaData.getDay() === 6) {
        diaIndex++;
        continue;
      }

      let minutosRestantes = horasPorDia * 60;
      const aulasDoDia: any[] = [];

      while (restantes.length > 0 && minutosRestantes > 0) {
        const aula = restantes[0];
        const dur = aula.duracao_minutos || 30;
        if (dur <= minutosRestantes) {
          aulasDoDia.push(aula);
          minutosRestantes -= dur;
          restantes.shift();
        } else {
          break;
        }
      }

      const dataStr = diaData.toISOString().split('T')[0];

      if (aulasDoDia.length > 0) {
        const { data: existingDia } = await supabase.from('cronograma_dias')
          .select('id').eq('cronograma_id', selectedCronograma).eq('data', dataStr).maybeSingle();

        let diaId: string;
        if (existingDia) {
          diaId = existingDia.id;
          await supabase.from('cronograma_dias').update({
            horas_previstas: (horasPorDia - (minutosRestantes / 60))
          }).eq('id', diaId);
        } else {
          const { data: novoDia } = await supabase.from('cronograma_dias').insert({
            cronograma_id: selectedCronograma,
            data: dataStr,
            horas_previstas: horasPorDia - (minutosRestantes / 60),
          }).select().single();
          if (!novoDia) { diaIndex++; continue; }
          diaId = novoDia.id;
        }

        await supabase.from('cronograma_aulas').insert(
          aulasDoDia.map((a: any) => ({
            cronograma_dia_id: diaId,
            aula_id: a.aula_id,
            titulo_personalizado: a.titulo_personalizado,
            duracao_minutos: a.duracao_minutos,
            concluido: false,
            estourou_tempo: false,
          }))
        );
      }

      diaIndex++;
    }

    setReagendando(false);
    if (selectedCronograma) {
      const { data: fresh } = await supabase.from('cronograma_dias').select('*, cronograma_aulas(*)').eq('cronograma_id', selectedCronograma).order('data');
    }
  };

  function agruparPorDisciplina(aulas: any[]): [string, any[]][] {
    const grupos: Record<string, any[]> = {}
    for (const a of aulas) {
      const sep = a.titulo_personalizado?.includes(' — ') ? ' — ' : ' - '
      const disciplina = a.titulo_personalizado?.includes(sep)
        ? a.titulo_personalizado.split(sep)[0]
        : 'Outros'
      if (!grupos[disciplina]) grupos[disciplina] = []
      grupos[disciplina].push(a)
    }
    return Object.entries(grupos)
  }

  if (showGerar) {
    return <GerarCronograma onVoltar={() => setShowGerar(false)} onGerado={() => { setShowGerar(false); }} />;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <SectionHeader
        icon={Calendar}
        title="Cronograma"
        subtitle="Planeje seus estudos"
        action={{ label: 'Criar', onClick: () => {
          if (!profile?.assinatura_ativa && profile?.role !== 'admin') {
            navigate('/planos');
            return;
          }
          setShowGerar(true);
        } }}
      />

      {isLoading ? (
        <LoadingSkeleton variant="list" lines={3} />
      ) : cronogramas.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <Calendar className="w-12 h-12 text-zinc-700 mx-auto" />
          <p className="text-zinc-500 text-sm font-semibold">Nenhum cronograma ainda.</p>
          <p className="text-xs text-zinc-500">Clique em + para gerar um cronograma automático.</p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {cronogramas.map(c => (
              <button key={c.id} onClick={() => loadDias(c.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-extrabold transition-all border whitespace-nowrap ${
                  selectedCronograma === c.id ? 'bg-orange-500 border-orange-500 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}>
                {(c as any).titulo?.length > 20 ? (c as any).titulo.slice(0, 20) + '...' : (c as any).titulo}
              </button>
            ))}
          </div>

          {selectedCronograma && (
            <div className="space-y-3">
              {diasComPendentes.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-orange-300">
                        {diasComPendentes.length} dia{diasComPendentes.length !== 1 ? 's' : ''} com aulas pendentes
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Reagende para não perder o conteúdo</p>
                    </div>
                  </div>
                  <button onClick={handleReagendar} disabled={reagendando}
                    className="bg-orange-500 text-black text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all shrink-0">
                    <RefreshCw className={`w-4 h-4 ${reagendando ? 'animate-spin' : ''}`} />
                    {reagendando ? 'Reagendando...' : 'Reagendar'}
                  </button>
                </div>
              )}

              {dias.map((dia: any) => {
                const dataDia = new Date(dia.data + 'T00:00:00');
                const isPast = dataDia < hoje;
                const temPendentes = dia.aulas?.some((a: any) => !a.concluido);
                const borderColor = isPast && temPendentes
                  ? 'border-orange-500/40 bg-orange-500/5'
                  : isPast && !temPendentes
                    ? 'border-zinc-700/50 bg-zinc-900/40'
                    : 'border-zinc-800/80 bg-zinc-900/60';

                return (
                  <div key={dia.id} className={`rounded-2xl p-4 space-y-3 border transition-all ${borderColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${isPast && temPendentes ? 'text-orange-400' : 'text-orange-500'}`} />
                        <span className={`text-sm font-bold ${isPast && temPendentes ? 'text-orange-200' : 'text-zinc-100'}`}>
                          {dataDia.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                        {isPast && temPendentes && <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
                        {isPast && !temPendentes && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Clock className="w-3 h-3" />
                        <span>{dia.horas_previstas?.toFixed(1) || '0'}h</span>
                      </div>
                    </div>

                    {dia.aulas && dia.aulas.length > 0 && (
                      <div className="space-y-2">
                        {agruparPorDisciplina(dia.aulas).map(([disciplina, aulas]) => (
                          <div key={disciplina}>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1 ml-1">{disciplina}</p>
                            <div className="space-y-1">
                              {aulas.map((aula: any) => (
                                <div key={aula.id} className="flex items-center gap-2.5 bg-zinc-950/50 rounded-xl px-3 py-2">
                                  <button onClick={() => toggleAulaConcluida(aula.id, aula.concluido, aula.aula_id || undefined)}
                                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                                      aula.concluido ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700 hover:border-orange-500/50'
                                    }`}>
                                    {aula.concluido && <Check className="w-3 h-3 text-black stroke-[4px]" />}
                                  </button>
                                  <span className={`text-xs flex-1 ${aula.concluido ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                                    {aula.titulo_personalizado || 'Aula'}
                                  </span>
                                  {aula.materia_id && !aula.aula_id && (
                                    <span className="text-[9px] text-orange-500/60 font-bold uppercase tracking-wider mr-1">Matéria</span>
                                  )}
                                  {aula.duracao_minutos && (
                                    <span className="text-[10px] text-zinc-500 font-mono">{aula.duracao_minutos}min</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {(!dia.aulas || dia.aulas.length === 0) && (
                      <p className="text-[10px] text-zinc-600 text-center py-1">Sem aulas agendadas</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
