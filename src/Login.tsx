import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignUp = async (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Conta criada! Verifique seu email.')
    }
    setLoading(false)
  }

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage('Credenciais inválidas.')
    } else {
      window.location.reload()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-2xl mb-5 border border-orange-500/20">
            <Sparkles className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Top <span className="text-orange-500">Concurso</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Sua plataforma completa de estudos</p>
        </div>

        {/* Login card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 space-y-5">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950/80 text-white border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-all placeholder:text-zinc-600"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950/80 text-white border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-all placeholder:text-zinc-600"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-xl text-sm font-medium ${
                message.toLowerCase().includes('inválidas') || message.toLowerCase().includes('erro')
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {message}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all text-sm disabled:opacity-50 cursor-pointer active:scale-[0.98]"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-xl transition-all text-sm disabled:opacity-50 cursor-pointer active:scale-[0.98] border border-zinc-700/50"
              >
                {loading ? 'Criando...' : 'Criar Conta'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-6 font-medium">
          Estude com foco. Passe com confiança.
        </p>
      </div>
    </div>
  )
}
