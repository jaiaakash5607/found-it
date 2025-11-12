// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getListings, saveListings } from '../utils/listings'
import ConfirmModal from "../components/ConfirmModal"


export default function Dashboard(){
  const nav = useNavigate()
  const auth = (() => { try { return JSON.parse(localStorage.getItem('srm_auth') || 'null') } catch { return null } })()

  useEffect(() => {
    if (!auth) nav('/login') // require login
  }, [auth, nav])

  const [refreshKey, setRefreshKey] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(null)
// confirmDelete will hold { id, title } or null

  const all = getListings()

  // only this user's items
  const myItems = useMemo(() => {
    if (!auth) return []
    return all.filter(i => Number(i.ownerId) === Number(auth.id))
  }, [all, auth, refreshKey])

  // stats
  const stats = useMemo(() => {
    const total = myItems.length
    const active = myItems.filter(i => i.status === 'active').length
    const claimed = myItems.filter(i => i.status === 'claimed').length
    const resolved = myItems.filter(i => i.status === 'resolved').length
    return { total, active, claimed, resolved }
  }, [myItems])

  function deleteItem(id){
    if (!confirm('Delete this item permanently?')) return
    const next = getListings().filter(x => x.id !== id)
    saveListings(next)
    setRefreshKey(k => k + 1)
  }

  function updateStatus(id, status){
    const next = getListings().map(x => x.id === id ? ({ ...x, status, updatedAt: new Date().toISOString() }) : x)
    saveListings(next)
    setRefreshKey(k => k + 1)
  }

  if (!auth) return null

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your posted items and track status</p>
        </div>
        <div className="flex gap-3">
          <Link to="/post" className="px-4 py-2 rounded bg-indigo-600 text-white">Post New Item</Link>
          <button onClick={() => setRefreshKey(k=>k+1)} className="px-4 py-2 rounded border">Refresh</button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-xs text-gray-500">Total</div>
          <div className="mt-2 text-2xl font-semibold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-xs text-gray-500">Active</div>
          <div className="mt-2 text-2xl font-semibold">{stats.active}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-xs text-gray-500">Claimed</div>
          <div className="mt-2 text-2xl font-semibold">{stats.claimed}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-xs text-gray-500">Resolved</div>
          <div className="mt-2 text-2xl font-semibold">{stats.resolved}</div>
        </div>
      </div>

      {/* Items list */}
      <section className="mt-8">
        {myItems.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            You have not posted any items yet. <Link to="/post" className="text-indigo-600">Post one now</Link>.
          </div>
        ) : (
          <div className="grid gap-4">
            {myItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow flex items-start gap-4">
                <img src={item.images?.[0] || 'https://via.placeholder.com/160x110?text=No+Image'} alt={item.title}
                  className="w-36 h-24 object-cover rounded" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <div className="text-xs text-gray-400">{item.category} • {item.type}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm px-2 py-1 rounded text-white ${item.status === 'active' ? 'bg-green-600' : item.status === 'claimed' ? 'bg-yellow-600' : 'bg-gray-500'}`}>
                        {item.status}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleString()}</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>

                  <div className="mt-3 flex items-center gap-2">
                    <Link to={`/post/${item.id}`} className="text-sm px-3 py-1 border rounded">Edit</Link>
                   <button
  onClick={() => setConfirmDelete({ id: item.id, title: item.title })}
  className="text-sm px-3 py-1 border rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
>
  Delete
</button>


                    <select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)} className="ml-2 text-sm px-2 py-1 border rounded">
                      <option value="active">active</option>
                      <option value="claimed">claimed</option>
                      <option value="resolved">resolved</option>
                    </select>

                    <Link to={`/messages/${item.id}/${item.ownerId}`} className="ml-auto text-sm px-3 py-1 border rounded text-indigo-600">Thread</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {confirmDelete && (
  <ConfirmModal
    title="Delete Item"
    message={`Are you sure you want to delete “${confirmDelete.title}”? This cannot be undone.`}
    onCancel={() => setConfirmDelete(null)}
    onConfirm={() => {
      deleteItem(confirmDelete.id)
      setConfirmDelete(null)
    }}
  />
)}

    </main>
  )
}
