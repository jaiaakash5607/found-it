import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * Use as <ProtectedRoute><Browse/></ProtectedRoute>
 * It checks localStorage 'srm_auth' — if missing, redirects to /login
 */
export default function ProtectedRoute({ children }){
  try {
    const auth = JSON.parse(localStorage.getItem('srm_auth') || 'null')
    if (!auth) return <Navigate to="/login" replace />
    return children
  } catch {
    return <Navigate to="/login" replace />
  }
}
