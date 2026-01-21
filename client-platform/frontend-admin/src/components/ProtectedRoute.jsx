import React from 'react'
import { Navigate } from 'react-router-dom'
import authService from '../services/authService'

export default function ProtectedRoute({ children, roleRequired }) {
  const token = authService.getToken()
  const role = authService.getRole()
  if (!token) return <Navigate to="/login" replace />
  if (roleRequired && role !== roleRequired) return <Navigate to="/login" replace />
  return children
}
