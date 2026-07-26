import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { ForumTopic, ForumComment } from '@/types';
import { MessageSquare, Plus, Send, X, ArrowLeft, MessageCircle, User, ThumbsUp } from 'lucide-react';

export default function Forum() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTopics = () => {
    supabase.from('forum_topics').select('*, profiles!forum_topics_user_id_fkey(nome)').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setTopics(data);
      setLoading(false);
    });
  };

  useEffect(() => { loadTopics(); }, []);

  const loadComments = (topicId: string) => {
    supabase.from('forum_comments').select('*, profiles!forum_comments_user_id_fkey(nome)').eq('topic_id', topicId).order('created_at', { ascending: true }).then(({ data }) => {
      if (data) setComments(data);
    });
  };

  const openTopic = (topic: ForumTopic) => {
    setSelectedTopic(topic);
    loadComments(topic.id);
  };

  const handleCreateTopic = async () => {
    if (!titulo.trim() || !descricao.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('forum_topics').insert({ user_id: user.id, titulo, descricao });
    setTitulo('');
    setDescricao('');
    setShowForm(false);
    loadTopics();
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !selectedTopic) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('forum_comments').insert({ topic_id: selectedTopic.id, user_id: user.id, conteudo: newComment });
    setNewComment('');
    loadComments(selectedTopic.id);
  };

  if (selectedTopic) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedTopic(null)} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-white truncate">{selectedTopic.titulo}</h2>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
            <User className="w-3 h-3" /> {(selectedTopic as any).profiles?.nome || 'Usuário'}
            <span>•</span>
            <span>{new Date(selectedTopic.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{selectedTopic.descricao}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-orange-500" />
            Comentários ({comments.length})
          </h3>

          {comments.map(c => (
            <div key={c.id} className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                <User className="w-3 h-3" /> {(c as any).profiles?.nome || 'Usuário'}
                <span>•</span>
                <span>{new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{c.conteudo}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          <button onClick={handleSendComment} disabled={!newComment.trim()}
            className="bg-orange-500 text-black p-3 rounded-xl disabled:bg-zinc-800 disabled:text-zinc-600 transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-wider block">COMUNIDADE</span>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            Fórum de Sugestões
          </h2>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-orange-500 text-black p-2.5 rounded-full shadow-[0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título do tópico..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva sua sugestão ou dúvida..." rows={4}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600 resize-none" />
          <div className="flex gap-3">
            <button onClick={handleCreateTopic} className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-extrabold py-3 rounded-xl transition-all">Criar Tópico</button>
            <button onClick={() => setShowForm(false)} className="px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded-xl transition-all"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-zinc-500 py-8">Carregando...</p>
      ) : topics.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm font-semibold">Nenhum tópico ainda.</p>
          <p className="text-xs text-zinc-500 mt-1">Crie o primeiro tópico!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {topics.map(t => (
            <div key={t.id} onClick={() => openTopic(t)} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 cursor-pointer hover:border-zinc-700/80 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-zinc-100 line-clamp-1">{t.titulo}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{t.descricao}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                  t.status === 'aberto' ? 'bg-emerald-500/10 text-emerald-400' :
                  t.status === 'em_andamento' ? 'bg-orange-500/10 text-orange-400' :
                  t.status === 'resolvido' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-zinc-800 text-zinc-500'
                }`}>
                  {t.status === 'em_andamento' ? 'Em andamento' : t.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-500">
                <User className="w-3 h-3" /> {(t as any).profiles?.nome || 'Usuário'}
                <span>•</span>
                <MessageCircle className="w-3 h-3" /> {(t as any).comentarios_count || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
