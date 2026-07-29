import { useNavigate } from 'react-router-dom'
import { Play, HelpCircle, Calendar, RefreshCw } from 'lucide-react'

export default function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    { label: 'Estudar Agora', icon: Play, path: '/cronograma', color: 'bg-orange-500 text-black hover:bg-orange-600' },
    { label: 'Praticar Questões', icon: HelpCircle, path: '/questoes', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' },
    { label: 'Cronograma', icon: Calendar, path: '/cronograma', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20' },
    { label: 'Revisão', icon: RefreshCw, path: '/revisao', color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20' },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map(a => (
        <button key={a.label} onClick={() => navigate(a.path)}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${a.color}`}>
          <a.icon className="w-4 h-4" /> {a.label}
        </button>
      ))}
    </div>
  )
}
