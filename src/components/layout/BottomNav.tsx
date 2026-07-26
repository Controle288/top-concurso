import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Play, HelpCircle, Calendar,
  MessageSquare, Brain, ChevronLeft, ChevronRight, Sparkles, LogOut, User, Crown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Início' },
  { to: '/pdfs', icon: BookOpen, label: 'PDFs' },
  { to: '/videos', icon: Play, label: 'Vídeos' },
  { to: '/questoes', icon: HelpCircle, label: 'Questões' },
  { to: '/revisao', icon: Brain, label: 'Flashcards' },
  { to: '/cronograma', icon: Calendar, label: 'Cronograma' },
  { to: '/forum', icon: MessageSquare, label: 'Fórum' },
];

export default function BottomNav({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void }) {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/50">
        <div className="flex items-center justify-around py-2 px-2 overflow-x-auto scrollbar-none gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  isActive ? 'text-orange-500' : 'text-zinc-600 hover:text-zinc-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-orange-500 rounded-full" />}
                  <item.icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]' : ''}`} />
                  <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
          <NavLink
            to="/planos"
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              profile?.assinatura_ativa ? 'text-orange-500' : 'text-zinc-600 hover:text-orange-400'
            }`}
          >
            <Crown className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-wider">{profile?.assinatura_ativa ? 'Premium' : 'Premium'}</span>
          </NavLink>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-screen z-50 flex-col bg-zinc-950/95 backdrop-blur-xl border-r border-zinc-800/50 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-56' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center h-14 border-b border-zinc-800/50 shrink-0 ${sidebarOpen ? 'px-5 justify-start' : 'px-0 justify-center'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20 shrink-0">
              <Sparkles className="w-4 h-4 text-orange-500" />
            </div>
            {sidebarOpen && (
              <span className="text-sm font-bold text-white tracking-tight whitespace-nowrap">
                Top <span className="text-orange-500">Concurso</span>
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto scrollbar-none">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center mx-2 rounded-xl transition-all group ${
                  sidebarOpen ? 'px-3 py-2.5 gap-3' : 'px-0 py-2.5 justify-center'
                } ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-500 border border-orange-500/15'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative shrink-0">
                    {isActive && sidebarOpen && (
                      <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 rounded-full" />
                    )}
                    <item.icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]' : ''}`} />
                  </div>
                  {sidebarOpen && (
                    <span className="text-sm font-semibold tracking-tight whitespace-nowrap">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Premium Banner */}
        <div className="border-t border-zinc-800/50 py-3 px-3">
          {profile?.assinatura_ativa ? (
            <NavLink to="/planos"
              className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2.5 text-orange-400 hover:bg-orange-500/15 transition-all">
              <Crown className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-bold">Premium</span>}
            </NavLink>
          ) : (
            <NavLink to="/planos"
              className="flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-orange-500/5 border border-orange-500/30 rounded-xl px-3 py-2.5 text-orange-400 hover:from-orange-500/30 hover:to-orange-500/10 transition-all group">
              <Crown className="w-5 h-5 shrink-0" />
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold block">Premium</span>
                  <span className="text-[10px] text-orange-500/70 font-medium">Ativar</span>
                </div>
              )}
            </NavLink>
          )}
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-800/50 py-3 space-y-1">
          {/* Collapse button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-full flex items-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60 rounded-xl transition-all mx-2 ${
              sidebarOpen ? 'px-3 py-2.5 gap-3 justify-start' : 'px-0 py-2.5 justify-center'
            }`}
            style={{ width: sidebarOpen ? 'calc(100% - 16px)' : 'auto' }}
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">Recolher</span>
              </>
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all mx-2 ${
              sidebarOpen ? 'px-3 py-2.5 gap-3 justify-start' : 'px-0 py-2.5 justify-center'
            }`}
            style={{ width: sidebarOpen ? 'calc(100% - 16px)' : 'auto' }}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
