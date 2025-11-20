import { useEffect, useState } from 'react'

export default function AdminPanel({ token }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [tab, setTab] = useState('requests')
  const [requests, setRequests] = useState([])
  const [users, setUsers] = useState([])
  const auth = { Authorization: `Bearer ${token}` }
  const json = { 'Content-Type': 'application/json', ...auth }

  const loadRequests = async () => {
    const res = await fetch(`${baseUrl}/admin/verification-requests`, { headers: auth })
    if (res.ok) setRequests(await res.json())
  }
  const loadUsers = async () => {
    const res = await fetch(`${baseUrl}/admin/users`, { headers: auth })
    if (res.ok) setUsers(await res.json())
  }
  useEffect(() => { if (tab==='requests') loadRequests(); else loadUsers() }, [tab])

  const approve = async (id) => {
    const res = await fetch(`${baseUrl}/admin/verification/${id}/approve`, { method: 'POST', headers: auth })
    if (res.ok) loadRequests()
  }
  const reject = async (id) => {
    const feedback = prompt('Feedback (optional)') || null
    const res = await fetch(`${baseUrl}/admin/verification/${id}/reject`, { method: 'POST', headers: json, body: JSON.stringify(feedback) })
    if (res.ok) loadRequests()
  }
  const promote = async (id) => {
    const res = await fetch(`${baseUrl}/admin/promote/${id}`, { method: 'POST', headers: auth })
    if (res.ok) loadUsers()
  }

  return (
    <section className="py-16 bg-slate-900" id="admin">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Admin</h2>
          <div className="bg-white/10 rounded-xl p-1 text-white">
            <button onClick={()=>setTab('requests')} className={`px-4 py-2 rounded-lg ${tab==='requests'?'bg-blue-600':''}`}>Verification</button>
            <button onClick={()=>setTab('users')} className={`px-4 py-2 rounded-lg ${tab==='users'?'bg-blue-600':''}`}>Users</button>
          </div>
        </div>

        {tab==='requests' && (
          <div className="grid md:grid-cols-2 gap-4">
            {requests.length===0 && <p className="text-blue-200">No requests.</p>}
            {requests.map(r => (
              <div key={r._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-white">
                <p className="text-sm text-blue-200">Role: <span className="capitalize">{r.role}</span></p>
                <p className="font-semibold mt-1">User: {r.user_id}</p>
                <a href={r.demo_video_url} target="_blank" className="text-blue-300 hover:text-blue-200 break-all">{r.demo_video_url}</a>
                {r.description && <p className="text-blue-100/80 mt-2 text-sm">{r.description}</p>}
                <div className="mt-4 flex gap-3">
                  <button onClick={()=>approve(r._id)} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500">Approve</button>
                  <button onClick={()=>reject(r._id)} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='users' && (
          <div className="overflow-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-white/90">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-3">Email</th>
                  <th className="p-3">Display</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Verified</th>
                  <th className="p-3">Admin</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-t border-white/10">
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.profile?.display_name}</td>
                    <td className="p-3 capitalize">{u.role}</td>
                    <td className="p-3">{String(u.verified)}</td>
                    <td className="p-3">{String(u.is_admin)}</td>
                    <td className="p-3">
                      {!u.is_admin && <button onClick={()=>promote(u._id)} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500">Promote</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
