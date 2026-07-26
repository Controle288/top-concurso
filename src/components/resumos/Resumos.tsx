import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Resumo } from '@/types';
import { FileText, Plus, Edit3, Trash2, Save, X, BookOpen } from 'lucide-react';

export default function Resumos() {
  const [resumos, setResumos] = useState<Resumo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadResumos = () => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from('resumos').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }).then(({ data }) => {
        if (data) setResumos(data);
        setLoading(false);
      });
    });
  };

  useEffect(() => { loadResumos(); }, []);

  const handleSave = async () => {
    if (!titulo.trim() || !conteudo.trim()) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingId) {
      await supabase.from('resumos').update({ titulo, conteudo, updated_at: new Date().toISOString() }).eq('id', editingId);
    } else {
      await supabase.from('resumos').insert({ user_id: user.id, titulo, conteudo });
    }

    setTitulo('');
    setConteudo('');
    setEditingId(null);
    setShowForm(false);
    setSaving(false);
    loadResumos();
  };

  const handleEdit = (r: Resumo) => {
    setTitulo(r.titulo);
    setConteudo(r.conteudo);
    setEditingId(r.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('resumos').delete().eq('id', id);
    loadResumos();
  };

  const handleCancel = () => {
    setTitulo('');
    setConteudo('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-wider block">RESUMOS</span>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            Meus Resumos
          </h2>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setTitulo(''); setConteudo(''); }}
          className="bg-orange-500 text-black p-2.5 rounded-full shadow-[0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título do resumo..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          <textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva seu resumo aqui..." rows={8}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600 resize-none leading-relaxed" />
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar Resumo'}
            </button>
            <button onClick={handleCancel} className="px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded-xl flex items-center justify-center transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-zinc-500 py-8">Carregando...</p>
      ) : resumos.length === 0 && !showForm ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm font-semibold">Nenhum resumo ainda.</p>
          <p className="text-xs text-zinc-500 mt-1">Clique no botão + para criar seu primeiro resumo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumos.map((r) => (
            <div key={r.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-zinc-100">{r.titulo}</h3>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEdit(r)} className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-orange-500 transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-500 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap line-clamp-4">{r.conteudo}</p>
              <p className="text-[9px] text-zinc-600 font-mono">Atualizado em {new Date(r.updated_at).toLocaleDateString('pt-BR')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
