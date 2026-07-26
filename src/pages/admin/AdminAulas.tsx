import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, Film, Search, Download, Youtube } from 'lucide-react';
import { searchYouTubeVideos } from '@/lib/youtube';
import type { Concurso, Disciplina } from '@/types';

export default function AdminAulas() {
  const navigate = useNavigate();
  const [aulas, setAulas] = useState<any[]>([]);
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ titulo: '', descricao: '', concurso_id: '', disciplina_id: '', youtube_url: '', duracao_minutos: 0, instrutor: '', thumbnail_url: '' });

  const [showImport, setShowImport] = useState(false);
  const [importQuery, setImportQuery] = useState('');
  const [importConcurso, setImportConcurso] = useState('');
  const [importDisciplina, setImportDisciplina] = useState('');
  const [importResults, setImportResults] = useState<any[]>([]);
  const [importLoading, setImportLoading] = useState(false);

  const load = () => {
    supabase.from('aulas').select('*, concursos(titulo)').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setAulas(data); setLoading(false);
    });
    supabase.from('concursos').select('*').order('titulo').then(({ data }) => { if (data) setConcursos(data); });
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (form.concurso_id) {
      supabase.from('disciplinas').select('*').eq('concurso_id', form.concurso_id).then(({ data }) => {
        if (data) setDisciplinas(data);
      });
    } else {
      setDisciplinas([]);
    }
  }, [form.concurso_id]);

  const resetForm = () => { setForm({ titulo: '', descricao: '', concurso_id: '', disciplina_id: '', youtube_url: '', duracao_minutos: 0, instrutor: '', thumbnail_url: '' }); setEditing(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.titulo || !form.youtube_url) return;
    const youtubeId = form.youtube_url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] || '';
    const payload = { ...form, youtube_id: youtubeId, disciplina_id: form.disciplina_id || null };
    if (editing) {
      await supabase.from('aulas').update(payload).eq('id', editing);
    } else {
      await supabase.from('aulas').insert(payload);
    }
    resetForm();
    load();
  };

  const handleEdit = (a: any) => {
    setForm({ titulo: a.titulo, descricao: a.descricao || '', concurso_id: a.concurso_id || '', disciplina_id: a.disciplina_id || '', youtube_url: a.youtube_url, duracao_minutos: a.duracao_minutos, instrutor: a.instrutor || '', thumbnail_url: a.thumbnail_url || '' });
    setEditing(a.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta aula?')) return;
    await supabase.from('aulas').delete().eq('id', id);
    load();
  };

  const handleSearchYouTube = async () => {
    if (!importQuery || !importConcurso) return;
    setImportLoading(true);
    const results = await searchYouTubeVideos(importQuery, 15);
    setImportResults(results);
    setImportLoading(false);
  };

  const handleImportVideo = async (video: any) => {
    if (!importConcurso) return;
    const minutos = Math.round(parseInt(video.duration.split(':')[0]) * 60 + parseInt(video.duration.split(':')[1] || '0'));
    await supabase.from('aulas').insert({
      titulo: video.title,
      concurso_id: importConcurso,
      disciplina_id: importDisciplina || null,
      youtube_url: `https://www.youtube.com/watch?v=${video.id}`,
      youtube_id: video.id,
      duracao_minutos: minutos || 0,
      instrutor: video.channelTitle,
      thumbnail_url: video.thumbnailUrl,
    });
    load();
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">Admin</span>
            <h2 className="text-lg font-black text-white flex items-center gap-2"><Film className="w-5 h-5 text-orange-500" /> Aulas</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowImport(true); setShowForm(false); }} className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-orange-500 p-2.5 rounded-full transition-all"><Youtube className="w-5 h-5" /></button>
          <button onClick={() => { resetForm(); setShowForm(true); setShowImport(false); }} className="bg-orange-500 text-black p-2.5 rounded-full shadow-md hover:bg-orange-600 transition-all"><Plus className="w-5 h-5" /></button>
        </div>
      </div>

      {showImport && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2"><Youtube className="w-4 h-4 text-red-500" /> Importar do YouTube</h3>
          <select value={importConcurso} onChange={(e) => setImportConcurso(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50">
            <option value="">Selecione o concurso...</option>
            {concursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
          </select>
          <select value={importDisciplina} onChange={(e) => setImportDisciplina(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50">
            <option value="">Todas disciplinas</option>
            {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
          <div className="flex gap-2">
            <input value={importQuery} onChange={(e) => setImportQuery(e.target.value)}
              placeholder="Ex: Direito Constitucional PM BA..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
            <button onClick={handleSearchYouTube} disabled={importLoading || !importQuery || !importConcurso}
              className="bg-orange-500 text-black px-4 rounded-xl hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all"><Search className="w-5 h-5" /></button>
          </div>

          {importLoading && <p className="text-center text-zinc-500 text-sm py-4">Buscando vídeos...</p>}

          {importResults.length > 0 && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {importResults.map(video => (
                <div key={video.id} className="flex gap-3 bg-zinc-950/60 rounded-xl p-2.5 items-center">
                  <img src={video.thumbnailUrl} alt="" className="w-20 h-14 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-200 line-clamp-2">{video.title}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{video.channelTitle} • {video.duration}</p>
                  </div>
                  <button onClick={() => handleImportVideo(video)}
                    className="bg-orange-500 text-black p-2 rounded-lg hover:bg-orange-600 transition-all shrink-0">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
          <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título da aula" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          <input value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} placeholder="URL do YouTube" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.concurso_id} onChange={(e) => setForm({ ...form, concurso_id: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50">
              <option value="">Sem concurso</option>
              {concursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
            </select>
            <select value={form.disciplina_id} onChange={(e) => setForm({ ...form, disciplina_id: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50">
              <option value="">Sem disciplina</option>
              {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>
            <input type="number" value={form.duracao_minutos} onChange={(e) => setForm({ ...form, duracao_minutos: Number(e.target.value) })} placeholder="Duração (min)" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
            <input value={form.instrutor} onChange={(e) => setForm({ ...form, instrutor: e.target.value })} placeholder="Instrutor" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
            <input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="URL da thumbnail" className="col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          </div>
          <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição..." rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600 resize-none" />
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} className="flex-1 bg-orange-500 text-black font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all"><Save className="w-4 h-4" /> {editing ? 'Atualizar' : 'Criar'}</button>
            <button onClick={resetForm} className="px-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {loading ? <p className="text-center text-zinc-500 py-8">Carregando...</p> : aulas.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">Nenhuma aula cadastrada.</p>
      ) : (
        <div className="space-y-2">
          {aulas.map(a => (
            <div key={a.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-zinc-100">{a.titulo}</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{(a as any).concursos?.titulo || 'Sem concurso'} • {a.duracao_minutos}min • {a.instrutor || 'Sem instrutor'}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEdit(a)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-orange-500"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
