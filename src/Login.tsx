import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignUp = async (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(`Erro: ${error.message}`)
    } else {
      setMessage('Sucesso! Verifique seu email para confirmar a conta.')
    }
    setLoading(false)
  }

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage('Erro: Credenciais inválidas.')
    } else {
      setMessage('Login efetuado com sucesso!')
      window.location.reload()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-xl shadow-2xl border border-zinc-800">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Top <span className="text-orange-500">Concurso</span>
        </h1>
        <p className="text-zinc-400 text-sm text-center mb-8">Sua plataforma completa de estudos</p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-zinc-400 mb-1 text-sm">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 text-sm">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div className={`p-3 rounded text-sm ${message.includes('Erro') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
              {message}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer"
            >
              Entrar
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer"
            >
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
