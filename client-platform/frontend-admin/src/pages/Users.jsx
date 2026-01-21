import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, List, ListItem, ListItemText, Avatar, ListItemAvatar, TextField, Box } from '@mui/material'
import api from '../services/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')

  useEffect(() => {
    let mounted = true
    api.get('/admin/users').then(res => { if (mounted) setUsers(res.data) }).catch(console.error)
    return () => { mounted = false }
  }, [])

  const filtered = users.filter(u => {
    if (!q) return true
    const t = q.toLowerCase()
    return (u.name || u.email || '').toLowerCase().includes(t)
  })

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="Search users" value={q} onChange={e => setQ(e.target.value)} fullWidth />
        </Box>
      </Paper>

      <Paper>
        <List dense>
          {filtered.length === 0 && <ListItem><ListItemText primary="No users found" /></ListItem>}
          {filtered.map(u => (
            <ListItem key={u._id} divider>
              <ListItemAvatar>
                <Avatar>{(u.name || u.email || 'U').charAt(0).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={u.name || u.email} secondary={`${u.email} • ${new Date(u.createdAt).toLocaleDateString()}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  )
}
