import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { ShieldOff } from 'lucide-react'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-zinc-500">
        <ShieldOff className="w-12 h-12 text-zinc-700" />
        <p className="text-sm font-semibold">Acesso restrito a administradores</p>
        <Navigate to="/" replace />
      </div>
    )
  }

  return <>{children}</>
}
