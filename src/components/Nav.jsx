// import React from 'react'
// import { Link, useLocation } from 'react-router-dom'

// export default function Nav(){
//   const loc = useLocation()
//   return (
//     <header className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex items-center justify-between h-16">
//           <Link to="/" className="flex items-center gap-3">
//             <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
//               <circle cx="12" cy="12" r="10" fill="#5b4bff"/>
//               <text x="50%" y="54%" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="12" dy=".3em">L</text>
//             </svg>
//             <span className="text-lg font-semibold text-[#5b4bff]">SRMIST Lost & Found</span>
//           </Link>

//           <nav className="flex items-center space-x-4">
//             <Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Log In</Link>
//             <Link to="/register" className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white rounded-xl" style={{background: 'linear-gradient(180deg,#5b4bff,#4a39d9)', boxShadow: '0 8px 24px rgba(75,58,255,0.12)'}}>Sign Up</Link>
//           </nav>
//         </div>
//       </div>
//     </header>
//   )
// }


import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Nav(){
  const [auth, setAuth] = useState(null)
  const nav = useNavigate()

  useEffect(()=>{
    try {
      setAuth(JSON.parse(localStorage.getItem('srm_auth') || 'null'))
    } catch { setAuth(null) }
    // Listen for changes from other tabs/windows
    const onStorage = (e) => {
      if (e.key === 'srm_auth') {
        try { setAuth(JSON.parse(e.newValue || 'null')) } catch { setAuth(null) }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  },[])

  function logout(){
    localStorage.removeItem('srm_auth')
    setAuth(null)
    nav('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#5b4bff"/>
              <text x="50%" y="54%" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="12" dy=".3em">L</text>
            </svg>
            <span className="text-lg font-semibold text-[#5b4bff]">SRMIST Found It</span>
          </Link>

          <nav className="flex items-center space-x-4">
            {auth ? (
              <>
                <span className="text-sm text-gray-700">Welcome, <strong>{auth.fullName.split(' ')[0]}</strong></span>
                <Link to="/browse" className="text-sm text-gray-600 hover:text-gray-900">Browse</Link>
                <Link to="/post" className="text-sm text-gray-600 hover:text-gray-900">Post Item</Link>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link to="/messages" className="text-sm text-gray-600 hover:text-gray-900">Messages</Link>
                <button onClick={logout} className="px-3 py-1 rounded-md text-sm bg-gray-100">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">Log In</Link>
                <Link to="/register" className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white rounded-xl" style={{background: 'linear-gradient(180deg,#5b4bff,#4a39d9)', boxShadow: '0 8px 24px rgba(75,58,255,0.12)'}}>Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
