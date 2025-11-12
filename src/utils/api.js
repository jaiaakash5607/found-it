// src/utils/api.js
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function fetchListings() {
  const res = await fetch(`${API}/api/listings`)
  return res.json()
}
