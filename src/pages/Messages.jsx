// src/pages/Messages.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getThreadsForUser } from '../utils/messages'
import { getListings } from '../utils/listings' // optional helper

export default function Messages(){
  const auth = (()=>{ try { return JSON.parse(localStorage.getItem('srm_auth')||'null') } catch { return null }})()
  const [threads, setThreads] = useState([])

  function load() {
    if (!auth) { setThreads([]); return }
    setThreads(getThreadsForUser(auth.id))
  }

  useEffect(()=> {
    load()
    const onStorage = (e) => { if (e.key === 'srm_messages') load() }
    window.addEventListener('storage', onStorage)
    return ()=> window.removeEventListener('storage', onStorage)
  }, [])

  if (!auth) return (
    <div className="p-8">
      <p>Please <Link to="/login" className="text-indigo-600">log in</Link> to view messages.</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        {threads.length === 0 ? (
          <div className="text-gray-500 mt-4">No conversations yet. Message owners from item pages.</div>
        ) : (
          <div className="mt-4 divide-y">
            {threads.map(t => (
              <Link key={`${t.itemId}:${t.otherId}`} to={`/messages/${t.itemId}/${t.otherId}`} className="block py-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Item #{t.itemId}</div>
                    <div className="text-xs text-gray-500">Participant: {t.otherId}</div>
                    <div className="text-sm text-gray-600 mt-1">{t.lastMessage?.text?.slice(0,100)}</div>
                  </div>
                  <div className="text-xs text-gray-400">{new Date(t.lastMessage.createdAt).toLocaleString()}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
