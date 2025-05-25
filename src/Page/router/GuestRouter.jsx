
import { Navigate, Route, Routes } from 'react-router-dom'
// import Login from '../Login/login'
import LoginPage from '../../features/auth/sign-in/LoginPage'

export default function GuestRouter() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Login onLogin={setIsAuthenticated} />} /> */}
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
