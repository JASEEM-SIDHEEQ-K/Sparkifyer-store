import React from 'react'
import { Route,Routes } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'


import Register from '../pages/Register'
import Login from '../pages/Login'
import Home from '../pages/Home'

function AppRoutes() {
  return (
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
      </Routes>
  )
}

export default AppRoutes
