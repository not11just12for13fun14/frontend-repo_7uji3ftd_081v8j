import { useState } from 'react'
import Hero from './components/Hero'
import AuthPanel from './components/AuthPanel'
import RoleFlow from './components/RoleFlow'
import Directory from './components/Directory'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  const handleAuth = (t) => {
    localStorage.setItem('token', t)
    setToken(t)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-slate-900/50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-semibold">MuseBook</a>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#directory" className="text-white/80 hover:text-white">Directory</a>
            <a href={token?"#roles":"#auth"} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500">{token? 'Roles' : 'Sign in'}</a>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        <Hero />
        {!token && <AuthPanel onAuth={handleAuth} />}
        {token && <RoleFlow token={token} />}
        <Directory />
      </main>

      <footer className="py-10 text-center text-white/60">© {new Date().getFullYear()} MuseBook — All rights reserved.</footer>
    </div>
  )
}

export default App
