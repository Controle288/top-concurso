import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { Concurso, Banca } from '@/types';

export default function AdminConcursos() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<{ titulo: string; orgao: string; banca_id: string; vagas: number; inscritos_estimados: number; data_prova: string; status: string; nivel: string; salario: number }>({ titulo: '', orgao: '', banca_id: '', vagas: 0, inscritos_estimados: 0, data_prova: '', status: 'aberto', nivel: 'superior', salario: 0 });

  const { data: concursos = [], isLoading } = useQuery<Concurso[]>({
    queryKey: ['concursos'],
    queryFn: async () => {
      const { data } = await supabase.from('concursos').select('*, bancas(nome)').order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const { data: bancas = [] } = useQuery<Banca[]>({
    queryKey: ['bancas'],
    queryFn: async () => {
      const { data } = await supabase.from('bancas').select('*');
      return data ?? [];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['concursos'] });

  const resetForm = () => { setForm({ titulo: '', orgao: '', banca_id: '', vagas: 0, inscritos_estimados: 0, data_prova: '', status: 'aberto', nivel: 'superior', salario: 0 }); setEditing(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.titulo || !form.orgao) return;
    if (editing) {
      await supabase.from('concursos').update(form).eq('id', editing);
    } else {
      await supabase.from('concursos').insert(form);
    }
    resetForm();
    invalidate();
  };

  const handleEdit = (c: Concurso) => {
    setForm({ titulo: c.titulo, orgao: c.orgao, banca_id: c.banca_id || '', vagas: c.vagas, inscritos_estimados: c.inscritos_estimados, data_prova: c.data_prova?.split('T')[0] || '', status: c.status, nivel: c.nivel || 'superior', salario: c.salario || 0 });
    setEditing(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este concurso?')) return;
    await supabase.from('concursos').delete().eq('id', id);
    invalidate();
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">Admin</span>
            <h2 className="text-lg font-black text-white">Concursos</h2>
          </div>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-orange-500 text-black p-2.5 rounded-full shadow-md hover:bg-orange-600 transition-all"><Plus className="w-5 h-5" /></button>
      </div>

      {showForm && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
          <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título do concurso" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.orgao} onChange={(e) => setForm({ ...form, orgao: e.target.value })} placeholder="Órgão" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
            <select value={form.banca_id} onChange={(e) => setForm({ ...form, banca_id: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50"><option value="">Sem banca</option>{bancas.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}</select>
            <input type="number" value={form.vagas} onChange={(e) => setForm({ ...form, vagas: Number(e.target.value) })} placeholder="Vagas" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
            <input type="number" value={form.inscritos_estimados} onChange={(e) => setForm({ ...form, inscritos_estimados: Number(e.target.value) })} placeholder="Inscritos estimados" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
            <input type="date" value={form.data_prova} onChange={(e) => setForm({ ...form, data_prova: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50"><option value="aberto">Aberto</option><option value="previsto">Previsto</option><option value="encerrado">Encerrado</option></select>
            <select value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value as any })} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50"><option value="fundamental">Fundamental</option><option value="medio">Médio</option><option value="tecnico">Técnico</option><option value="superior">Superior</option></select>
            <input type="number" value={form.salario} onChange={(e) => setForm({ ...form, salario: Number(e.target.value) })} placeholder="Salário" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} className="flex-1 bg-orange-500 text-black font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all"><Save className="w-4 h-4" /> {editing ? 'Atualizar' : 'Criar'}</button>
            <button onClick={resetForm} className="px-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center text-zinc-400 hover:text-white transition-all"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-center text-zinc-500 py-8">Carregando...</p> : concursos.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">Nenhum concurso cadastrado.</p>
      ) : (
        <div className="space-y-2">{concursos.map(c => (
          <div key={c.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0"><h3 className="text-sm font-bold text-zinc-100">{c.titulo}</h3><p className="text-[10px] text-zinc-500">{c.orgao} {(c as any).bancas?.nome && `• ${(c as any).bancas.nome}`}</p></div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleEdit(c)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-orange-500"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-zinc-400">
              <span className="bg-zinc-950 px-2 py-0.5 rounded">{c.vagas} vagas</span>
              <span className="bg-zinc-950 px-2 py-0.5 rounded">~{c.inscritos_estimados} insc.</span>
              {c.data_prova && <span className="bg-zinc-950 px-2 py-0.5 rounded">Prova: {new Date(c.data_prova).toLocaleDateString('pt-BR')}</span>}
              <span className={`px-2 py-0.5 rounded font-bold ${c.status === 'aberto' ? 'bg-emerald-500/10 text-emerald-400' : c.status === 'previsto' ? 'bg-orange-500/10 text-orange-400' : 'bg-zinc-800 text-zinc-500'}`}>{c.status}</span>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  );
}