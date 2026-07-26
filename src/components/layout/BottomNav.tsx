import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Play, HelpCircle, Calendar,
  MessageSquare, Brain, Crown
} from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Início' },
  { to: '/pdfs', icon: BookOpen, label: 'PDFs' },
  { to: '/videos', icon: Play, label: 'Vídeos' },
  { to: '/questoes', icon: HelpCircle, label: 'Questões' },
  { to: '/revisao', icon: Brain, label: 'Flashcards' },
  { to: '/cronograma', icon: Calendar, label: 'Cronograma' },
  { to: '/forum', icon: MessageSquare, label: 'Fórum' },
]

export default function BottomNav() {
  const { profile } = useAuth()

  return (
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
          <span className="text-[10px] font-bold tracking-wider">Premium</span>
        </NavLink>
      </div>
    </nav>
  )
}
