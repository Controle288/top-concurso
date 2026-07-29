import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useMaterias, useCriarMateria, useAtualizarMateria, useDeletarMateria } from '@/lib/queries/useMaterias';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, BookOpen, ChevronUp, ChevronDown } from 'lucide-react';
import type { Concurso, Disciplina } from '@/types';

export default function AdminMaterias() {
  const navigate = useNavigate();
  const [concursoId, setConcursoId] = useState('');
  const [disciplinaId, setDisciplinaId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [nome, setNome] = useState('');

  const { data: concursos = [] } = useQuery<Concurso[]>({
    queryKey: ['concursos'],
    queryFn: async () => {
      const { data } = await supabase.from('concursos').select('*').order('titulo');
      return data ?? [];
    },
  });

  const { data: disciplinas = [] } = useQuery<Disciplina[]>({
    queryKey: ['disciplinas_por_concurso', concursoId],
    queryFn: async () => {
      if (!concursoId) return [];
      const { data } = await supabase.from('disciplinas').select('*').eq('concurso_id', concursoId);
      return data ?? [];
    },
    enabled: !!concursoId,
  });

  const { data: materias = [], isLoading } = useMaterias(concursoId);
  const criar = useCriarMateria();
  const atualizar = useAtualizarMateria();
  const deletar = useDeletarMateria();

  const filteredMaterias = disciplinas.length > 0
    ? materias.filter(m => m.disciplina_id === (disciplinaId || m.disciplina_id))
    : concursoId ? materias : [];

  const resetForm = () => {
    setNome('');
    setEditing(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!nome.trim() || !concursoId || !disciplinaId) return;
    if (editing) {
      atualizar.mutate({ id: editing, nome: nome.trim() }, { onSuccess: resetForm });
    } else {
      const maxOrdem = materias.filter(m => m.disciplina_id === disciplinaId).length;
      criar.mutate(
        { concurso_id: concursoId, disciplina_id: disciplinaId, nome: nome.trim(), ordem: maxOrdem + 1 },
        { onSuccess: resetForm }
      );
    }
  };

  const handleEdit = (m: any) => {
    setNome(m.nome);
    setEditing(m.id);
    setDisciplinaId(m.disciplina_id);
    setShowForm(true);
  };

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    const sorted = [...filteredMaterias].sort((a, b) => a.ordem - b.ordem);
    const idx = sorted.findIndex(m => m.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;
    const current = sorted[idx];
    const target = sorted[targetIdx];
    atualizar.mutate({ id: current.id, ordem: target.ordem });
    atualizar.mutate({ id: target.id, ordem: current.ordem });
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">Admin</span>
            <h2 className="text-lg font-black text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-orange-500" /> Matérias</h2>
          </div>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} disabled={!concursoId}
          className="bg-orange-500 text-black p-2.5 rounded-full shadow-md hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-2">
        <select value={concursoId} onChange={(e) => { setConcursoId(e.target.value); setDisciplinaId(''); }}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50">
          <option value="">Selecione o concurso...</option>
          {concursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
        </select>
        {concursoId && (
          <select value={disciplinaId} onChange={(e) => setDisciplinaId(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50">
            <option value="">Todas disciplinas</option>
            {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
        )}
      </div>

      {showForm && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3 animate-fadeIn">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-500" /> {editing ? 'Editar Matéria' : 'Nova Matéria'}
          </h3>
          <select value={disciplinaId} onChange={(e) => setDisciplinaId(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50">
            <option value="">Selecione a disciplina...</option>
            {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
          <input value={nome} onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da matéria (ex: Regência Verbal)"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={!nome.trim() || !disciplinaId}
              className="flex-1 bg-orange-500 text-black font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-500 transition-all">
              <Save className="w-4 h-4" /> {editing ? 'Atualizar' : 'Adicionar'}
            </button>
            <button onClick={resetForm} className="px-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-center text-zinc-500 py-8">Carregando...</p> : !concursoId ? (
        <p className="text-center text-zinc-500 py-8">Selecione um concurso para gerenciar as matérias.</p>
      ) : filteredMaterias.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">Nenhuma matéria cadastrada. Crie a primeira!</p>
      ) : (
        <div className="space-y-2">
          {filteredMaterias.sort((a, b) => a.ordem - b.ordem).map(m => (
            <div key={m.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => handleReorder(m.id, 'up')} className="text-zinc-600 hover:text-zinc-300"><ChevronUp className="w-3 h-3" /></button>
                    <button onClick={() => handleReorder(m.id, 'down')} className="text-zinc-600 hover:text-zinc-300"><ChevronDown className="w-3 h-3" /></button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 font-mono">#{m.ordem}</span>
                      <h3 className="text-sm font-bold text-zinc-100">{m.nome}</h3>
                    </div>
                    <p className="text-[10px] text-zinc-500">
                      {m.disciplinas?.nome || 'Sem disciplina'} • {m.aulas?.length || 0} aula{(m.aulas?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEdit(m)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-orange-500"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm(`Excluir "${m.nome}"?`)) deletar.mutate(m.id); }}
                    className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
