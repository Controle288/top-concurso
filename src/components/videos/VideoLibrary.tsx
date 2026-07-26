import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Aula, Questao } from '@/types';
import { Play, X, Film, Clock, User, Check, CheckCircle, Brain, ChevronRight } from 'lucide-react';
import { extractYoutubeId } from '@/lib/youtube';
import SectionHeader from '../shared/SectionHeader';
import EmptyState from '../shared/EmptyState';
import SearchBar from '../shared/SearchBar';

function getEmbedUrl(youtubeId: string) {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
}

export default function VideoLibrary() {
  const [aulas, setAulas] = useState<(Aula & { concluida?: boolean })[]>([]);
  const [concursos, setConcursos] = useState<{ id: string; titulo: string }[]>([]);
  const [disciplinas, setDisciplinas] = useState<{ id: string; nome: string; concurso_id?: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterConcurso, setFilterConcurso] = useState('');
  const [filterDisciplina, setFilterDisciplina] = useState('');
  const [selectedAula, setSelectedAula] = useState<(Aula & { concluida?: boolean }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [questoes, setQuestoes] = useState<(Questao & { selected?: string | null; answered?: boolean })[]>([]);
  const [questoesLoading, setQuestoesLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    Promise.all([
      supabase.from('concursos').select('id, titulo').order('titulo'),
      supabase.from('disciplinas').select('id, nome'),
    ]).then(([cRes, dRes]) => {
      if (cRes.data) setConcursos(cRes.data);
      if (dRes.data) setDisciplinas(dRes.data);
    });
  }, []);

  useEffect(() => {
    if (!userId) {
      supabase.from('aulas').select('*, disciplinas(nome)').order('created_at', { ascending: false }).then(({ data }) => {
        if (data) setAulas(data);
        setLoading(false);
      });
      return;
    }
    supabase.from('aulas').select('*, disciplinas(nome)').order('created_at', { ascending: false }).then(({ data: aulasData }) => {
      if (!aulasData) { setLoading(false); return; }
      supabase.from('aulas_concluidas').select('aula_id').eq('user_id', userId).then(({ data: concluidas }) => {
        const concluidaIds = new Set(concluidas?.map(c => c.aula_id) || []);
        setAulas(aulasData.map(a => ({ ...a, concluida: concluidaIds.has(a.id) })));
        setLoading(false);
      });
    });
  }, [userId]);

  useEffect(() => {
    if (filterConcurso) {
      supabase.from('disciplinas').select('*').eq('concurso_id', filterConcurso).then(({ data }) => {
        if (data) setDisciplinas(data);
      });
    }
  }, [filterConcurso]);

  const aulasFiltradas = aulas.filter(a => {
    const matchSearch = a.titulo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchConcurso = !filterConcurso || a.concurso_id === filterConcurso;
    const matchDisciplina = !filterDisciplina || a.disciplina_id === filterDisciplina;
    return matchSearch && matchConcurso && matchDisciplina;
  });

  const handleToggleConcluida = async (aula: Aula & { concluida?: boolean }) => {
    if (!userId) return;
    if (aula.concluida) {
      await supabase.from('aulas_concluidas').delete().eq('user_id', userId).eq('aula_id', aula.id);
    } else {
      await supabase.from('aulas_concluidas').insert({ user_id: userId, aula_id: aula.id }).maybeSingle();
      const { data: cronoAulas } = await supabase.from('cronograma_aulas')
        .select('id, cronograma_dia_id')
        .eq('aula_id', aula.id);
      if (cronoAulas && cronoAulas.length > 0) {
        const diaIds = [...new Set(cronoAulas.map(ca => ca.cronograma_dia_id))];
        const { data: dias } = await supabase.from('cronograma_dias')
          .select('id, cronograma_id')
          .in('id', diaIds);
        if (dias) {
          const cronoIds = [...new Set(dias.map(d => d.cronograma_id))];
          const { data: cronogramas } = await supabase.from('cronogramas')
            .select('id')
            .in('id', cronoIds)
            .eq('user_id', userId);
          if (cronogramas) {
            const meusCronoDiaIds = dias.filter(d => cronogramas.some(c => c.id === d.cronograma_id)).map(d => d.id);
            const minhasCronoAulas = cronoAulas.filter(ca => meusCronoDiaIds.includes(ca.cronograma_dia_id));
            for (const ca of minhasCronoAulas) {
              await supabase.from('cronograma_aulas').update({ concluido: true }).eq('id', ca.id);
            }
          }
        }
      }
    }
    setAulas(prev => prev.map(a => a.id === aula.id ? { ...a, concluida: !aula.concluida } : a));
    if (selectedAula?.id === aula.id) setSelectedAula(prev => prev ? { ...prev, concluida: !aula.concluida } : null);
  };

  const openAula = async (aula: Aula & { concluida?: boolean }) => {
    setSelectedAula(aula);
    setQuestoes([]);
    if (!aula.disciplina_id) return;
    setQuestoesLoading(true);
    const { data } = await supabase.from('questoes')
      .select('*, bancas(nome)')
      .eq('disciplina_id', aula.disciplina_id)
      .limit(15);
    if (data) setQuestoes(data.map(q => ({ ...q, selected: null, answered: false })));
    setQuestoesLoading(false);
  };

  const responderQuestao = (index: number, key: string) => {
    setQuestoes(prev => prev.map((q, i) =>
      i === index ? { ...q, selected: q.answered ? q.selected : key } : q
    ));
  };

  const confirmarResposta = (index: number) => {
    setQuestoes(prev => prev.map((q, i) =>
      i === index ? { ...q, answered: true } : q
    ));
  };

  return (
    <div className="flex flex-col gap-5 py-4">
      <SectionHeader icon={Film} title="Videoaulas" subtitle="Assista e marque como concluído" />

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Buscar aulas..." />

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <select value={filterConcurso} onChange={(e) => { setFilterConcurso(e.target.value); setFilterDisciplina(''); }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 whitespace-nowrap">
          <option value="">Todos Concursos</option>
          {concursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
        </select>
        <select value={filterDisciplina} onChange={(e) => setFilterDisciplina(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 whitespace-nowrap">
          <option value="">Todas Disciplinas</option>
          {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skeleton h-64 w-full rounded-2xl" />)}
        </div>
      ) : aulasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aulasFiltradas.map((aula) => (
            <div key={aula.id} onClick={() => openAula(aula)}
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden cursor-pointer hover:border-zinc-700/80 transition-all group relative">
              {aula.concluida && (
                <div className="absolute top-2 left-2 z-10 bg-emerald-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                  <Check className="w-3 h-3 stroke-[4px]" /> Concluída
                </div>
              )}
              <div className="relative h-40 bg-zinc-800">
                {aula.thumbnail_url ? (
                  <img src={aula.thumbnail_url} alt={aula.titulo} className={`w-full h-full object-cover transition-all ${aula.concluida ? 'brightness-[0.3]' : 'brightness-[0.6] group-hover:brightness-[0.4]'}`} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-12 h-12 text-zinc-700" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform ${aula.concluida ? 'bg-emerald-500/90' : 'bg-orange-500/90'}`}>
                    {aula.concluida ? <CheckCircle className="w-7 h-7 text-black" /> : <Play className="w-6 h-6 text-black fill-black ml-0.5" />}
                  </div>
                </div>
                {aula.duracao_minutos > 0 && (
                  <span className="absolute bottom-2 right-2 bg-black/80 text-zinc-300 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {aula.duracao_minutos}min
                  </span>
                )}
              </div>
              <div className="p-3.5 space-y-1">
                <h3 className="text-sm font-bold text-zinc-100 line-clamp-2">{aula.titulo}</h3>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  {aula.instrutor && <span className="flex items-center gap-1"><User className="w-3 h-3" />{aula.instrutor}</span>}
                  {(aula as Aula & { disciplinas?: { nome: string } }).disciplinas?.nome && <span className="text-orange-400/80 font-semibold">{(aula as Aula & { disciplinas?: { nome: string } }).disciplinas?.nome}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Film} title="Nenhuma aula encontrada" description="Tente ajustar os filtros ou buscar por outro termo" />
      )}

      {selectedAula && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-zinc-950/90 shrink-0">
            <h3 className="text-sm font-bold text-white truncate flex-1 mr-2">{selectedAula.titulo}</h3>
            <button onClick={() => setSelectedAula(null)} className="bg-zinc-900 p-2 rounded-full text-zinc-400 hover:text-white shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-black shrink-0" style={{ height: '35vh' }}>
            <iframe
              src={getEmbedUrl(selectedAula.youtube_id || extractYoutubeId(selectedAula.youtube_url) || selectedAula.youtube_url)}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
              style={{ border: 'none' }}
              title={selectedAula.titulo}
            />
          </div>

          <div className="p-3 bg-zinc-950/90 border-t border-zinc-800/50 shrink-0">
            <button onClick={() => handleToggleConcluida(selectedAula)}
              className={`w-full py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                selectedAula.concluida
                  ? 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
                  : 'bg-emerald-500 text-black hover:bg-emerald-600 shadow-[0_4px_20px_rgba(16,185,129,0.3)]'
              }`}>
              {selectedAula.concluida ? <><X className="w-4 h-4" /> Desmarcar Concluída</> : <><Check className="w-4 h-4 stroke-[3px]" /> Marcar como Concluída</>}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {(selectedAula as Aula & { disciplinas?: { nome: string } }).disciplinas?.nome && questoes.length > 0 && (
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Praticar — {questoes.length} questões sobre {(selectedAula as Aula & { disciplinas?: { nome: string } }).disciplinas?.nome}
                </span>
              </div>
            )}

            {questoesLoading && (
              <p className="text-center text-zinc-500 text-sm py-4">Carregando questões...</p>
            )}

            {!questoesLoading && questoes.length === 0 && selectedAula.disciplina_id && (
              <div className="text-center py-6">
                <Brain className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                <p className="text-zinc-500 text-xs">Nenhuma questão disponível para esta disciplina.</p>
              </div>
            )}

            {questoes.map((q, idx) => (
              <div key={q.id} className="bg-zinc-900/70 border border-zinc-800/70 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="bg-orange-600/10 text-orange-400 text-[10px] font-extrabold px-2 py-0.5 rounded shrink-0 mt-0.5">Q{idx + 1}</span>
                  <p className="text-xs text-zinc-200 leading-relaxed">{q.enunciado}</p>
                </div>

                <div className="space-y-1.5">
                  {q.alternativas.map(alt => {
                    const isSelected = q.selected === alt.key;
                    const isCorrect = q.answered && alt.key === q.correta;
                    const isWrong = q.answered && isSelected && alt.key !== q.correta;

                    let style = 'bg-zinc-950/50 border-zinc-800 text-zinc-300';
                    if (isSelected && !q.answered) style = 'bg-orange-500/10 border-orange-500/50 text-orange-200';
                    else if (isCorrect) style = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200';
                    else if (isWrong) style = 'bg-red-500/10 border-red-500/50 text-red-200';
                    else if (q.answered) style = 'bg-zinc-950/20 border-zinc-800/30 text-zinc-600';

                    return (
                      <button key={alt.key} onClick={() => responderQuestao(idx, alt.key)}
                        disabled={q.answered}
                        className={`w-full text-left px-3 py-2 rounded-xl border flex items-center gap-2.5 transition-all ${style}`}>
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isCorrect ? 'bg-emerald-500 text-black' :
                          isWrong ? 'bg-red-500 text-black' :
                          'bg-zinc-900 border border-zinc-700 text-zinc-400'
                        }`}>
                          {isCorrect ? <Check className="w-3 h-3 stroke-[4px]" /> : isWrong ? <X className="w-3 h-3 stroke-[4px]" /> : alt.key}
                        </span>
                        <span className="text-[11px] leading-relaxed">{alt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {!q.answered && q.selected && (
                  <button onClick={() => confirmarResposta(idx)}
                    className="bg-orange-500 text-black text-xs font-extrabold px-4 py-2 rounded-xl hover:bg-orange-600 transition-all flex items-center gap-1.5">
                    Ver Resposta <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {q.answered && q.explicacao && (
                  <div className="bg-zinc-950/60 border border-zinc-800/50 rounded-xl p-3">
                    <p className="text-[10px] text-orange-400 font-extrabold uppercase tracking-wider mb-1">Explicação</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">{q.explicacao}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
