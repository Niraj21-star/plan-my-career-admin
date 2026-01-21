import React from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import CounsellorDashboard from './pages/CounsellorDashboard'
import ExternalDb from './pages/ExternalDb'
import ProtectedRoute from './components/ProtectedRoute'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/*"
          element={<ProtectedRoute roleRequired="admin"><AdminRoutes /></ProtectedRoute>}
        />

        <Route
          path="/counsellor/*"
          element={<ProtectedRoute roleRequired="counsellor"><CounsellorRoutes /></ProtectedRoute>}
        />
      </Routes>
    </div>
  )
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="external-db" element={<ExternalDb />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  )
}

function CounsellorRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<CounsellorDashboard />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  )
}
