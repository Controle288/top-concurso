import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Play, HelpCircle, Calendar, MessageSquare, Brain } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Início' },
  { to: '/pdfs', icon: BookOpen, label: 'PDFs' },
  { to: '/videos', icon: Play, label: 'Vídeos' },
  { to: '/questoes', icon: HelpCircle, label: 'Questões' },
  { to: '/revisao', icon: Brain, label: 'Flashcards' },
  { to: '/cronograma', icon: Calendar, label: 'Cronograma' },
  { to: '/forum', icon: MessageSquare, label: 'Fórum' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 max-w-md mx-auto">
      <div className="flex items-center justify-around py-1.5 px-1 gap-0.5 overflow-x-auto scrollbar-none">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg transition-colors shrink-0 ${
                isActive ? 'text-orange-500' : 'text-zinc-500 hover:text-zinc-300'
              }`
            }
          >
            <item.icon className="w-4.5 h-4.5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
