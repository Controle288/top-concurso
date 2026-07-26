import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'
import LoginPage from './Login'
import MobileFrame from './components/layout/MobileFrame'
import BottomNav from './components/layout/BottomNav'

const Dashboard = lazy(() => import('./components/dashboard/Dashboard'))
const PdfLibrary = lazy(() => import('./components/pdfs/PdfLibrary'))
const VideoLibrary = lazy(() => import('./components/videos/VideoLibrary'))
const Questions = lazy(() => import('./components/questoes/Questions'))
const Resumos = lazy(() => import('./components/resumos/Resumos'))
const CronogramaView = lazy(() => import('./components/cronograma/CronogramaView'))
const Forum = lazy(() => import('./components/forum/Forum'))
const Tickets = lazy(() => import('./components/tickets/Tickets'))
const Perfil = lazy(() => import('./components/perfil/Perfil'))
const RevisaoEspacada = lazy(() => import('./components/revisao/RevisaoEspacada'))
const Planos = lazy(() => import('./components/assinatura/Planos'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminConcursos = lazy(() => import('./pages/admin/AdminConcursos'))
const AdminUsuarios = lazy(() => import('./pages/admin/AdminUsuarios'))
const AdminQuestoes = lazy(() => import('./pages/admin/AdminQuestoes'))
const AdminAulas = lazy(() => import('./pages/admin/AdminAulas'))
const AdminPDFs = lazy(() => import('./pages/admin/AdminPDFs'))
const AdminForum = lazy(() => import('./pages/admin/AdminForum'))
const AdminTickets = lazy(() => import('./pages/admin/AdminTicketsAdmin'))

function AppRoutes() {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => {
          if (data) setProfile(data)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Carregando...</div>
  }

  if (!session) {
    return <LoginPage />
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <MobileFrame sidebarOpen={sidebarOpen}>
      <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pdfs" element={<PdfLibrary />} />
          <Route path="/videos" element={<VideoLibrary />} />
          <Route path="/questoes" element={<Questions />} />
          <Route path="/resumos" element={<Resumos />} />
          <Route path="/cronograma" element={<CronogramaView />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/revisao" element={<RevisaoEspacada />} />
          <Route path="/planos" element={<Planos />} />
          {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
          {isAdmin && <Route path="/admin/concursos" element={<AdminConcursos />} />}
          {isAdmin && <Route path="/admin/usuarios" element={<AdminUsuarios />} />}
          {isAdmin && <Route path="/admin/questoes" element={<AdminQuestoes />} />}
          {isAdmin && <Route path="/admin/aulas" element={<AdminAulas />} />}
          {isAdmin && <Route path="/admin/pdfs" element={<AdminPDFs />} />}
          {isAdmin && <Route path="/admin/forum" element={<AdminForum />} />}
          {isAdmin && <Route path="/admin/tickets" element={<AdminTickets />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <BottomNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} profile={profile} />
    </MobileFrame>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
