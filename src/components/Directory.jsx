import { useEffect, useState } from 'react'

export default function Directory() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [role, setRole] = useState('artist')
  const [items, setItems] = useState([])

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${baseUrl}/directory?role=${role}`)
      const data = await res.json()
      setItems(data)
    }
    load()
  }, [role])

  return (
    <section id="directory" className="py-16 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Verified Directory</h2>
          <div className="bg-white/10 text-white rounded-xl p-1">
            <button onClick={()=>setRole('artist')} className={`px-4 py-2 rounded-lg ${role==='artist'?'bg-blue-600':''}`}>Artists</button>
            <button onClick={()=>setRole('host')} className={`px-4 py-2 rounded-lg ${role==='host'?'bg-blue-600':''}`}>Hosts</button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item._id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <img src={item.profile?.avatar_url || 'https://i.pravatar.cc/100'} alt="avatar" className="w-12 h-12 rounded-full border border-white/20" />
                <div>
                  <p className="text-white font-semibold">{item.profile?.display_name || item.email}</p>
                  <p className="text-blue-200 text-sm capitalize">{item.role}</p>
                </div>
              </div>
              <p className="mt-3 text-blue-100/80 text-sm line-clamp-3">{item.profile?.bio || 'No bio provided.'}</p>
              <a href={`mailto:${item.email}`} className="mt-4 inline-flex text-blue-300 hover:text-blue-200">Contact</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
