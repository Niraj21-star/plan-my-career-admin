import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, List, ListItem, ListItemText, Button, Box, Snackbar, Alert } from '@mui/material'
import api from '../services/api'

export default function CounsellorDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await api.get('/counsellor/dashboard')
        if (mounted) setData(res.data)
      } catch (err) {
        console.error('Failed to load counsellor dashboard', err)
        if (mounted) setError(err?.response?.data?.message || err?.message || 'Failed to load')
      }
    }
    load()
    return () => { mounted = false }
  const handleStartCounselling = (student) => {
    // Placeholder: in real app, this could start a session, update DB, etc.
    setSnackbar({ open: true, message: `Counselling session started for ${student.name || student.email}`, severity: 'success' })
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Counsellor Dashboard</Typography>
      {error && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Assigned Students</Typography>
        <List>
          {(data?.assignedStudents || []).length === 0 && (
            <ListItem><ListItemText primary="No assigned students" /></ListItem>
          )}
          {(data?.assignedStudents || []).map(s => (
            <ListItem key={s._id} divider>
              <ListItemText primary={s.name || s.email} secondary={`Email: ${s.email}`} />
              <Box sx={{ ml: 2 }}>
                <Button variant="contained" size="small" onClick={() => handleStartCounselling(s)}>
                  Start Counselling
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
})}
