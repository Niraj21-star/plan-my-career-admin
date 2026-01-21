import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip
} from '@mui/material'
import api from '../services/api'

export default function ExternalDb() {
  const [collections, setCollections] = useState([])
  const [collectionName, setCollectionName] = useState('')
  const [documents, setDocuments] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(25)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openDoc, setOpenDoc] = useState(null)

  useEffect(() => {
    let mounted = true
    setError('')
    api.get('/external-db/collections')
      .then(res => {
        if (!mounted) return
        setCollections(res.data.collections || [])
      })
      .catch(err => {
        if (!mounted) return
        const msg = err?.response?.data?.message || err.message || 'Failed to load collections'
        setError(msg)
      })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!collectionName) return
    let mounted = true
    setLoading(true)
    setError('')
    api.get(`/external-db/collections/${encodeURIComponent(collectionName)}`, {
      params: { page, limit, q }
    })
      .then(res => {
        if (!mounted) return
        setDocuments(res.data.documents || [])
        setTotal(res.data.total || 0)
      })
      .catch(err => {
        if (!mounted) return
        const msg = err?.response?.data?.message || err.message || 'Failed to load documents'
        setError(msg)
        setDocuments([])
        setTotal(0)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [collectionName, page, limit, q])

  const columns = useMemo(() => {
    const first = documents?.[0]
    if (!first) return []
    const keys = Object.keys(first)
    // show a few keys first; rest available in “View”
    const preferred = ['_id', 'name', 'email', 'phone', 'status', 'createdAt', 'updatedAt']
    const ordered = [...new Set([...preferred.filter(k => keys.includes(k)), ...keys])]
    return ordered.slice(0, 6)
  }, [documents])

  const totalPages = Math.max(Math.ceil(total / limit), 1)

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>User Website DB</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 260 }}>
            <InputLabel id="collection-label">Collection</InputLabel>
            <Select
              labelId="collection-label"
              value={collectionName}
              label="Collection"
              onChange={(e) => { setCollectionName(e.target.value); setPage(1) }}
            >
              {collections.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            placeholder="name / email / phone / status"
          />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button variant="outlined" disabled={page <= 1 || loading} onClick={() => setPage(p => Math.max(p - 1, 1))}>Prev</Button>
            <Typography variant="body2">Page {page} / {totalPages}</Typography>
            <Button variant="outlined" disabled={page >= totalPages || loading} onClick={() => setPage(p => Math.min(p + 1, totalPages))}>Next</Button>
          </Box>
        </Box>

        {error && <Typography sx={{ mt: 2 }} color="error">{error}</Typography>}
        {!error && collectionName && (
          <Typography sx={{ mt: 2 }} variant="body2">
            {loading ? 'Loading…' : `Showing ${documents.length} of ${total} records`}
          </Typography>
        )}
      </Paper>

      <Paper>
        <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          {collectionName ? <Chip label={collectionName} color="primary" /> : null}
          <Typography variant="body2" color="text.secondary">{collectionName ? `Showing ${documents.length} records` : 'Choose a collection'}</Typography>
        </Box>
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col}>{col}</TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!collectionName || documents.length === 0) && (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  {collectionName ? 'No records found' : 'Select a collection to view records'}
                </TableCell>
              </TableRow>
            )}
            {documents.map((doc) => (
              <TableRow key={String(doc._id || Math.random())} hover>
                {columns.map((col) => (
                  <TableCell key={col}>
                    {renderCell(doc?.[col])}
                  </TableCell>
                ))}
                <TableCell align="right">
                  <Button size="small" onClick={() => setOpenDoc(doc)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Box>
      </Paper>

      <Dialog open={!!openDoc} onClose={() => setOpenDoc(null)} maxWidth="md" fullWidth>
        <DialogTitle>Document</DialogTitle>
        <DialogContent dividers>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {openDoc ? JSON.stringify(openDoc, null, 2) : ''}
          </pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDoc(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

function renderCell(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  // ObjectId/date/objects
  try {
    const str = JSON.stringify(value)
    return str.length > 140 ? str.slice(0, 140) + '…' : str
  } catch {
    return String(value)
  }
}
