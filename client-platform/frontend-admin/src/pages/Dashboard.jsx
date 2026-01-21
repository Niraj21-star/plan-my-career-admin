import React, { useEffect, useState } from 'react'
import { Container, Grid, Paper, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material'
import api from '../services/api'

export default function Dashboard() {
  const [kpis, setKpis] = useState(null)
  const [openAssign, setOpenAssign] = useState(false)
  const [users, setUsers] = useState([])
  const [counsellors, setCounsellors] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedCounsellor, setSelectedCounsellor] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await api.get('/admin/dashboard')
        if (mounted) setKpis(res.data)
      } catch (err) {
        console.error('Failed to load dashboard', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const loadAssignData = async () => {
    try {
      const [usersRes, counsellorsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/counsellors')
      ])
      setUsers(usersRes.data)
      setCounsellors(counsellorsRes.data)
    } catch (err) {
      console.error('Failed to load assign data', err)
      setSnackbar({ open: true, message: 'Failed to load data', severity: 'error' })
    }
  }

  const handleAssignOpen = () => {
    setOpenAssign(true)
    loadAssignData()
  }

  const handleAssignClose = () => {
    setOpenAssign(false)
    setSelectedUser('')
    setSelectedCounsellor('')
  }

  const handleAssignSubmit = async () => {
    if (!selectedUser || !selectedCounsellor) {
      setSnackbar({ open: true, message: 'Please select both user and counsellor', severity: 'warning' })
      return
    }
    try {
      await api.put('/admin/assign-counsellor', { userId: selectedUser, counsellorId: selectedCounsellor })
      setSnackbar({ open: true, message: 'Counsellor assigned successfully', severity: 'success' })
      handleAssignClose()
    } catch (err) {
      console.error('Assign error', err)
      setSnackbar({ open: true, message: 'Failed to assign counsellor', severity: 'error' })
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{kpis?.totalUsers ?? '—'}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Tests Taken</Typography>
            <Typography variant="h4">{kpis?.testsTaken ?? '—'}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Reports</Typography>
            <Typography variant="h4">{kpis?.reports ?? '—'}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Revenue</Typography>
            <Typography variant="h4">{kpis?.revenue ? `$${kpis.revenue}` : '—'}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Quick Summary</Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">Counsellors: {kpis?.totalCounsellors ?? '—'}</Typography>
              <Typography variant="body2">Admins: {kpis?.totalAdmins ?? '—'}</Typography>
              <Typography variant="body2">Bookings: {kpis?.bookings ?? 0}</Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleAssignOpen}>
                  Assign Counsellors
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openAssign} onClose={handleAssignClose} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Counsellor to User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="user-select-label">Select User</InputLabel>
              <Select
                labelId="user-select-label"
                value={selectedUser}
                label="Select User"
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {users.map(u => (
                  <MenuItem key={u._id} value={u._id}>{u.name || u.email}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="counsellor-select-label">Select Counsellor</InputLabel>
              <Select
                labelId="counsellor-select-label"
                value={selectedCounsellor}
                label="Select Counsellor"
                onChange={(e) => setSelectedCounsellor(e.target.value)}
              >
                {counsellors.map(c => (
                  <MenuItem key={c._id} value={c._id}>{c.name || c.email}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssignClose}>Cancel</Button>
          <Button onClick={handleAssignSubmit} variant="contained">Assign</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
