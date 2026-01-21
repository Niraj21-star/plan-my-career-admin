import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export default function NavBar() {
  const navigate = useNavigate()
  const token = authService.getToken()
  const role = authService.getRole()

  function logout() {
    authService.logout()
    navigate('/login')
  }

  const name = role === 'admin' ? 'Admin' : role === 'counsellor' ? 'Counsellor' : ''
  const initials = name ? name.charAt(0).toUpperCase() : ''

  return (
    <AppBar position="static" color="primary" sx={{ mb: 2 }}>
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(role === 'admin' ? '/admin/dashboard' : '/login')}>
          <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>CP</Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Client Platform</Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {token ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {role === 'admin' && (
              <>
                <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>Dashboard</Button>
                <Button color="inherit" onClick={() => navigate('/admin/users')}>Users</Button>
                <Button color="inherit" onClick={() => navigate('/admin/external-db')}>User DB</Button>
              </>
            )}
            {role === 'counsellor' && (
              <Button color="inherit" onClick={() => navigate('/counsellor/dashboard')}>Dashboard</Button>
            )}

            <IconButton color="inherit" size="small" onClick={() => navigate('/admin/dashboard')}>
              <Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>
            </IconButton>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
