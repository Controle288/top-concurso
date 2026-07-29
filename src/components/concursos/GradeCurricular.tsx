import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useMaterias } from '@/lib/queries/useMaterias';
import { useAulasConcluidasList } from '@/lib/queries/useAulas';
import { BookOpen, CheckCircle, Circle, Play, Clock, ChevronDown, ChevronRight, Film, BarChart3 } from 'lucide-react';

interface GradeCurricularProps {
  concursoId: string;
}

export default function GradeCurricular({ concursoId }: GradeCurricularProps) {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const { data: materias = [], isLoading } = useMaterias(concursoId);
  const { data: aulasConcluidas = [] } = useAulasConcluidasList(userId);
  const [expandedDisciplina, setExpandedDisciplina] = useState<string | null>(null);
  const [expandedMateria, setExpandedMateria] = useState<string | null>(null);

  const concluidaIds = new Set(aulasConcluidas);

  const grouped = materias.reduce((acc, m) => {
    const discNome = (m as any).disciplinas?.nome || 'Sem disciplina';
    if (!acc[discNome]) acc[discNome] = [];
    acc[discNome].push(m);
    return acc;
  }, {} as Record<string, typeof materias>);

  const totalMaterias = materias.length;
  const materiasComAula = materias.filter(m => (m.aulas?.length || 0) > 0).length;
  const materiasConcluidas = materias.filter(m =>
    (m.aulas || []).length > 0 && (m.aulas || []).every(a => concluidaIds.has(a.id))
  ).length;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 w-full rounded-2xl" />)}
      </div>
    );
  }

  if (materias.length === 0) {
    return (
      <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800/80 text-center">
        <BookOpen className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
        <p className="text-sm text-zinc-500">Grade curricular ainda não disponível para este concurso.</p>
        <p className="text-xs text-zinc-600 mt-1">O administrador precisa cadastrar as matérias.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-bold text-white">Grade Curricular</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
            <span className="text-lg font-black text-white font-mono">{totalMaterias}</span>
            <p className="text-[9px] text-zinc-500 uppercase font-bold">Tópicos</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
            <span className="text-lg font-black text-emerald-400 font-mono">{materiasComAula}</span>
            <p className="text-[9px] text-zinc-500 uppercase font-bold">Com Aula</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
            <span className="text-lg font-black text-orange-400 font-mono">{materiasConcluidas}</span>
            <p className="text-[9px] text-zinc-500 uppercase font-bold">Concluídas</p>
          </div>
        </div>
        <div className="mt-3 bg-zinc-800/40 rounded-xl h-2 overflow-hidden">
          <div className="bg-orange-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${totalMaterias > 0 ? (materiasComAula / totalMaterias) * 100 : 0}%` }} />
        </div>
        <p className="text-[10px] text-zinc-500 mt-1.5 text-center">
          {materiasComAula} de {totalMaterias} tópicos cobertos ({totalMaterias > 0 ? Math.round((materiasComAula / totalMaterias) * 100) : 0}%)
        </p>
      </div>

      {Object.entries(grouped).map(([discNome, mats]) => (
        <div key={discNome} className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden">
          <button
            onClick={() => setExpandedDisciplina(expandedDisciplina === discNome ? null : discNome)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-all"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-zinc-100">{discNome}</span>
              <span className="text-[10px] text-zinc-500 font-mono">({mats.length})</span>
            </div>
            {expandedDisciplina === discNome ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
          </button>

          {expandedDisciplina === discNome && (
            <div className="px-4 pb-3 space-y-1">
              {mats.sort((a, b) => a.ordem - b.ordem).map(m => {
                const temAula = (m.aulas?.length || 0) > 0;
                const totalAulas = m.aulas?.length || 0;
                const concluidas = m.aulas?.filter(a => concluidaIds.has(a.id)).length || 0;
                const concluida = temAula && m.aulas!.every(a => concluidaIds.has(a.id));
                const isExpanded = expandedMateria === m.id;

                return (
                  <div key={m.id} className={`rounded-xl border transition-all ${concluida ? 'bg-emerald-500/5 border-emerald-500/20' : temAula ? 'bg-zinc-900/40 border-zinc-800/60' : 'bg-red-500/5 border-red-500/20'}`}>
                    <button
                      onClick={() => setExpandedMateria(isExpanded ? null : m.id)}
                      className="w-full flex items-center gap-3 p-3"
                    >
                      {concluida ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : temAula ? (
                        <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${concluida ? 'text-emerald-300' : 'text-zinc-200'}`}>
                            {m.ordem}. {m.nome}
                          </span>
                          {!temAula && (
                            <span className="text-[8px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded-full font-bold uppercase">Sem aula</span>
                          )}
                        </div>
                        {temAula && (
                          <p className="text-[10px] text-zinc-500 mt-0.5">{concluidas}/{totalAulas} aulas concluídas</p>
                        )}
                      </div>
                      {temAula && (isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />)}
                    </button>

                    {isExpanded && m.aulas && m.aulas.length > 0 && (
                      <div className="px-3 pb-3 space-y-1.5">
                        {m.aulas.map(a => {
                          const concluida = concluidaIds.has(a.id);
                          return (
                            <a
                              key={a.id}
                              href={a.youtube_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2.5 bg-zinc-950/50 rounded-xl px-3 py-2 hover:bg-zinc-950/80 transition-all ${concluida ? 'opacity-70' : ''}`}
                            >
                              <div className={`w-8 h-6 rounded flex items-center justify-center shrink-0 ${concluida ? 'bg-emerald-500/20' : 'bg-orange-500/20'}`}>
                                {concluida ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3 h-3 text-orange-400 fill-orange-400 ml-0.5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[11px] font-semibold truncate ${concluida ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                                  {a.titulo}
                                </p>
                              </div>
                              {a.duracao_minutos > 0 && (
                                <span className="text-[9px] text-zinc-500 font-mono flex items-center gap-1 shrink-0">
                                  <Clock className="w-2.5 h-2.5" /> {a.duracao_minutos}min
                                </span>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function XCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
