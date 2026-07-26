import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { User, Save, Mail, Shield, LogOut, ArrowLeft, Calendar, CheckCircle, Film, Brain, Crown } from 'lucide-react';
import type { Profile } from '@/types';

export default function Perfil() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [stats, setStats] = useState({ questoes: 0, aulas: 0, cards: 0 });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || '');
        supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
          if (data) { setProfile(data); setNome(data.nome); }
        });
      }
    });

    const q = localStorage.getItem('topconcurso_questoes');
    const qTotal = q ? JSON.parse(q).length : 0;
    supabase.from('aulas_concluidas').select('*', { count: 'exact', head: true }).then(({ count }) => {
      const c = localStorage.getItem('topconcurso_flashcards');
      const cardsTotal = c ? JSON.parse(c).length : 0;
      setStats({ questoes: qTotal, aulas: count || 0, cards: cardsTotal });
    });
  }, []);

  const handleSave = async () => {
    if (!profile || !nome.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ nome: nome.trim() }).eq('id', profile.id);
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const dataCriacao = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '—';

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-orange-500 text-xs font-bold uppercase tracking-wider block">CONTA</span>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            Meu Perfil
          </h2>
        </div>
      </div>

      <div className="bg-zinc-900/60 rounded-2xl p-6 border border-zinc-800/80 flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center border-2 border-orange-500/30">
          <User className="w-8 h-8 text-orange-500" />
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-sm">{profile?.nome || 'Usuário'}</p>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">
            {profile?.role === 'admin' ? 'Administrador' : 'Aluno'}
          </p>
        </div>
      </div>

      <button onClick={() => navigate('/planos')}
        className={`card-glass p-4 flex items-center justify-between w-full text-left cursor-pointer hover:border-zinc-700/60 transition-all ${
          profile?.assinatura_ativa ? 'border-orange-500/40' : ''
        }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            profile?.assinatura_ativa ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-zinc-900 border border-zinc-800'
          }`}>
            <Crown className={`w-5 h-5 ${profile?.assinatura_ativa ? 'text-orange-500' : 'text-zinc-500'}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{profile?.assinatura_ativa ? 'Premium Ativo' : 'Plano Gratuito'}</p>
            <p className="text-[11px] text-zinc-500">{profile?.assinatura_ativa ? 'Aproveite todos os recursos' : 'Ative o Premium e desbloqueie tudo'}</p>
          </div>
        </div>
        <span className="text-xs text-orange-500 font-bold flex items-center gap-1">
          {profile?.assinatura_ativa ? 'Gerenciar' : 'Ver planos'} <ArrowLeft className="w-3 h-3 rotate-180" />
        </span>
      </button>

      <div className="card-glass-static p-4 space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <User className="w-3 h-3" /> Nome
          </label>
          <input value={nome} onChange={(e) => setNome(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Mail className="w-3 h-3" /> Email
          </label>
          <input value={email} disabled
            className="w-full bg-zinc-950/50 border border-zinc-800/50 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Membro desde
          </label>
          <p className="text-sm text-zinc-300 px-1">{dataCriacao}</p>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3" /> Tipo de conta
          </label>
          <p className="text-sm text-zinc-300 px-1 capitalize">{profile?.role === 'admin' ? 'Administrador' : profile?.assinatura_ativa ? 'Aluno Premium' : 'Aluno (Gratuito)'}</p>
        </div>

        <button onClick={handleSave} disabled={saving || !nome.trim()}
          className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all">
          {saved ? <><CheckCircle className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar'}</>}
        </button>
      </div>

      <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-orange-500" /> Estatísticas
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
            <Brain className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <span className="text-lg font-black text-white font-mono">{stats.questoes}</span>
            <p className="text-[9px] text-zinc-500 uppercase font-bold">Questões</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
            <Film className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-lg font-black text-white font-mono">{stats.aulas}</span>
            <p className="text-[9px] text-zinc-500 uppercase font-bold">Aulas</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
            <CheckCircle className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <span className="text-lg font-black text-white font-mono">{stats.cards}</span>
            <p className="text-[9px] text-zinc-500 uppercase font-bold">Cards</p>
          </div>
        </div>
      </div>

      <button onClick={handleLogout}
        className="w-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all active:scale-95">
        <LogOut className="w-5 h-5" /> Sair da Conta
      </button>
    </div>
  );
}
