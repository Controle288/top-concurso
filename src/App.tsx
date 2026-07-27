import { useState, lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import LoginPage from './Login'
import MobileFrame from './components/layout/MobileFrame'
import DesktopSidebar from './components/layout/DesktopSidebar'
import BottomNav from './components/layout/BottomNav'
import ErrorBoundary from './lib/ErrorBoundary'
import Onboarding from './components/shared/Onboarding'
import { useStudyTimer } from './lib/useStudyTimer'

const Dashboard = lazy(() => import('./components/dashboard/Dashboard'))
const PdfLibrary = lazy(() => import('./components/pdfs/PdfLibrary'))
const VideoLibrary = lazy(() => import('./components/videos/VideoLibrary'))
const Questions = lazy(() => import('./components/questoes/Questions'))
const Cursos = lazy(() => import('./components/cursos/Cursos'))
const CursoDetalhe = lazy(() => import('./components/cursos/CursoDetalhe'))
const CursoPlayer = lazy(() => import('./components/cursos/CursoPlayer'))
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
const AdminCursos = lazy(() => import('./pages/admin/AdminCursos'))

const fallback = (
  <div className="flex items-center justify-center py-20">
    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

function AppContent() {
  const { session, profile, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  useStudyTimer(session?.user?.id)

  useEffect(() => {
    const shown = localStorage.getItem('topconcurso_onboarding')
    if (!shown && session?.user) {
      const signupTime = localStorage.getItem('topconcurso_signup_time')
      if (!signupTime) {
        setShowOnboarding(true)
        localStorage.setItem('topconcurso_signup_time', Date.now().toString())
      }
    }
  }, [session])

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Carregando...</div>
  }

  if (!session) {
    return <LoginPage />
  }

  const completeOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('topconcurso_onboarding', 'true')
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <>
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
      <DesktopSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MobileFrame sidebarOpen={sidebarOpen}>
        <Suspense fallback={fallback}>
          <Routes>
            <Route path="/" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
            <Route path="/pdfs" element={<ErrorBoundary><PdfLibrary /></ErrorBoundary>} />
            <Route path="/videos" element={<ErrorBoundary><VideoLibrary /></ErrorBoundary>} />
            <Route path="/cursos" element={<ErrorBoundary><Cursos /></ErrorBoundary>} />
            <Route path="/cursos/:id" element={<ErrorBoundary><CursoDetalhe /></ErrorBoundary>} />
            <Route path="/cursos/:id/:aulaId" element={<ErrorBoundary><CursoPlayer /></ErrorBoundary>} />
            <Route path="/questoes" element={<ErrorBoundary><Questions /></ErrorBoundary>} />
            <Route path="/resumos" element={<ErrorBoundary><Resumos /></ErrorBoundary>} />
            <Route path="/cronograma" element={<ErrorBoundary><CronogramaView /></ErrorBoundary>} />
            <Route path="/forum" element={<ErrorBoundary><Forum /></ErrorBoundary>} />
            <Route path="/tickets" element={<ErrorBoundary><Tickets /></ErrorBoundary>} />
            <Route path="/perfil" element={<ErrorBoundary><Perfil /></ErrorBoundary>} />
            <Route path="/revisao" element={<ErrorBoundary><RevisaoEspacada /></ErrorBoundary>} />
            <Route path="/planos" element={<ErrorBoundary><Planos /></ErrorBoundary>} />
            {isAdmin && <Route path="/admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />}
            {isAdmin && <Route path="/admin/concursos" element={<ErrorBoundary><AdminConcursos /></ErrorBoundary>} />}
            {isAdmin && <Route path="/admin/usuarios" element={<ErrorBoundary><AdminUsuarios /></ErrorBoundary>} />}
            {isAdmin && <Route path="/admin/questoes" element={<ErrorBoundary><AdminQuestoes /></ErrorBoundary>} />}
            {isAdmin && <Route path="/admin/aulas" element={<ErrorBoundary><AdminAulas /></ErrorBoundary>} />}
            {isAdmin && <Route path="/admin/pdfs" element={<ErrorBoundary><AdminPDFs /></ErrorBoundary>} />}
            {isAdmin && <Route path="/admin/forum" element={<ErrorBoundary><AdminForum /></ErrorBoundary>} />}
            {isAdmin && <Route path="/admin/tickets" element={<ErrorBoundary><AdminTickets /></ErrorBoundary>} />}
            {isAdmin && <Route path="/admin/cursos" element={<ErrorBoundary><AdminCursos /></ErrorBoundary>} />}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <BottomNav />
      </MobileFrame>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
