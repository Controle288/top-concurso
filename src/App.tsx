import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'
import LoginPage from './Login'
import Dashboard from './components/dashboard/Dashboard'
import PdfLibrary from './components/pdfs/PdfLibrary'
import VideoLibrary from './components/videos/VideoLibrary'
import Questions from './components/questoes/Questions'
import Resumos from './components/resumos/Resumos'
import CronogramaView from './components/cronograma/CronogramaView'
import Forum from './components/forum/Forum'
import Tickets from './components/tickets/Tickets'
import Perfil from './components/perfil/Perfil'
import RevisaoEspacada from './components/revisao/RevisaoEspacada'
import MobileFrame from './components/layout/MobileFrame'
import BottomNav from './components/layout/BottomNav'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminConcursos from './pages/admin/AdminConcursos'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminQuestoes from './pages/admin/AdminQuestoes'
import AdminAulas from './pages/admin/AdminAulas'
import AdminPDFs from './pages/admin/AdminPDFs'
import AdminForum from './pages/admin/AdminForum'
import AdminTickets from './pages/admin/AdminTicketsAdmin'

function AppRoutes() {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

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
    <MobileFrame>
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
      <BottomNav />
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
