import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Flame, Check, Clock, BookOpen, HelpCircle,
  LogOut, User, Brain, Film, BarChart3, Bell, Zap, Target, ChevronRight, ChevronDown, ChevronUp
} from 'lucide-react';
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
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);

  const defaultTasks = [
    { id: 't1', title: 'Estudar Controle de Constitucionalidade', type: 'Teoria', subject: 'Direito Constitucional', completed: false, duration: '45 min' },
    { id: 't2', title: 'Revisar Atos Administrativos', type: 'Revisão', subject: 'Direito Administrativo', completed: false, duration: '30 min' },
    { id: 't3', title: 'Resolver 15 Questões de Crase', type: 'Exercícios', subject: 'Língua Portuguesa', completed: false, duration: '40 min' },
    { id: 't4', title: 'Ler Lei 8.112/90 (Arts. 1º ao 20)', type: 'Teoria', subject: 'Direito Administrativo', completed: false, duration: '25 min' },
  ];

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
      new Notification('Top Concurso', { body: 'Notificações ativadas!', icon: '/icon.svg' });
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
    setTasksLoading(true);
    const saved = localStorage.getItem('topconcurso_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      setTasks(defaultTasks);
      localStorage.setItem('topconcurso_tasks', JSON.stringify(defaultTasks));
    }
    setTasksLoading(false);
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

  const typeColor = (type: string) => {
    switch (type) {
      case 'Teoria': return { bg: 'bg-orange-500/10', text: 'text-orange-400' };
      case 'Revisão': return { bg: 'bg-purple-500/10', text: 'text-purple-400' };
      default: return { bg: 'bg-emerald-500/10', text: 'text-emerald-400' };
    }
  };

  return (
    <div className="flex flex-col gap-5 py-4">
      {/* Header */}
      <div className="flex justify-between items-center animate-fadeIn">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {getGreeting()}, {profile?.nome || 'Guerreiro'}!
            <Sparkles className="w-5 h-5 text-orange-500 animate-pulse-glow" />
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">Vamos estudar com foco hoje!</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-orange-500/15 rounded-xl px-3 py-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500/30" />
            <span className="text-xs font-bold text-orange-500">7 DIAS</span>
          </div>
          <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 bg-zinc-900/80 rounded-xl border border-zinc-800/60 flex items-center justify-center text-zinc-500 hover:text-orange-500 hover:border-orange-500/30 transition-all">
            <User className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/60 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
              <div className="p-3.5 border-b border-zinc-800/50">
                <p className="text-sm font-bold text-zinc-100 truncate">{profile?.nome || 'Usuário'}</p>
                <p className="text-[11px] text-zinc-600 font-medium mt-0.5">{profile?.role === 'admin' ? 'Administrador' : 'Aluno'}</p>
              </div>
              <div className="p-1.5">
                <button onClick={() => { setShowMenu(false); navigate('/perfil'); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-xl transition-all"><User className="w-4 h-4" /> Perfil</button>
                <button onClick={() => { setShowMenu(false); navigate('/tickets'); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-xl transition-all"><HelpCircle className="w-4 h-4" /> Suporte</button>
                {profile?.role === 'admin' && (
                  <button onClick={() => { setShowMenu(false); navigate('/admin'); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-xl transition-all"><Zap className="w-4 h-4 text-orange-500" /> Painel Admin</button>
                )}
                <hr className="border-zinc-800/50 my-1" />
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-all"><LogOut className="w-4 h-4" /> Sair</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slideUp">
        {/* Foco Hoje */}
        <div className="card-glass p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-orange-500 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Foco Hoje
            </span>
            <h3 className="text-sm font-semibold text-zinc-100">Meta: 3h líquidas</h3>
            <p className="text-xs text-zinc-500">{completedTasks} de {totalTasks} tarefas</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-orange-500 font-mono">{completionPct}%</span>
          </div>
        </div>

        {/* Aulas */}
        {aulasConcluidas > 0 && (
          <div className="card-glass p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
              <Film className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{aulasConcluidas} aula{aulasConcluidas !== 1 ? 's' : ''} concluída{aulasConcluidas !== 1 ? 's' : ''}</p>
              <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">VIDEOAULAS</p>
            </div>
          </div>
        )}

        {/* Notificações */}
        {notifPermission !== 'granted' && (
          <button onClick={solicitarNotificacao} className="card-glass p-5 flex items-center gap-3 hover:border-zinc-700/60 text-left cursor-pointer">
            <Bell className="w-5 h-5 text-orange-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-zinc-200">Ativar Notificações</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Receba lembretes</p>
            </div>
          </button>
        )}

        {/* Desempenho */}
        {questStats.total > 0 && (
          <div className="card-glass p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-orange-500" />
                Desempenho
              </h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                questStats.rate >= 70 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
              }`}>{questStats.rate}%</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-zinc-900/50 rounded-xl p-3 text-center">
                <span className="text-xl font-black text-white font-mono">{questStats.total}</span>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Questões</p>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-3 text-center">
                <span className="text-xl font-black text-emerald-400 font-mono">{questStats.correct}</span>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Acertos</p>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-3 text-center">
                <span className="text-xl font-black text-red-400 font-mono">{questStats.total - questStats.correct}</span>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Erros</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progresso */}
      {concursoProgress.length > 0 && (
        <div className="card-glass p-5 animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              Progresso por Concurso
            </h3>
            <button onClick={() => navigate('/cronograma')} className="text-xs text-orange-500 font-bold flex items-center gap-1 hover:gap-1.5 transition-all">
              Ver tudo <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {concursoProgress.map((cp: { id: string; titulo: string; total: number; concluido: number }) => {
              const pct = cp.total > 0 ? Math.round((cp.concluido / cp.total) * 100) : 0;
              return (
                <div key={cp.id}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-400 font-medium truncate mr-2">{cp.titulo}</span>
                    <span className="text-zinc-600 font-mono text-[11px] shrink-0">{cp.concluido}/{cp.total}</span>
                  </div>
                  <div className="h-2.5 bg-zinc-800/60 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${
                      pct >= 70 ? 'bg-emerald-500' : pct >= 30 ? 'bg-orange-500' : 'bg-zinc-600'
                    }`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tarefas do Dia */}
      <div className="card-glass p-5 animate-slideUp">
        <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setTasksExpanded(!tasksExpanded)}>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Check className="w-4 h-4 text-orange-500" />
            Tarefas do Dia
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono font-bold">{completionPct}%</span>
            <button className="text-zinc-600 hover:text-zinc-400 transition-colors p-1">
              {tasksExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {tasksExpanded && (
          <div className="space-y-2.5 mt-4">
            {tasksLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-16 w-full" />)}
              </div>
            ) : (
              tasks.map((task) => {
                const tc = typeColor(task.type);
                return (
                  <div key={task.id} onClick={() => toggleTask(task.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                      task.completed
                        ? 'bg-zinc-900/30 border-zinc-800/30 opacity-60'
                        : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/60'
                    }`}>
                    <div className="flex items-center gap-3.5">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all ${
                        task.completed ? 'bg-orange-500 border-orange-500' : 'border-zinc-700 bg-zinc-900/80'
                      }`}>
                        {task.completed && <Check className="w-3 h-3 stroke-[4px] text-black" />}
                      </div>
                      <div className="space-y-1">
                        <p className={`text-sm font-semibold transition-all ${task.completed ? 'line-through text-zinc-600' : 'text-zinc-100'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${tc.bg} ${tc.text}`}>{task.type}</span>
                          <span className="text-zinc-700 text-[10px]">•</span>
                          <span className="text-[10px] text-zinc-600 font-medium">{task.subject}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-600 font-mono text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>{task.duration}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <NewsMural />
      <ConcursosAbertos />
    </div>
  );
}
