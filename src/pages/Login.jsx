import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function onChange(e){
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function findUser(email, password){
    try {
      const users = JSON.parse(localStorage.getItem('srm_users') || '[]')
      return users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password) || null
    } catch {
      return null
    }
  }

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 500)) // simulate latency

    const user = findUser(form.email.trim(), form.password)
    if (!user) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    // Save a minimal auth object (DO NOT store passwords in production)
    const auth = { id: user.id, fullName: user.fullName, email: user.email }
    localStorage.setItem('srm_auth', JSON.stringify(auth))

    setLoading(false)
    // redirect to browse (or previous page)
    nav('/browse')
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-12 bg-gradient-to-r from-[#f3f7ff] to-white">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-extrabold text-center">Log In</h2>
          <p className="text-center text-gray-500 mt-2">Welcome back — sign in to your account</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">SRMIST Email</label>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="your.name@srmist.edu.in"
                className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold"
                style={{ background: 'linear-gradient(180deg,#5b4bff,#4a39d9)', boxShadow: '0 8px 24px rgba(75,58,255,0.12)' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Don’t have an account? <Link to="/register" className="text-indigo-600 font-medium">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
