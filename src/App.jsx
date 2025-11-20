import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import AuthPanel from './components/AuthPanel'
import RoleFlow from './components/RoleFlow'
import Directory from './components/Directory'
import AdminPanel from './components/AdminPanel'
import Dashboard from './components/Dashboard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [me, setMe] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleAuth = (t) => {
    localStorage.setItem('token', t)
    setToken(t)
  }
  const signOut = () => {
    localStorage.removeItem('token');
    setToken(''); setMe(null)
  }

  useEffect(() => {
    const run = async () => {
      if (!token) { setMe(null); return }
      try {
        const res = await fetch(`${baseUrl}/me`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) setMe(await res.json())
      } catch {}
    }
    run()
  }, [token])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-slate-900/50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-semibold">MuseBook</a>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#directory" className="text-white/80 hover:text-white">Directory</a>
            {token && <a href="#dashboard" className="text-white/80 hover:text-white">Dashboard</a>}
            {me?.is_admin && <a href="#admin" className="text-white/80 hover:text-white">Admin</a>}
            {!token ? (
              <a href={token?"#roles":"#auth"} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500">Sign in</a>
            ) : (
              <button onClick={signOut} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20">Sign out</button>
            )}
          </nav>
        </div>
      </header>

      <main className="pt-16">
        <Hero />
        {!token && <AuthPanel onAuth={handleAuth} />}
        {token && <RoleFlow token={token} />}
        {token && <Dashboard token={token} />}
        {me?.is_admin && <AdminPanel token={token} />}
        <Directory />
      </main>

      <footer className="py-10 text-center text-white/60">© {new Date().getFullYear()} MuseBook — All rights reserved.</footer>
    </div>
  )
}

export default App
