// src/utils/messages.js
// Helpers for storing and retrieving messages in localStorage.
// Optional lightweight encryption helpers using Web Crypto API (demo only).

const MSG_KEY = 'srm_messages'

export function getMessages() {
  try {
    return JSON.parse(localStorage.getItem(MSG_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveMessages(arr) {
  localStorage.setItem(MSG_KEY, JSON.stringify(arr))
}

export function getThread(itemId, userA, userB) {
  // returns messages for itemId where participants are userA and userB (either direction)
  const idA = Number(userA)
  const idB = Number(userB)
  return getMessages().filter(m =>
    Number(m.itemId) === Number(itemId) &&
    ((Number(m.fromId) === idA && Number(m.toId) === idB) || (Number(m.fromId) === idB && Number(m.toId) === idA))
  ).sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
}

export function getThreadsForUser(userId) {
  // Return unique threads (by itemId + other participant)
  const id = Number(userId)
  const msgs = getMessages()
    .filter(m => m.fromId === id || m.toId === id)

  // map key: `${itemId}:${otherId}`
  const map = new Map()
  msgs.forEach(m => {
    const other = m.fromId === id ? m.toId : m.fromId
    const key = `${m.itemId}:${other}`
    if (!map.has(key)) map.set(key, { itemId: m.itemId, otherId: other, lastMessage: m })
    else map.get(key).lastMessage = m
  })
  // return array sorted by lastMessage time desc
  return Array.from(map.values()).sort((a,b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt))
}

export function sendMessage({ itemId, fromId, toId, text }) {
  const m = {
    id: Date.now() + Math.floor(Math.random()*999),
    itemId: Number(itemId),
    fromId: Number(fromId),
    toId: Number(toId),
    text,
    createdAt: new Date().toISOString()
  }
  const arr = getMessages()
  arr.push(m)
  saveMessages(arr)
  return m
}

/* --- OPTIONAL lightweight encryption (demo only) ---
  This section provides simple AES-GCM encryption using a passphrase derived
  from the current user's id and a static salt. *This is NOT production E2EE*.
  Use a proper key exchange and serverless/Signal-like protocol for real privacy.
*/

function utf8Encode(s){ return new TextEncoder().encode(s) }
function utf8Decode(b){ return new TextDecoder().decode(b) }
function toBase64(b){ return btoa(String.fromCharCode(...new Uint8Array(b))) }
function fromBase64(s){ const str = atob(s); const arr = new Uint8Array(str.length); for(let i=0;i<str.length;i++)arr[i]=str.charCodeAt(i); return arr }

export async function deriveKeyFromPassphrase(passphrase) {
  // derivation using PBKDF2 (demo)
  const salt = utf8Encode('srmist-demo-salt-v1')
  const baseKey = await crypto.subtle.importKey('raw', utf8Encode(passphrase), {name:'PBKDF2'}, false, ['deriveKey'])
  const key = await crypto.subtle.deriveKey(
    {name:'PBKDF2', salt, iterations: 200000, hash: 'SHA-256'},
    baseKey,
    {name: 'AES-GCM', length: 256},
    false,
    ['encrypt','decrypt']
  )
  return key
}

export async function encryptText(key, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const enc = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, utf8Encode(plaintext))
  // store iv + ciphertext in base64 (iv:ct)
  const combined = iv.byteLength ? (toBase64(iv) + ':' + toBase64(enc)) : toBase64(enc)
  return combined
}

export async function decryptText(key, combined) {
  const [ivB64, ctB64] = combined.split(':')
  const iv = fromBase64(ivB64)
  const ct = fromBase64(ctB64)
  const dec = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, ct)
  return utf8Decode(dec)
}
