import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function isSRMEmail(email) {
  // basic validate for srmmist emails pattern like your.name@srmist.edu.in or some variant
  return /^\S+@(?:srmist\.edu\.in|srm\.edu\.in|srmist\.ac\.in)$/i.test(email)
}

function saveUserToLocal(user) {
  const users = JSON.parse(localStorage.getItem('srm_users') || '[]')
  users.push(user)
  localStorage.setItem('srm_users', JSON.stringify(users))
}

export default function Register() {
  const nav = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirm: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required.'
    if (!form.email.trim()) e.email = 'SRMIST email is required.'
    else if (!isSRMEmail(form.email.trim())) e.email = 'Please use your SRMIST email.'
    if (form.phone && !/^\+?\d{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number (digits only).'
    if (!form.password) e.password = 'Password is required.'
    else if (form.password.length < 6) e.password = 'Password must be ≥ 6 characters.'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.'
    return e
  }

  async function onSubmit(e) {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return

    setSubmitting(true)
    // simulate API latency
    await new Promise(r => setTimeout(r, 600))

    // store user - password stored in plain text here only for demo (don't do in production)
    saveUserToLocal({
      id: Date.now(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password
    })

    setSubmitting(false)
    // redirect to browse or login
    nav('/browse')
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-12 bg-gradient-to-r from-[#f3f7ff] to-white">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-extrabold text-center">Create Account</h2>
          <p className="text-center text-gray-500 mt-2">Join SRMIST Lost & Found</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                placeholder="John Doe"
                className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-100`}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">SRMIST Email</label>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="your.name@srmist.edu.in"
                className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-100`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="+91 1234567890"
                className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-100`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-100`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={onChange}
                placeholder="••••••••"
                className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.confirm ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-100`}
              />
              {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold"
                style={{ background: 'linear-gradient(180deg,#5b4bff,#4a39d9)', boxShadow: '0 8px 24px rgba(75,58,255,0.12)' }}
              >
                {submitting ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
