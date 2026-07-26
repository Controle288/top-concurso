import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { Questao } from '@/types';
import { Check, X, ChevronRight, Award, RotateCcw, AlertCircle, Sparkles, Trophy, Timer, Play } from 'lucide-react';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Questions() {
  const [questions, setQuestions] = useState<Questao[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Questao[]>([]);
  const [bancas, setBancas] = useState<{ id: string; nome: string }[]>([]);
  const [disciplinas, setDisciplinas] = useState<{ id: string; nome: string }[]>([]);
  const [concursos, setConcursos] = useState<{ id: string; titulo: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<{ id: string; correct: boolean }[]>([]);
  const [questionsSolved, setQuestionsSolved] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [filterBanca, setFilterBanca] = useState('');
  const [filterAno, setFilterAno] = useState('');
  const [filterDisciplina, setFilterDisciplina] = useState('');
  const [filterConcurso, setFilterConcurso] = useState('');
  const [loading, setLoading] = useState(true);
  const [modoProva, setModoProva] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [tempoTotal, setTempoTotal] = useState(0);
  const [provaAtiva, setProvaAtiva] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const TEMPO_POR_QUESTAO = 90;

  useEffect(() => {
    Promise.all([
      supabase.from('bancas').select('id, nome'),
      supabase.from('disciplinas').select('id, nome'),
      supabase.from('concursos').select('id, titulo'),
      supabase.from('questoes').select('*, bancas(nome), disciplinas(nome), concursos(titulo)').order('created_at', { ascending: false }),
    ]).then(([bancasRes, disciplinasRes, concursosRes, questoesRes]) => {
      if (bancasRes.data) setBancas(bancasRes.data);
      if (disciplinasRes.data) setDisciplinas(disciplinasRes.data);
      if (concursosRes.data) setConcursos(concursosRes.data);
      if (questoesRes.data) {
        setQuestions(questoesRes.data);
        setFilteredQuestions(questoesRes.data);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = questions;
    if (filterBanca) result = result.filter(q => q.banca_id === filterBanca);
    if (filterAno) result = result.filter(q => q.ano === parseInt(filterAno));
    if (filterDisciplina) result = result.filter(q => q.disciplina_id === filterDisciplina);
    if (filterConcurso) result = result.filter(q => q.concurso_id === filterConcurso);
    setFilteredQuestions(result);
    setCurrentIndex(0);
    setSelectedKey(null);
    setIsAnswered(false);
    setScoreHistory([]);
    setQuestionsSolved(0);
    setCorrectAnswers(0);
    if (timerRef.current) clearInterval(timerRef.current);
    setProvaAtiva(false);
    setTempoRestante(0);
  }, [filterBanca, filterAno, filterDisciplina, filterConcurso, questions]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const iniciarProva = () => {
    const total = filteredQuestions.length;
    if (total === 0) return;
    const segundos = total * TEMPO_POR_QUESTAO;
    setTempoTotal(segundos);
    setTempoRestante(segundos);
    setProvaAtiva(true);
    setCurrentIndex(0);
    setSelectedKey(null);
    setIsAnswered(false);
    setScoreHistory([]);
    setQuestionsSolved(0);
    setCorrectAnswers(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (provaAtiva && tempoRestante <= 0 && currentIndex < filteredQuestions.length) {
      handleNext();
    }
  }, [tempoRestante]);

  const currentQuestion = currentIndex < filteredQuestions.length ? filteredQuestions[currentIndex] : null;
  const isFinished = !provaAtiva && currentIndex >= filteredQuestions.length;

  const handleSelect = (key: string) => {
    if (isAnswered) return;
    setSelectedKey(key);
  };

  const handleAnswer = () => {
    if (!selectedKey || !currentQuestion || isAnswered) return;
    const isCorrect = selectedKey === currentQuestion.correta;
    setIsAnswered(true);
    setQuestionsSolved(prev => prev + 1);
    if (isCorrect) setCorrectAnswers(prev => prev + 1);
    setScoreHistory(prev => [...prev, { id: currentQuestion.id, correct: isCorrect }]);
    const saved = localStorage.getItem('topconcurso_questoes');
    const history = saved ? JSON.parse(saved) : [];
    history.push({ id: currentQuestion.id, correct: isCorrect, date: new Date().toISOString() });
    localStorage.setItem('topconcurso_questoes', JSON.stringify(history));
  };

  const handleNext = () => {
    if (provaAtiva && tempoRestante > 0) {
      if (!isAnswered && selectedKey) handleAnswer();
      else if (!isAnswered) {
        setScoreHistory(prev => [...prev, { id: currentQuestion?.id || '', correct: false }]);
      }
    }
    const next = currentIndex + 1;
    if (next >= filteredQuestions.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      setProvaAtiva(false);
    }
    setSelectedKey(null);
    setIsAnswered(false);
    setCurrentIndex(next);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedKey(null);
    setIsAnswered(false);
    setScoreHistory([]);
    setQuestionsSolved(0);
    setCorrectAnswers(0);
    if (timerRef.current) clearInterval(timerRef.current);
    setProvaAtiva(false);
  };

  if (isFinished && currentIndex >= filteredQuestions.length && filteredQuestions.length > 0) {
    const total = filteredQuestions.length;
    const correctCount = scoreHistory.filter(h => h.correct).length;
    const rate = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return (
      <div className="flex flex-col gap-6 p-4 pb-24 text-center select-none">
        <div className="py-8 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
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
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4 pb-24">
      <div className="space-y-1">
        <span className="text-orange-500 text-xs font-bold uppercase tracking-wider block">QUESTÕES</span>
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Award className="w-5 h-5 text-orange-500" />
          Simulados
        </h2>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <select value={filterBanca} onChange={(e) => setFilterBanca(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 whitespace-nowrap">
          <option value="">Todas Bancas</option>
          {bancas.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
        </select>
        <select value={filterDisciplina} onChange={(e) => setFilterDisciplina(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 whitespace-nowrap">
          <option value="">Todas Disciplinas</option>
          {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
        <select value={filterConcurso} onChange={(e) => setFilterConcurso(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 whitespace-nowrap">
          <option value="">Todos Concursos</option>
          {concursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
        </select>
        <select value={filterAno} onChange={(e) => setFilterAno(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 whitespace-nowrap">
          <option value="">Todos Anos</option>
          {[2024, 2023, 2022, 2021, 2020].map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {!provaAtiva && filteredQuestions.length > 0 && (
        <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80">
          <div className="flex items-center gap-3 mb-3">
            <Timer className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm font-bold text-white">Modo Prova</p>
              <p className="text-[10px] text-zinc-400">{filteredQuestions.length} questões • {filteredQuestions.length * TEMPO_POR_QUESTAO / 60} min</p>
            </div>
          </div>
          <button onClick={() => { setModoProva(true); iniciarProva(); }}
            className="w-full bg-orange-500 text-black font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95">
            <Play className="w-5 h-5" /> Iniciar Simulado com Timer
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-zinc-500 py-8">Carregando questões...</p>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-sm font-semibold">Nenhuma questão encontrada com esses filtros.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center select-none bg-zinc-900/40 px-3.5 py-2.5 rounded-xl border border-zinc-800/50">
            <span className="text-zinc-400 text-xs font-bold font-mono uppercase tracking-wider">
              {provaAtiva ? 'PROVA' : 'QUESTÃO'} {currentIndex + 1} DE {filteredQuestions.length}
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
                    {(currentQuestion as any).bancas?.nome || 'Banca'}
                  </span>
                  {(currentQuestion as any).concursos?.titulo && (
                    <span className="bg-zinc-800 text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                      {(currentQuestion as any).concursos.titulo}
                    </span>
                  )}
                  {currentQuestion.ano && (
                    <span className="bg-zinc-800 text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded">{currentQuestion.ano}</span>
                  )}
                </div>
                <h2 className="text-md font-bold text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-orange-500 rounded-full"></span>
                  {(currentQuestion as any).disciplinas?.nome || 'Disciplina'}
                </h2>
              </div>

              <div className="bg-zinc-900/60 rounded-2xl p-5 border border-zinc-800/80 shadow-md">
                <p className="text-[14.5px] text-zinc-100 leading-relaxed font-normal">{currentQuestion.enunciado}</p>
              </div>

              <div className="space-y-2.5">
                {currentQuestion.alternativas.map((alt: { key: string; text: string }) => {
                  const isSelected = selectedKey === alt.key;
                  const showAsCorrect = isAnswered && alt.key === currentQuestion.correta;
                  const showAsWrong = isAnswered && isSelected && selectedKey !== currentQuestion.correta;

                  let buttonStyle = 'bg-zinc-900/70 border-zinc-800/80 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900';
                  let indicatorStyle = 'bg-zinc-950 border-zinc-700 text-zinc-400';

                  if (isSelected && !isAnswered) {
                    buttonStyle = 'bg-orange-500/10 border-orange-500 text-orange-200';
                    indicatorStyle = 'bg-orange-500 border-orange-500 text-black font-bold';
                  } else if (showAsCorrect) {
                    buttonStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-200';
                    indicatorStyle = 'bg-emerald-500 border-emerald-500 text-black';
                  } else if (showAsWrong) {
                    buttonStyle = 'bg-red-500/10 border-red-500 text-red-200';
                    indicatorStyle = 'bg-red-500 border-red-500 text-black';
                  } else if (isAnswered) {
                    buttonStyle = 'bg-zinc-900/20 border-zinc-900/50 text-zinc-600 opacity-60';
                    indicatorStyle = 'bg-zinc-950 border-zinc-800 text-zinc-700';
                  }

                  return (
                    <button key={alt.key} onClick={() => handleSelect(alt.key)} disabled={isAnswered}
                      className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3.5 transition-all duration-200 cursor-pointer ${buttonStyle}`}>
                      <div className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-xs font-semibold border transition-all ${indicatorStyle}`}>
                        {showAsCorrect ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : showAsWrong ? <X className="w-3.5 h-3.5 stroke-[3px]" /> : alt.key}
                      </div>
                      <span className="text-sm font-medium leading-relaxed">{alt.text}</span>
                    </button>
                  );
                })}
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

              <div className="pt-2">
                {provaAtiva && tempoRestante > 0 ? (
                  <button onClick={handleNext}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(249,115,22,0.35)] active:scale-95 transition-all cursor-pointer">
                    {currentIndex === filteredQuestions.length - 1 ? 'Ver Resultado Final' : 'Próxima Questão'}
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
                        {currentIndex === filteredQuestions.length - 1 ? 'Ver Resultado Final' : 'Próxima Questão'}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
