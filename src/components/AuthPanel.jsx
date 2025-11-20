import { useMemo, useState } from 'react'

export default function AuthPanel({ onAuth }) {
  // Derive backend URL safely for both local dev and hosted preview
  const baseUrl = useMemo(() => {
    const env = import.meta.env.VITE_BACKEND_URL
    if (env && typeof env === 'string') return env.replace(/\/$/, '')
    if (typeof window !== 'undefined') {
      const origin = window.location.origin
      // Modal preview hosts encode the port in the subdomain. Swap -3000 to -8000.
      if (origin.includes('-3000')) return origin.replace('-3000', '-8000')
      // Fallback: if running locally on 3000, point to localhost:8000
      if (origin.includes('3000')) return origin.replace('3000', '8000')
    }
    return 'http://localhost:8000'
  }, [])

  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, display_name: displayName })
      })
      if (!res.ok) {
        let msg = 'Sign up failed'
        try { const j = await res.json(); if (j?.detail) msg = Array.isArray(j.detail) ? j.detail[0]?.msg || msg : j.detail }
        catch {}
        throw new Error(msg)
      }
      const data = await res.json()
      onAuth(data.access_token)
    } catch (e) { setError(e.message || 'Sign up failed') } finally { setLoading(false) }
  }

  const handleLogin = async () => {
    setLoading(true); setError('')
    try {
      const form = new URLSearchParams()
      form.append('username', email)
      form.append('password', password)
      const res = await fetch(`${baseUrl}/auth/login`, { method: 'POST', body: form })
      if (!res.ok) {
        let msg = 'Login failed'
        try { const j = await res.json(); if (j?.detail) msg = Array.isArray(j.detail) ? j.detail[0]?.msg || msg : j.detail }
        catch {}
        throw new Error(msg)
      }
      const data = await res.json()
      onAuth(data.access_token)
    } catch (e) { setError(e.message || 'Login failed') } finally { setLoading(false) }
  }

  return (
    <section id="auth" className="relative py-16 bg-slate-900/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Create your account</h2>
            <p className="mt-3 text-blue-100/80">Sign in or create an account to book artists and hosts, manage availability, and more.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
            <div className="flex gap-2 mb-4">
              <button onClick={() => setMode('login')} className={`px-3 py-2 rounded-lg text-sm font-semibold ${mode==='login' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white'}`}>Login</button>
              <button onClick={() => setMode('signup')} className={`px-3 py-2 rounded-lg text-sm font-semibold ${mode==='signup' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white'}`}>Sign Up</button>
            </div>
            <div className="space-y-3">
              <input className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 outline-none" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              <input type="password" className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 outline-none" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
              {mode==='signup' && (
                <input className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 outline-none" placeholder="Display Name (optional)" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
              )}
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button onClick={mode==='login' ? handleLogin : handleSignup} disabled={loading} className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-60">
                {loading ? 'Please wait...' : mode==='login' ? 'Login' : 'Create Account'}
              </button>
              <p className="text-xs text-white/50 text-center">Using: {baseUrl}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
