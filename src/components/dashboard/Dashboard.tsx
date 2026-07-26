import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Flame, Check, Clock, BookOpen, HelpCircle, LogOut, User, Target, Brain, Film, BarChart3, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import NewsMural from './NewsMural';
import ConcursosAbertos from './ConcursosAbertos';
import type { Profile } from '@/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [tasks, setTasks] = useState<{ id: string; title: string; type: string; subject: string; completed: boolean; duration: string }[]>([]);
  const [questStats, setQuestStats] = useState({ total: 0, correct: 0, rate: 0 });
  const [aulasConcluidas, setAulasConcluidas] = useState(0);
  const [concursoProgress, setConcursoProgress] = useState<{ id: string; titulo: string; total: number; concluido: number }[]>([]);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
          if (data) setProfile(data);
        });
      }
    });
    loadTasks();
    loadQuestStats();
    loadAulasConcluidas();
    loadConcursoProgress();
    setNotifPermission(Notification.permission);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const loadAulasConcluidas = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { count } = await supabase.from('aulas_concluidas').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    if (count !== null) setAulasConcluidas(count);
  };

  const solicitarNotificacao = async () => {
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (perm === 'granted') {
      new Notification('Top Concurso', { body: 'Notificações ativadas! Você será avisado sobre novos conteúdos.', icon: '/icon.svg' });
    }
  };

  const loadConcursoProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: concursos } = await supabase.from('concursos').select('id, titulo').limit(5);
    if (!concursos) return;
    const { data: todasAulas } = await supabase.from('aulas').select('id, concurso_id');
    if (!todasAulas) return;
    const { data: concluidas } = await supabase.from('aulas_concluidas').select('aula_id').eq('user_id', user.id);
    const setId = new Set(concluidas?.map(c => c.aula_id) || []);
    const progress: { id: string; titulo: string; total: number; concluido: number }[] = [];
    for (const c of concursos) {
      const aulasDoConcurso = todasAulas.filter(a => a.concurso_id === c.id);
      const total = aulasDoConcurso.length;
      if (total === 0) continue;
      const concluido = aulasDoConcurso.filter(a => setId.has(a.id)).length;
      progress.push({ id: c.id, titulo: c.titulo, total, concluido });
    }
    setConcursoProgress(progress);
  };

  const loadQuestStats = () => {
    const saved = localStorage.getItem('topconcurso_questoes');
    if (saved) {
      const history = JSON.parse(saved);
      const total = history.length;
      const correct = history.filter((h: any) => h.correct).length;
      const rate = total > 0 ? Math.round((correct / total) * 100) : 0;
      setQuestStats({ total, correct, rate });
    }
  };

  const loadTasks = () => {
    const saved = localStorage.getItem('topconcurso_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      const defaultTasks = [
        { id: 't1', title: 'Estudar Controle de Constitucionalidade', type: 'Teoria', subject: 'Direito Constitucional', completed: false, duration: '45 min' },
        { id: 't2', title: 'Revisar Atos Administrativos', type: 'Revisão', subject: 'Direito Administrativo', completed: false, duration: '30 min' },
        { id: 't3', title: 'Resolver 15 Questões de Crase', type: 'Exercícios', subject: 'Língua Portuguesa', completed: false, duration: '40 min' },
        { id: 't4', title: 'Ler Lei 8.112/90 (Arts. 1º ao 20)', type: 'Teoria', subject: 'Direito Administrativo', completed: false, duration: '25 min' },
      ];
      setTasks(defaultTasks);
      localStorage.setItem('topconcurso_tasks', JSON.stringify(defaultTasks));
    }
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    localStorage.setItem('topconcurso_tasks', JSON.stringify(updated));
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      <div className="flex justify-between items-center select-none">
        <div>
          <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider block">ÁREA DO ALUNO</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
            {getGreeting()}, {profile?.nome || 'Guerreiro'}! <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
          </h1>
        </div>
        <div className="relative flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-orange-500/20">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span className="text-sm font-bold text-orange-500">7 DIAS</span>
          </div>
          <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-orange-500 transition-all">
            <User className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-zinc-800">
                <p className="text-xs font-bold text-zinc-100 truncate">{profile?.nome || 'Usuário'}</p>
                <p className="text-[9px] text-zinc-500">{profile?.role === 'admin' ? 'Admin' : 'Aluno'}</p>
              </div>
              <div className="p-1.5 space-y-0.5">
                <button onClick={() => { setShowMenu(false); navigate('/resumos'); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 rounded-xl transition-all">
                  <BookOpen className="w-4 h-4 text-orange-500" /> Meus Resumos
                </button>
                <button onClick={() => { setShowMenu(false); navigate('/tickets'); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 rounded-xl transition-all">
                  <HelpCircle className="w-4 h-4 text-orange-500" /> Tickets
                </button>
                {profile?.role === 'admin' && (
                  <button onClick={() => { setShowMenu(false); navigate('/admin'); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 rounded-xl transition-all">
                    <User className="w-4 h-4 text-orange-500" /> Painel Admin
                  </button>
                )}
                <hr className="border-zinc-800 my-1" />
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-orange-500 font-bold text-xs uppercase tracking-wide">Foco Hoje</span>
          <h3 className="text-sm font-semibold text-zinc-100">Meta diária: 3h líquidas</h3>
          <p className="text-xs text-zinc-400">Complete suas tarefas para bater a meta!</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-orange-500 font-mono">{completedTasks}/{totalTasks}</span>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">TAREFAS OK</p>
        </div>
      </div>

      {concursoProgress.length > 0 && (
        <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              Progresso por Concurso
            </h3>
          </div>
          <div className="space-y-2.5">
            {concursoProgress.map(cp => {
              const pct = cp.total > 0 ? Math.round((cp.concluido / cp.total) * 100) : 0;
              return (
                <div key={cp.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-300 font-medium truncate mr-2">{cp.titulo.length > 25 ? cp.titulo.slice(0, 25) + '...' : cp.titulo}</span>
                    <span className="text-zinc-500 font-mono shrink-0">{cp.concluido}/{cp.total}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct >= 70 ? 'bg-emerald-500' : pct >= 30 ? 'bg-orange-500' : 'bg-zinc-600'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {notifPermission !== 'granted' && (
        <button onClick={solicitarNotificacao}
          className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-3 hover:border-zinc-700/80 transition-all">
          <Bell className="w-5 h-5 text-orange-500 shrink-0" />
          <div className="text-left">
            <p className="text-xs font-bold text-zinc-200">Ativar Notificações</p>
            <p className="text-[10px] text-zinc-500">Receba alertas de novos conteúdos e lembretes</p>
          </div>
        </button>
      )}

      <div className="space-y-3">
        {aulasConcluidas > 0 && (
          <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Film className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{aulasConcluidas} aula{aulasConcluidas !== 1 ? 's' : ''} concluída{aulasConcluidas !== 1 ? 's' : ''}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">VIDEOAULAS ASSISTIDAS</p>
            </div>
          </div>
        )}

        {questStats.total > 0 && (
          <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-orange-500" />
                Desempenho em Questões
              </h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${questStats.rate >= 70 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                {questStats.rate}%
              </span>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-zinc-800/50 rounded-xl p-3 text-center">
                <span className="text-lg font-black text-white font-mono">{questStats.total}</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-0.5">Questões</p>
              </div>
              <div className="flex-1 bg-zinc-800/50 rounded-xl p-3 text-center">
                <span className="text-lg font-black text-emerald-400 font-mono">{questStats.correct}</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-0.5">Acertos</p>
              </div>
              <div className="flex-1 bg-zinc-800/50 rounded-xl p-3 text-center">
                <span className="text-lg font-black text-red-400 font-mono">{questStats.total - questStats.correct}</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-0.5">Erros</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <NewsMural />
      <ConcursosAbertos />

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-md font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span>
            Tarefas do Dia
          </h2>
          <span className="text-xs text-orange-500 font-semibold font-mono">{completionPct}% Concluído</span>
        </div>
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                task.completed ? 'bg-zinc-900/30 border-zinc-900/50 text-zinc-500' : 'bg-zinc-900/70 border-zinc-800/70 text-zinc-200 hover:border-zinc-700/80'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  task.completed ? 'bg-orange-500 border-orange-500 text-black' : 'border-zinc-700 bg-zinc-950 group-hover:border-orange-500/50'
                }`}>
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[4px]" />}
                </div>
                <div className="space-y-0.5">
                  <p className={`text-sm font-semibold transition-all ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      task.type === 'Teoria' ? 'bg-orange-500/10 text-orange-400' :
                      task.type === 'Revisão' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {task.type}
                    </span>
                    <span className="text-zinc-500 text-[10px]">•</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{task.subject}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-zinc-500 font-mono text-xs">
                <Clock className="w-3 h-3 text-zinc-600" />
                <span>{task.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
