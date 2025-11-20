import { useEffect, useState } from 'react'

export default function RoleFlow({ token }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [me, setMe] = useState(null)
  const [role, setRole] = useState('user')
  const [video, setVideo] = useState('')
  const [desc, setDesc] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetch(`${baseUrl}/me`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setMe(data)
    }
    if (token) fetchMe()
  }, [token])

  const submit = async () => {
    setMessage('')
    const res = await fetch(`${baseUrl}/roles/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role, demo_video_url: video || undefined, description: desc || undefined })
    })
    const data = await res.json()
    if (!res.ok) setMessage(data.detail || 'Failed')
    else setMessage(data.message)
  }

  return (
    <section className="py-16 bg-slate-900" id="roles">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Choose your role</h2>
        <p className="text-blue-100/80 mb-8">Artists and Hosts require a short demo video for verification. Normal users get instant access.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {['user','artist','host'].map(r => (
            <button key={r} onClick={() => setRole(r)} className={`text-left p-5 rounded-2xl border ${role===r?'border-blue-500 bg-blue-500/10':'border-white/10 bg-white/5'} text-white hover:border-blue-400`}>{r === 'user' ? 'Normal User' : r.charAt(0).toUpperCase()+r.slice(1)}</button>
          ))}
        </div>
        {(role==='artist' || role==='host') && (
          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 text-white">
            <input className="w-full px-4 py-3 rounded-xl bg-white/10 placeholder-white/50 outline-none" placeholder="Demo video URL" value={video} onChange={e=>setVideo(e.target.value)} />
            <textarea className="w-full mt-3 px-4 py-3 rounded-xl bg-white/10 placeholder-white/50 outline-none" rows={4} placeholder="Description (optional)" value={desc} onChange={e=>setDesc(e.target.value)} />
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <button onClick={submit} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold">Submit</button>
          {message && <p className="text-blue-200">{message}</p>}
        </div>
        {me && (
          <div className="mt-8 text-blue-100/80 text-sm">Current status: role={me.role}, verified={String(me.verified)}</div>
        )}
      </div>
    </section>
  )
}
