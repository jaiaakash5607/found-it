// import React from 'react'
// import { Routes, Route } from 'react-router-dom'
// import Home from './pages/Home'
// import Browse from './pages/Browse'
// import Nav from './components/Nav'
// import Register from './pages/Register'


// export default function App(){
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Nav />
//       <Routes>
//         <Route path="/" element={<Home/>} />
//         <Route path="/browse" element={<Browse/>} />
//         <Route path="/register" element={<Register/>} />
//       </Routes>
//     </div>
//   )
// }

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Nav from './components/Nav'
import Register from './pages/Register'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import PostItem from './pages/PostItem'
import Messages from './pages/Messages'
import MessageThread from './pages/MessageThread'
import Dashboard from './pages/Dashboard'

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/post" element={<ProtectedRoute><PostItem/></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostItem/></ProtectedRoute>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages/></ProtectedRoute>} />
        <Route path="/messages/:itemId/:otherId" element={<ProtectedRoute><MessageThread/></ProtectedRoute>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/browse" element={
          <ProtectedRoute>
            <Browse/>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}
