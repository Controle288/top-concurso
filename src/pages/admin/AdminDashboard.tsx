import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, BookOpen, HelpCircle, MessageSquare, Ticket, FileText, Film, LogOut, TrendingUp, Briefcase, GraduationCap } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, concursos: 0, questoes: 0, aulas: 0, pdfs: 0, tickets: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('concursos').select('id', { count: 'exact', head: true }),
      supabase.from('questoes').select('id', { count: 'exact', head: true }),
      supabase.from('aulas').select('id', { count: 'exact', head: true }),
      supabase.from('pdfs').select('id', { count: 'exact', head: true }),
      supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('status', 'aberto'),
    ]).then(([users, concursos, questoes, aulas, pdfs, tickets]) => {
      setStats({
        users: users.count || 0,
        concursos: concursos.count || 0,
        questoes: questoes.count || 0,
        aulas: aulas.count || 0,
        pdfs: pdfs.count || 0,
        tickets: tickets.count || 0,
      });
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const menuItems = [
    { label: 'Concursos', icon: Briefcase, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', count: stats.concursos, path: '/admin/concursos' },
    { label: 'Usuários', icon: Users, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', count: stats.users, path: '/admin/usuarios' },
    { label: 'Questões', icon: HelpCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', count: stats.questoes, path: '/admin/questoes' },
    { label: 'Aulas', icon: Film, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', count: stats.aulas, path: '/admin/aulas' },
    { label: 'PDFs', icon: FileText, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', count: stats.pdfs, path: '/admin/pdfs' },
    { label: 'Fórum', icon: MessageSquare, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', count: 0, path: '/admin/forum' },
    { label: 'Tickets', icon: Ticket, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', count: stats.tickets, path: '/admin/tickets' },
  ];

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-wider block">ADMIN</span>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            Painel de Controle
          </h2>
        </div>
        <button onClick={handleLogout} className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-red-400 transition-all">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {menuItems.map((item) => (
          <button key={item.label} onClick={() => navigate(item.path)}
            className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col items-start gap-3 hover:border-zinc-700/80 transition-all text-left">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-zinc-100">{item.label}</span>
              <p className="text-lg font-black text-white font-mono">{item.count}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          Atalhos Rápidos
        </h3>
        <div className="space-y-2">
          <button onClick={() => navigate('/')} className="w-full text-left bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-300 hover:border-zinc-700 transition-all">
            ← Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
