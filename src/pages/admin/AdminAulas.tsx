import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, Film, Search, Download, Youtube, CheckSquare, Square, List } from 'lucide-react';
import { searchYouTubeVideos, searchYouTubePlaylists, getPlaylistVideos, searchChannelVideos, extractYoutubeId } from '@/lib/youtube';
import type { Aula, Concurso, Disciplina } from '@/types';

interface ImportVideo {
  id: string
  title: string
  thumbnailUrl: string
  channelTitle: string
  duration: string
  selected?: boolean
}

type ImportTab = 'videos' | 'playlist' | 'channel'

function parseDuration(duration: string): number {
  const parts = duration.split(':')
  if (parts.length === 3) return parseInt(parts[0]) * 60 + parseInt(parts[1])
  if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1])
  return 0
}

export default function AdminAulas() {
  const navigate = useNavigate();
  const [aulas, setAulas] = useState<(Aula & { concursos?: { titulo: string } | null })[]>([]);
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ titulo: '', descricao: '', concurso_id: '', disciplina_id: '', youtube_url: '', duracao_minutos: 0, instrutor: '', thumbnail_url: '' });

  const [showImport, setShowImport] = useState(false);
  const [importTab, setImportTab] = useState<ImportTab>('videos');
  const [importQuery, setImportQuery] = useState('');
  const [importConcurso, setImportConcurso] = useState('');
  const [importDisciplina, setImportDisciplina] = useState('');
  const [importResults, setImportResults] = useState<ImportVideo[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importing, setImporting] = useState(false);

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
    const youtubeId = extractYoutubeId(form.youtube_url) || '';
    const payload = { ...form, youtube_id: youtubeId, disciplina_id: form.disciplina_id || null };
    if (editing) {
      const { error } = await supabase.from('aulas').update(payload).eq('id', editing);
      if (error) return;
    } else {
      const { error } = await supabase.from('aulas').insert(payload);
      if (error) return;
    }
    resetForm();
    load();
  };

  const handleEdit = (a: Aula) => {
    setForm({ titulo: a.titulo, descricao: a.descricao || '', concurso_id: a.concurso_id || '', disciplina_id: a.disciplina_id || '', youtube_url: a.youtube_url, duracao_minutos: a.duracao_minutos, instrutor: a.instrutor || '', thumbnail_url: a.thumbnail_url || '' });
    setEditing(a.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta aula?')) return;
    const { error } = await supabase.from('aulas').delete().eq('id', id);
    if (error) return;
    load();
  };

  const handleSearch = async () => {
    if (!importQuery || !importConcurso) return;
    setImportLoading(true);
    setImportResults([]);

    let results: ImportVideo[] = []
    if (importTab === 'videos') {
      results = await searchYouTubeVideos(importQuery, 20)
    } else if (importTab === 'playlist') {
      const playlists = await searchYouTubePlaylists(importQuery, 5)
      if (playlists.length > 0) {
        results = await getPlaylistVideos(playlists[0].id, 50)
      }
    } else if (importTab === 'channel') {
      const channelId = importQuery.includes('/channel/')
        ? importQuery.split('/channel/')[1]?.split('/')[0] || importQuery
        : importQuery
      results = await searchChannelVideos(channelId, 50)
    }

    setImportResults(results.map(r => ({ ...r, selected: false })));
    setImportLoading(false);
  };

  const toggleSelect = (id: string) => {
    setImportResults(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r))
  }

  const toggleSelectAll = () => {
    const allSelected = importResults.every(r => r.selected)
    setImportResults(prev => prev.map(r => ({ ...r, selected: !allSelected })))
  }

  const importVideo = async (video: ImportVideo) => {
    const minutos = parseDuration(video.duration)
    const { error } = await supabase.from('aulas').insert({
      titulo: video.title,
      concurso_id: importConcurso,
      disciplina_id: importDisciplina || null,
      youtube_url: `https://www.youtube.com/watch?v=${video.id}`,
      youtube_id: video.id,
      duracao_minutos: minutos || 0,
      instrutor: video.channelTitle,
      thumbnail_url: video.thumbnailUrl,
    });
    return !error
  };

  const handleImportSelected = async () => {
    if (!importConcurso) return
    const selected = importResults.filter(r => r.selected)
    if (selected.length === 0) return
    setImporting(true)
    for (const video of selected) {
      await importVideo(video)
    }
    setImporting(false)
    load()
  }

  const handleImportAll = async () => {
    if (!importConcurso) return
    const all = importResults
    if (all.length === 0) return
    setImporting(true)
    for (const video of all) {
      await importVideo(video)
    }
    setImporting(false)
    load()
  }

  const handleImportSingle = async (video: ImportVideo) => {
    if (!importConcurso) return
    const ok = await importVideo(video)
    if (ok) {
      setImportResults(prev => prev.filter(r => r.id !== video.id))
      load()
    }
  }

  const selectedCount = importResults.filter(r => r.selected).length

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
          <button onClick={() => { setShowImport(true); setShowForm(false); setImportTab('videos'); setImportResults([]); setImportQuery(''); }}
            className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-orange-500 p-2.5 rounded-full transition-all"><Youtube className="w-5 h-5" /></button>
          <button onClick={() => { resetForm(); setShowForm(true); setShowImport(false); }} className="bg-orange-500 text-black p-2.5 rounded-full shadow-md hover:bg-orange-600 transition-all"><Plus className="w-5 h-5" /></button>
        </div>
      </div>

      {showImport && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Youtube className="w-4 h-4 text-red-500" /> Importar do YouTube</h3>
            {importResults.length > 0 && (
              <span className="text-[10px] text-zinc-500 font-mono">{importResults.length} vídeos</span>
            )}
          </div>

          <div className="flex gap-2">
            {(['videos', 'playlist', 'channel'] as const).map(tab => (
              <button key={tab} onClick={() => { setImportTab(tab); setImportResults([]); setImportQuery(''); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  importTab === tab
                    ? 'bg-orange-500 border-orange-500 text-black'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}>
                {tab === 'videos' ? 'Buscar' : tab === 'playlist' ? 'Playlist' : 'Canal'}
              </button>
            ))}
          </div>

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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={importTab === 'videos' ? 'Ex: Direito Constitucional PM BA...' : importTab === 'playlist' ? 'Ex: Curso Completo de Português...' : 'ID do canal (ex: UCX6b17PVsYBQ0ip5gyeme-Q)'}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
            <button onClick={handleSearch} disabled={importLoading || !importQuery || !importConcurso}
              className="bg-orange-500 text-black px-4 rounded-xl hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all"><Search className="w-5 h-5" /></button>
          </div>

          {importLoading && <p className="text-center text-zinc-500 text-sm py-4">Buscando vídeos...</p>}

          {importing && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center">
              <p className="text-xs text-orange-400 font-bold">Importando vídeos... aguarde</p>
            </div>
          )}

          {importResults.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <button onClick={toggleSelectAll} className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white transition-all">
                  {importResults.every(r => r.selected) ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                  {importResults.every(r => r.selected) ? 'Desmarcar todos' : 'Selecionar todos'}
                </button>
                {selectedCount > 0 && (
                  <button onClick={handleImportSelected} disabled={importing}
                    className="bg-orange-500 text-black text-[10px] font-extrabold px-3 py-1.5 rounded-lg hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all">
                    Importar {selectedCount} selecionado{selectedCount !== 1 ? 's' : ''}
                  </button>
                )}
                <button onClick={handleImportAll} disabled={importing}
                  className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all ml-auto">
                  Importar todos ({importResults.length})
                </button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {importResults.map(video => (
                  <div key={video.id} className="flex gap-3 bg-zinc-950/60 rounded-xl p-2.5 items-center">
                    <button onClick={() => toggleSelect(video.id)} className="shrink-0 text-zinc-500 hover:text-white">
                      {video.selected ? <CheckSquare className="w-4 h-4 text-orange-500" /> : <Square className="w-4 h-4" />}
                    </button>
                    <img src={video.thumbnailUrl} alt="" className="w-20 h-14 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-200 line-clamp-2">{video.title}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{video.channelTitle} • {video.duration}</p>
                    </div>
                    <button onClick={() => handleImportSingle(video)} disabled={importing}
                      className="bg-orange-500 text-black p-2 rounded-lg hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all shrink-0">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
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
                  <p className="text-[10px] text-zinc-500 mt-0.5">{a.concursos?.titulo || 'Sem concurso'} • {a.duracao_minutos}min • {a.instrutor || 'Sem instrutor'}</p>
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
