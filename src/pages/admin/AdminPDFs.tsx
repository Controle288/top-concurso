import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, FileText } from 'lucide-react';
import type { Concurso } from '@/types';

export default function AdminPDFs() {
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ titulo: '', tipo: 'PDF' as string, concurso_id: '', descricao: '', url: '', size_or_duration: '' });

  const load = () => {
    supabase.from('pdfs').select('*, concursos(titulo)').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setPdfs(data); setLoading(false);
    });
    supabase.from('concursos').select('*').order('titulo').then(({ data }) => { if (data) setConcursos(data); });
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ titulo: '', tipo: 'PDF', concurso_id: '', descricao: '', url: '', size_or_duration: '' }); setEditing(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.titulo || !form.url) return;
    if (editing) {
      await supabase.from('pdfs').update(form).eq('id', editing);
    } else {
      await supabase.from('pdfs').insert(form);
    }
    resetForm();
    load();
  };

  const handleEdit = (p: any) => {
    setForm({ titulo: p.titulo, tipo: p.tipo, concurso_id: p.concurso_id || '', descricao: p.descricao || '', url: p.url, size_or_duration: p.size_or_duration || '' });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este material?')) return;
    await supabase.from('pdfs').delete().eq('id', id);
    load();
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">Admin</span>
            <h2 className="text-lg font-black text-white flex items-center gap-2"><FileText className="w-5 h-5 text-orange-500" /> PDFs</h2>
          </div>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-orange-500 text-black p-2.5 rounded-full shadow-md hover:bg-orange-600 transition-all"><Plus className="w-5 h-5" /></button>
      </div>

      {showForm && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
          <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título do material" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50">
              <option value="PDF">PDF</option>
              <option value="Audio">Áudio</option>
              <option value="Resumo">Resumo</option>
              <option value="Lei Seca">Lei Seca</option>
            </select>
            <select value={form.concurso_id} onChange={(e) => setForm({ ...form, concurso_id: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50">
              <option value="">Sem concurso</option>
              {concursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
            </select>
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="URL do material" className="col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
            <input value={form.size_or_duration} onChange={(e) => setForm({ ...form, size_or_duration: e.target.value })} placeholder="Ex: 2.4 MB • 15 págs" className="col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          </div>
          <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição..." rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600 resize-none" />
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} className="flex-1 bg-orange-500 text-black font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all"><Save className="w-4 h-4" /> {editing ? 'Atualizar' : 'Criar'}</button>
            <button onClick={resetForm} className="px-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {loading ? <p className="text-center text-zinc-500 py-8">Carregando...</p> : pdfs.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">Nenhum material cadastrado.</p>
      ) : (
        <div className="space-y-2">
          {pdfs.map(p => (
            <div key={p.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-zinc-100">{p.titulo}</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    <span className="bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded mr-1.5">{p.tipo}</span>
                    {(p as any).concursos?.titulo || 'Sem concurso'} {p.size_or_duration && `• ${p.size_or_duration}`}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEdit(p)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-orange-500"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
