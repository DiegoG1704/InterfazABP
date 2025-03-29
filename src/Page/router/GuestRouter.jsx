import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../Login/login'

export default function GuestRouter({setIsAuthenticated}) {
  return (
    <>
        <Routes>
            <Route path="/" element={<Login onLogin={setIsAuthenticated} />} />
        </Routes>
    </>
  )
}
