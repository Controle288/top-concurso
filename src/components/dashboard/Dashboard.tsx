import { useState, useEffect, memo, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, Flame, Check, Clock, BookOpen, HelpCircle,
  LogOut, User, Brain, Film, BarChart3, Bell, BellOff, Zap, Target, ChevronRight, ChevronDown, ChevronUp, Play
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthContext'
import { subscribeToPush, unsubscribeFromPush, isPushSubscribed } from '@/lib/notifications'
import { useTarefasDiarias, useToggleTarefa } from '@/lib/queries/useTarefasDiarias'
import { useQuestStats } from '@/lib/queries/useQuestaoRespostas'
import { useDashboardData } from '@/lib/queries/useDashboard'
import { useEstudoDiario } from '@/lib/queries/useEstudoDiario'
import NewsMural from './NewsMural'
import ConcursosAbertos from './ConcursosAbertos'
import GradePreview from './GradePreview'
import QuickActions from './QuickActions'
import CronogramaHoje from './CronogramaHoje'
import RevisoesPendentes from './RevisoesPendentes'
import PullToRefresh from '@/components/shared/PullToRefresh'

function RadialProgress({ pct, size = 48, stroke = 4, color }: { pct: number; size?: number; stroke?: number; color: string }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(39 39 42)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} className="transition-all duration-700" />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize={size * 0.28} fontWeight="900" fontFamily="monospace">
        {Math.round(pct)}%
      </text>
    </svg>
  )
}

const TaskItem = memo(function TaskItem({
  task,
  onToggle,
}: {
  task: { id: string; titulo: string; tipo: string; assunto: string; concluida: boolean; duracao: string }
  onToggle: (id: string, concluida: boolean) => void
}) {
  const tc = typeColor(task.tipo)
  return (
    <div
      onClick={() => onToggle(task.id, !task.concluida)}
      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
        task.concluida
          ? 'bg-zinc-900/30 border-zinc-800/30 opacity-60'
          : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/60'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all ${
          task.concluida ? 'bg-orange-500 border-orange-500' : 'border-zinc-700 bg-zinc-900/80'
        }`}>
          {task.concluida && <Check className="w-3 h-3 stroke-[4px] text-black" />}
        </div>
        <div className="space-y-1">
          <p className={`text-sm font-semibold transition-all ${task.concluida ? 'line-through text-zinc-600' : 'text-zinc-100'}`}>
            {task.titulo}
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${tc.bg} ${tc.text}`}>{task.tipo}</span>
            <span className="text-zinc-700 text-[10px]">•</span>
            <span className="text-[10px] text-zinc-600 font-medium">{task.assunto}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-zinc-600 font-mono text-[11px]">
        <Clock className="w-3 h-3" />
        <span>{task.duracao}</span>
      </div>
    </div>
  )
})

function UserMenuDropdown({ menuRef, avatarRef, profile, onClose, onNavigate, onLogout }: {
  menuRef: React.RefObject<HTMLDivElement | null>
  avatarRef: React.RefObject<HTMLButtonElement | null>
  profile: { nome?: string; role?: string } | null
  onClose: () => void
  onNavigate: (to: string) => void
  onLogout: () => void
}) {
  const [pos, setPos] = useState({ right: 0, top: 0 })

  useEffect(() => {
    const el = avatarRef.current
    if (el) {
      const rect = el.getBoundingClientRect()
      setPos({ right: window.innerWidth - rect.right, top: rect.bottom + 8 })
    }
  }, [avatarRef])

  return createPortal(
    <div
      ref={menuRef}
      className="fixed w-48 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fadeIn"
      style={{ right: pos.right, top: pos.top }}
    >
      <div className="p-3.5 border-b border-zinc-700/50">
        <p className="text-sm font-bold text-zinc-100 truncate">{profile?.nome || 'Usuário'}</p>
        <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{profile?.role === 'admin' ? 'Administrador' : 'Aluno'}</p>
      </div>
      <div className="p-1.5">
        <button onClick={() => { onClose(); onNavigate('/perfil'); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"><User className="w-4 h-4" /> Perfil</button>
        <button onClick={() => { onClose(); onNavigate('/tickets'); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"><HelpCircle className="w-4 h-4" /> Suporte</button>
        {profile?.role === 'admin' && (
          <button onClick={() => { onClose(); onNavigate('/admin'); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"><Zap className="w-4 h-4 text-orange-500" /> Painel Admin</button>
        )}
        <hr className="border-zinc-700/50 my-1" />
        <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-all"><LogOut className="w-4 h-4" /> Sair</button>
      </div>
    </div>,
    document.body
  )
}

function typeColor(type: string) {
  switch (type) {
    case 'Teoria': return { bg: 'bg-orange-500/10', text: 'text-orange-400' }
    case 'Revisão': return { bg: 'bg-purple-500/10', text: 'text-purple-400' }
    default: return { bg: 'bg-emerald-500/10', text: 'text-emerald-400' }
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { session, profile, refreshProfile } = useAuth()
  const userId = session?.user?.id
  const [showMenu, setShowMenu] = useState(false)
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | null>(null)
  const [pushSubscribed, setPushSubscribed] = useState(false)
  const [pushLoading, setPushLoading] = useState(false)
  const [tasksExpanded, setTasksExpanded] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)

  const { data: tasks = [], isLoading: tasksLoading } = useTarefasDiarias(userId)
  const { data: questStats = { total: 0, correct: 0, rate: 0 } } = useQuestStats(userId)
  const { data: dashboardData, refetch: refetchDashboard } = useDashboardData(userId)
  const { data: estudo = { minutosHoje: 0, streak: 0 } } = useEstudoDiario(userId)
  const toggleTarefa = useToggleTarefa()

  const aulasConcluidas = dashboardData?.aulasConcluidas ?? 0
  const concursoProgress = dashboardData?.concursoProgress ?? []

  const metaMinutos = 180
  const pctEstudo = Math.min(Math.round((estudo.minutosHoje / metaMinutos) * 100), 100)

  useEffect(() => {
    setNotifPermission(Notification.permission)
    isPushSubscribed().then(setPushSubscribed)
  }, [])

  useEffect(() => {
    if (!showMenu) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowMenu(false) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [showMenu])

  useEffect(() => {
    if (!showMenu) return
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        avatarRef.current && !avatarRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [showMenu])

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([
      refetchDashboard(),
      refreshProfile(),
    ])
    setRefreshing(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleToggleTask = useCallback((id: string, concluida: boolean) => {
    toggleTarefa.mutate({ id, concluida })
  }, [toggleTarefa])

  const solicitarNotificacao = async () => {
    setPushLoading(true)
    const ok = await subscribeToPush()
    if (ok) {
      setPushSubscribed(true)
      setNotifPermission('granted')
    }
    setPushLoading(false)
  }

  const desativarNotificacao = async () => {
    setPushLoading(true)
    await unsubscribeFromPush()
    setPushSubscribed(false)
    setPushLoading(false)
  }

  const completedTasks = tasks.filter(t => t.concluida).length
  const totalTasks = tasks.length
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
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
          <div className="flex items-center gap-2 relative">
            <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-orange-500/15 rounded-xl px-3 py-1.5">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500/30" />
              <span className="text-xs font-bold text-orange-500">{estudo.streak} DIAS</span>
            </div>
            <button ref={avatarRef} onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 bg-zinc-900/80 rounded-xl border border-zinc-800/60 flex items-center justify-center text-zinc-500 hover:text-orange-500 hover:border-orange-500/30 transition-all">
              <User className="w-4 h-4" />
            </button>
            {showMenu && <UserMenuDropdown
              menuRef={menuRef}
              avatarRef={avatarRef}
              profile={profile}
              onClose={() => setShowMenu(false)}
              onNavigate={navigate}
              onLogout={handleLogout}
            />}
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 animate-slideUp">
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-4">
            <RadialProgress pct={pctEstudo} color={estudo.minutosHoje >= metaMinutos ? '#22c55e' : '#f97316'} />
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Foco Hoje</p>
              <p className="text-lg font-black text-white font-mono">{estudo.minutosHoje}<span className="text-xs text-zinc-500 font-bold">/{metaMinutos}min</span></p>
              <p className="text-[10px] text-zinc-600 mt-0.5">{completedTasks} de {totalTasks} tarefas</p>
            </div>
          </div>

          {aulasConcluidas > 0 && (
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Film className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Vídeos</p>
                <p className="text-lg font-black text-white font-mono">{aulasConcluidas}</p>
                <p className="text-[10px] text-zinc-600">aulas concluídas</p>
              </div>
            </div>
          )}

          {questStats.total > 0 && (
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-4 col-span-2">
              <RadialProgress pct={questStats.rate} color={questStats.rate >= 70 ? '#22c55e' : '#f97316'} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Desempenho</p>
                <p className="text-sm font-bold text-white">{questStats.correct} acertos de {questStats.total} questões</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-emerald-400">{questStats.correct}</span>
                  <span className="text-xs text-zinc-600">|</span>
                  <span className="text-xs font-bold text-red-400">{questStats.total - questStats.correct}</span>
                  <span className="text-xs text-zinc-600">erros</span>
                </div>
              </div>
              <button onClick={() => navigate('/questoes')}
                className="bg-orange-500 text-black p-2.5 rounded-xl hover:bg-orange-600 transition-all shrink-0">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          )}

          {pushSubscribed ? (
            <button onClick={desativarNotificacao} disabled={pushLoading}
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-3 hover:border-zinc-700/60 text-left cursor-pointer disabled:opacity-50">
              <BellOff className="w-5 h-5 text-zinc-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-zinc-200">Notificações Ativas</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Clique para desativar</p>
              </div>
            </button>
          ) : notifPermission !== 'granted' && (
            <button onClick={solicitarNotificacao} disabled={pushLoading}
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-3 hover:border-zinc-700/60 text-left cursor-pointer disabled:opacity-50">
              <Bell className="w-5 h-5 text-orange-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-zinc-200">{pushLoading ? 'Ativando...' : 'Ativar Notificações'}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Receba lembretes de estudos</p>
              </div>
            </button>
          )}
        </div>

        {/* Cronograma Hoje */}
        <CronogramaHoje userId={userId} />

        {/* Revisões Pendentes */}
        <RevisoesPendentes userId={userId} />

        {/* Grade Curricular */}
        {concursoProgress.length > 0 && (
          <div className="space-y-3 animate-slideUp">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-500" />
                Grade Curricular
              </h3>
              <button onClick={() => navigate('/cronograma')} className="text-xs text-orange-500 font-bold flex items-center gap-1 hover:gap-1.5 transition-all">
                Cronograma <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {concursoProgress.map((cp: { id: string; titulo: string; total: number; concluido: number }) => (
                <GradePreview key={cp.id} concursoId={cp.id} titulo={cp.titulo} />
              ))}
            </div>
          </div>
        )}

        {/* Tarefas do Dia */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 animate-slideUp">
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
                tasks.map(task => (
                  <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
                ))
              )}
            </div>
          )}
        </div>

        <NewsMural />
        <ConcursosAbertos />
      </div>
    </PullToRefresh>
  )
}
