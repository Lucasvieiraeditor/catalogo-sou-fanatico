import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou senha incorretos')
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        <div className="text-center mb-8">
          <h1 className="font-black text-[28px] text-gold tracking-wider">SOU FANÁTICO</h1>
          <p className="text-[13px] text-muted mt-1">Painel Administrativo</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full h-12 px-4 rounded-lg bg-card border border-border text-text placeholder-muted text-[14px] focus:outline-none focus:border-gold transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="w-full h-12 px-4 rounded-lg bg-card border border-border text-text placeholder-muted text-[14px] focus:outline-none focus:border-gold transition-colors"
          />
          {error && <p className="text-danger text-[13px] text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gold hover:bg-gold-hover text-bg font-bold text-[15px] rounded-lg transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
