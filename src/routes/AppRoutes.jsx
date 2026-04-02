import React from 'react'
import { Link, Route,Routes } from 'react-router-dom'
import Home from '../pages/Home'

function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
    </div>
  )
}

export default AppRoutes
