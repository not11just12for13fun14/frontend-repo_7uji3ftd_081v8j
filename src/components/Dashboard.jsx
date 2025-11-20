import { useEffect, useState } from 'react'

export default function Dashboard({ token }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [me, setMe] = useState(null)
  const [slots, setSlots] = useState([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [bookings, setBookings] = useState([])
  const [notifications, setNotifications] = useState([])

  const auth = { Authorization: `Bearer ${token}` }
  const json = { 'Content-Type': 'application/json', ...auth }

  const load = async () => {
    const meRes = await fetch(`${baseUrl}/me`, { headers: auth })
    if (meRes.ok) setMe(await meRes.json())
    const sRes = await fetch(`${baseUrl}/availability/mine`, { headers: auth })
    if (sRes.ok) setSlots(await sRes.json())
    const bRes = await fetch(`${baseUrl}/bookings/mine`, { headers: auth })
    if (bRes.ok) setBookings(await bRes.json())
    const nRes = await fetch(`${baseUrl}/notifications`, { headers: auth })
    if (nRes.ok) setNotifications(await nRes.json())
  }

  useEffect(() => { if (token) load() }, [token])

  const addSlot = async () => {
    if (!start || !end) return
    const res = await fetch(`${baseUrl}/availability`, { method: 'POST', headers: json, body: JSON.stringify({ start_iso: start, end_iso: end }) })
    if (res.ok) {
      setStart(''); setEnd(''); load()
    }
  }
  const deleteSlot = async (id) => {
    const res = await fetch(`${baseUrl}/availability/${id}`, { method: 'DELETE', headers: auth })
    if (res.ok) load()
  }
  const confirmBooking = async (id) => {
    const res = await fetch(`${baseUrl}/bookings/${id}/confirm`, { method: 'POST', headers: auth })
    if (res.ok) load()
  }
  const cancelBooking = async (id) => {
    const res = await fetch(`${baseUrl}/bookings/${id}/cancel`, { method: 'POST', headers: auth })
    if (res.ok) load()
  }
  const markRead = async () => {
    const res = await fetch(`${baseUrl}/notifications/read`, { method: 'PATCH', headers: json, body: JSON.stringify({}) })
    if (res.ok) load()
  }

  return (
    <section className="py-16 bg-slate-950" id="dashboard">
      <div className="max-w-6xl mx-auto px-6 text-white">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        {me && (
          <div className="mb-8 text-blue-200">Signed in as <span className="font-semibold">{me.profile?.display_name || me.email}</span> — role: <span className="capitalize">{me.role}</span>, verified: {String(me.verified)}</div>
        )}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Availability</h3>
            <div className="space-y-2">
              <input value={start} onChange={e=>setStart(e.target.value)} placeholder="Start ISO" className="w-full px-3 py-2 rounded bg-white/10 outline-none" />
              <input value={end} onChange={e=>setEnd(e.target.value)} placeholder="End ISO" className="w-full px-3 py-2 rounded bg-white/10 outline-none" />
              <button onClick={addSlot} className="w-full px-3 py-2 rounded bg-blue-600 hover:bg-blue-500">Add Slot</button>
            </div>
            <div className="mt-4 space-y-2 max-h-64 overflow-auto">
              {slots.map(s => (
                <div key={s._id} className="flex items-center justify-between text-sm bg-white/10 rounded p-2">
                  <span>{s.start_iso} → {s.end_iso} {s.is_booked ? '(booked)' : ''}</span>
                  {!s.is_booked && <button onClick={()=>deleteSlot(s._id)} className="text-red-300 hover:text-red-200">Delete</button>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Bookings</h3>
            <div className="space-y-2 max-h-80 overflow-auto">
              {bookings.map(b => (
                <div key={b._id} className="bg-white/10 rounded p-2 text-sm">
                  <div>Status: <span className="capitalize">{b.status}</span></div>
                  <div className="text-blue-200">Slot: {b.slot_id}</div>
                  <div className="mt-2 flex gap-2">
                    {me && b.target_id === me._id && b.status==='pending' && (
                      <button onClick={()=>confirmBooking(b._id)} className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-500">Confirm</button>
                    )}
                    {(me && (b.requester_id===me._id || b.target_id===me._id)) && b.status!=='cancelled' && (
                      <button onClick={()=>cancelBooking(b._id)} className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500">Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Notifications</h3>
            <button onClick={markRead} className="mb-3 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20">Mark all read</button>
            <div className="space-y-2 max-h-80 overflow-auto">
              {notifications.map(n => (
                <div key={n._id} className="bg-white/10 rounded p-2 text-sm">
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-blue-200">{n.message}</div>
                  <div className="text-xs text-white/60">{new Date(n.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
