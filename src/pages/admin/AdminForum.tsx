import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Trash2, Check, X, User } from 'lucide-react';
import type { ForumTopic } from '@/types';

export default function AdminForum() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    supabase.from('forum_topics').select('*, profiles!forum_topics_user_id_fkey(nome)').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setTopics(data); setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('forum_topics').update({ status }).eq('id', id);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este tópico e todos os comentários?')) return;
    await supabase.from('forum_topics').delete().eq('id', id);
    load();
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">Admin</span>
          <h2 className="text-lg font-black text-white flex items-center gap-2"><MessageSquare className="w-5 h-5 text-orange-500" /> Fórum</h2>
        </div>
      </div>

      {loading ? <p className="text-center text-zinc-500 py-8">Carregando...</p> : topics.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">Nenhum tópico no fórum.</p>
      ) : (
        <div className="space-y-2">
          {topics.map(t => (
            <div key={t.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-zinc-100">{t.titulo}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{t.descricao}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-500">
                    <User className="w-3 h-3" /> {(t as any).profiles?.nome || 'Usuário'}
                    <span>•</span>
                    <span>{new Date(t.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <div className="flex gap-1">
                    {t.status !== 'resolvido' && (
                      <button onClick={() => updateStatus(t.id, 'resolvido')} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-emerald-400 hover:bg-emerald-500/10"><Check className="w-3.5 h-3.5" /></button>
                    )}
                    {t.status !== 'fechado' && (
                      <button onClick={() => updateStatus(t.id, 'fechado')} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-red-400 hover:bg-red-500/10"><X className="w-3.5 h-3.5" /></button>
                    )}
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <span className={`text-[9px] font-bold text-center px-2 py-0.5 rounded-full ${
                    t.status === 'aberto' ? 'bg-emerald-500/10 text-emerald-400' :
                    t.status === 'em_andamento' ? 'bg-orange-500/10 text-orange-400' :
                    t.status === 'resolvido' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-zinc-800 text-zinc-500'
                  }`}>
                    {t.status === 'em_andamento' ? 'Andamento' : t.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
