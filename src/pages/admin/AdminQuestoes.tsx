import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { Questao, Banca, Concurso, Disciplina } from '@/types';

const defaultAlternativas = [
  { key: 'A', text: '' }, { key: 'B', text: '' }, { key: 'C', text: '' }, { key: 'D', text: '' }, { key: 'E', text: '' }
];

export default function AdminQuestoes() {
  const navigate = useNavigate();
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [bancas, setBancas] = useState<Banca[]>([]);
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ enunciado: string; alternativas: { key: string; text: string }[]; correta: string; explicacao: string; banca_id: string; concurso_id: string; ano: number; nivel: string }>({ enunciado: '', alternativas: JSON.parse(JSON.stringify(defaultAlternativas)), correta: 'A', explicacao: '', banca_id: '', concurso_id: '', ano: 2026, nivel: 'superior' });

  const load = () => {
    supabase.from('questoes').select('*, bancas(nome)').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setQuestoes(data); setLoading(false);
    });
    supabase.from('bancas').select('*').then(({ data }) => { if (data) setBancas(data); });
    supabase.from('concursos').select('*').order('titulo').then(({ data }) => { if (data) setConcursos(data); });
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ enunciado: '', alternativas: JSON.parse(JSON.stringify(defaultAlternativas)), correta: 'A', explicacao: '', banca_id: '', concurso_id: '', ano: 2026, nivel: 'superior' }); setEditing(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.enunciado || !form.alternativas.some(a => a.text)) return;
    const payload = { ...form, alternativas: JSON.stringify(form.alternativas) };
    if (editing) {
      await supabase.from('questoes').update(payload).eq('id', editing);
    } else {
      await supabase.from('questoes').insert(payload);
    }
    resetForm();
    load();
  };

  const handleEdit = (q: Questao) => {
    const alts = typeof q.alternativas === 'string' ? JSON.parse(q.alternativas) : q.alternativas;
    setForm({ enunciado: q.enunciado, alternativas: alts.length === 5 ? alts : defaultAlternativas, correta: q.correta, explicacao: q.explicacao || '', banca_id: q.banca_id || '', concurso_id: q.concurso_id || '', ano: q.ano || 2026, nivel: q.nivel || 'superior' });
    setEditing(q.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta questão?')) return;
    await supabase.from('questoes').delete().eq('id', id);
    load();
  };

  const updateAlt = (idx: number, text: string) => {
    const alts = [...form.alternativas];
    alts[idx] = { ...alts[idx], text };
    setForm({ ...form, alternativas: alts });
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">Admin</span>
            <h2 className="text-lg font-black text-white">Questões</h2>
          </div>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-orange-500 text-black p-2.5 rounded-full shadow-md hover:bg-orange-600 transition-all"><Plus className="w-5 h-5" /></button>
      </div>

      {showForm && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          <textarea value={form.enunciado} onChange={(e) => setForm({ ...form, enunciado: e.target.value })} placeholder="Enunciado da questão..." rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600 resize-none" />
          {form.alternativas.map((alt, idx) => (
            <div key={alt.key} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 shrink-0">{alt.key}</span>
              <input value={alt.text} onChange={(e) => updateAlt(idx, e.target.value)} placeholder={`Alternativa ${alt.key}...`} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Correta</label>
              <select value={form.correta} onChange={(e) => setForm({ ...form, correta: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50">
                {['A','B','C','D','E'].map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Ano</label>
              <input type="number" value={form.ano} onChange={(e) => setForm({ ...form, ano: Number(e.target.value) })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Banca</label>
              <select value={form.banca_id} onChange={(e) => setForm({ ...form, banca_id: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50">
                <option value="">Sem banca</option>
                {bancas.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Concurso</label>
              <select value={form.concurso_id} onChange={(e) => setForm({ ...form, concurso_id: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50">
                <option value="">Sem concurso</option>
                {concursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
              </select>
            </div>
          </div>
          <textarea value={form.explicacao} onChange={(e) => setForm({ ...form, explicacao: e.target.value })} placeholder="Explicação da resposta..." rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600 resize-none" />
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} className="flex-1 bg-orange-500 text-black font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all"><Save className="w-4 h-4" /> {editing ? 'Atualizar' : 'Criar'}</button>
            <button onClick={resetForm} className="px-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {loading ? <p className="text-center text-zinc-500 py-8">Carregando...</p> : questoes.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">Nenhuma questão cadastrada.</p>
      ) : (
        <div className="space-y-2">
          {questoes.map(q => (
            <div key={q.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed">{q.enunciado}</p>
                  <div className="flex gap-1.5 mt-1.5">
                    <span className="bg-orange-500/10 text-orange-400 text-[9px] font-bold px-1.5 py-0.5 rounded">{(q as any).bancas?.nome || 'Sem banca'}</span>
                    {q.ano && <span className="bg-zinc-800 text-zinc-400 text-[9px] px-1.5 py-0.5 rounded">{q.ano}</span>}
                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded">{q.correta}</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEdit(q)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-orange-500"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(q.id)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
