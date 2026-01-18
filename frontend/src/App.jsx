import { useState } from 'react'
import {Routes, Route} from 'react-router-dom';
import Browse from './pages/browse.jsx'
import Home from './pages/index.jsx'
import Err from './pages/err.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Profile  from './pages/Profile.jsx';
import Logo from "./pages/logo.jsx"

//hi
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logo" element={<Logo />} />
        <Route path="*" element={<Err />} />
      </Routes>
    </>
  )
}

export default App
