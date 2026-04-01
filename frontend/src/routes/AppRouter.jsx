import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProtectedRoute from '../components/ProtectedRoute'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Records from '../pages/Records'

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/records"
          element={
            <ProtectedRoute>
              <Records />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
