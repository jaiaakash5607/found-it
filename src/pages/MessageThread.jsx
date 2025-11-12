// src/pages/MessageThread.jsx
import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getThread, sendMessage as sendMsg, getMessages, deriveKeyFromPassphrase, encryptText, decryptText } from '../utils/messages'
import { getListings } from '../utils/listings' // helper - if you have one; otherwise read localStorage



// If you don't have getListings util, you can inline:
// function getListings(){ try{ return JSON.parse(localStorage.getItem('srm_listings')||'[]') }catch{return []} }

export default function MessageThread(){
  const { itemId, otherId } = useParams()
  const threadItemId = Number(itemId)
  const otherUserId = Number(otherId) // route: /messages/:itemId/:otherId
  const [auth, setAuth] = useState(()=> { try { return JSON.parse(localStorage.getItem('srm_auth')||'null') } catch { return null }})
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const [useEncryption, setUseEncryption] = useState(false) // toggle for demo
  const [cryptoKey, setCryptoKey] = useState(null)

  useEffect(()=>{
    // reload messages for this thread
    loadThread()
    // listen for storage changes to update in other tabs
    const onStorage = (e) => {
      if (e.key === 'srm_messages') loadThread()
    }
    window.addEventListener('storage', onStorage)
    return ()=> window.removeEventListener('storage', onStorage)
  }, [itemId, otherId])

  async function loadThread(){
    const me = auth?.id
    if (!me) { setMessages([]); return }
    const t = getThread(threadItemId, me, otherUserId)
    // if encryption toggle on, try to decrypt messages (best-effort)
    if (useEncryption && cryptoKey){
      const decs = await Promise.all(t.map(async m => {
        try {
          const plain = await decryptText(cryptoKey, m.text)
          return {...m, text: plain}
        } catch {
          return m
        }
      }))
      setMessages(decs)
    } else {
      setMessages(t)
    }
    setTimeout(()=> bottomRef.current?.scrollIntoView({behavior:'smooth'}), 30)
  }

  async function onSend(e){
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    try {
      let payload = text.trim()
      if (useEncryption){
        if (!cryptoKey){
          // derive a key from a passphrase — here we use auth.email as passphrase for demo (NOT secure)
          const key = await deriveKeyFromPassphrase(auth.email || String(auth.id))
          setCryptoKey(key)
          payload = await encryptText(key, payload)
        } else {
          payload = await encryptText(cryptoKey, payload)
        }
      }
      sendMsg({ itemId: threadItemId, fromId: auth.id, toId: otherUserId, text: payload })
      setText('')
      loadThread()
    } finally {
      setLoading(false)
    }
  }

  const item = (getListings && getListings().find(x=>x.id===threadItemId)) || null

  if (!auth) return (
    <div className="p-8">
      <p>Please <Link to="/login" className="text-indigo-600">log in</Link> to view messages.</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">Conversation about: {item?.title || `Item ${threadItemId}`}</h2>
            <p className="text-xs text-gray-400">With user ID: {otherUserId}</p>
          </div>
          <div>
            <Link to="/messages" className="text-sm text-gray-600">Back to inbox</Link>
          </div>
        </div>

        <div className="mt-4 border rounded p-3 h-[400px] overflow-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No messages yet. Say hello!</div>
          ) : messages.map(m => (
            <div key={m.id} className={`mb-3 max-w-[85%] ${m.fromId === auth.id ? 'ml-auto text-right' : ''}`}>
              <div className={`inline-block px-3 py-2 rounded ${m.fromId === auth.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-gray-300 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={onSend} className="mt-4 flex gap-3">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a message..." className="flex-1 px-3 py-2 border rounded" />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
        </form>

        <div className="mt-3 text-xs text-gray-500 flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useEncryption} onChange={e=>setUseEncryption(e.target.checked)} />
            Enable demo encryption (client-side; not full E2EE)
          </label>
          <span>Note: demo encryption uses Web Crypto and a passphrase derived from your login; not secure for production.</span>
        </div>
      </div>
    </div>
  )
}
