import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Sparkles, ArrowLeft, Mail, CheckCircle } from 'lucide-react'

type LoginView = 'login' | 'forgot' | 'sent'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [view, setView] = useState<LoginView>('login')

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
      if (error.message.toLowerCase().includes('email not confirmed')) {
        setMessage('Confirme seu email antes de entrar.')
      } else {
        setMessage('Credenciais inválidas.')
      }
    }
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/reset-password`,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setView('sent')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-sm animate-fadeIn">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-2xl mb-5 border border-orange-500/20">
            <Sparkles className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Top <span className="text-orange-500">Concurso</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Sua plataforma completa de estudos</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 space-y-5">
          {view === 'login' && (
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
                  message.toLowerCase().includes('inválidas') || message.toLowerCase().includes('erro') || message.toLowerCase().includes('confirme')
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

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setView('forgot'); setMessage('') }}
                  className="text-xs text-zinc-500 hover:text-orange-400 font-medium transition-colors cursor-pointer"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </form>
          )}

          {view === 'forgot' && (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-center gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => { setView('login'); setMessage('') }}
                  className="p-1.5 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <p className="text-sm font-bold text-white">Recuperar Senha</p>
                  <p className="text-[11px] text-zinc-500">Receba um link no seu email</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> E-mail cadastrado
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950/80 text-white border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-all placeholder:text-zinc-600"
                  placeholder="seu@email.com"
                />
              </div>

              {message && (
                <div className="p-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  {message}
                </div>
              )}

              <button
                onClick={handleForgotPassword}
                disabled={loading || !email}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3 rounded-xl transition-all text-sm disabled:opacity-50 cursor-pointer active:scale-[0.98]"
              >
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>
            </form>
          )}

          {view === 'sent' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/30">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Email Enviado!</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
              </div>
              <button
                onClick={() => { setView('login'); setEmail(''); setMessage('') }}
                className="text-xs text-orange-500 font-bold hover:text-orange-400 transition-colors cursor-pointer"
              >
                Voltar para o login
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-zinc-600 text-xs mt-6 font-medium">
          Estude com foco. Passe com confiança.
        </p>
      </div>
    </div>
  )
}
