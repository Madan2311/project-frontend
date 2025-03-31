import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';

interface CarrierData {
  id: number;
  name: string;
  contact_info: string;
  vehicle_id: number | null;
}

const CarriersSection: React.FC = () => {
  const [carriers, setCarriers] = useState<CarrierData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCarrier, setNewCarrier] = useState({
    name: '',
    contact_info: '',
    vehicle_id: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const token = localStorage.getItem('token');

  const fetchCarriersData = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/carriers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCarriers(data.carriers);
      } else {
        setSnackbar({ open: true, message: data.error || 'Error fetching carriers', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchCarriersData();
  }, [token]);

  const handleNewCarrierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCarrier({
      ...newCarrier,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCarrier = async () => {
    if (!newCarrier.name || !newCarrier.contact_info) {
      setSnackbar({ open: true, message: 'Name and Contact Info are required.', severity: 'warning' });
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/carriers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCarrier.name,
          contactInfo: newCarrier.contact_info,
          vehicleId: newCarrier.vehicle_id ? Number(newCarrier.vehicle_id) : null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, message: 'Carrier created successfully.', severity: 'success' });
        setCarriers(prev => [...prev, { id: data.result.insertId, name: newCarrier.name, contact_info: newCarrier.contact_info, vehicle_id: newCarrier.vehicle_id ? Number(newCarrier.vehicle_id) : null }]);
        setNewCarrier({ name: '', contact_info: '', vehicle_id: '' });
        setIsAdding(false);
      } else {
        setSnackbar({ open: true, message: data.error || 'Error creating carrier.', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
      }}>
        <Typography variant="h5" gutterBottom color="black">
          Manage Carriers
        </Typography>
        {!isAdding && (
          <Button variant="contained" onClick={() => setIsAdding(true)} sx={{ mb: 2 }}>
            Add New Carrier
          </Button>
        )}
      </Box>
      {isAdding && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            New Carrier
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              variant="outlined"
              value={newCarrier.name}
              onChange={handleNewCarrierChange}
              fullWidth
            />
            <TextField
              label="Contact Info"
              name="contact_info"
              variant="outlined"
              value={newCarrier.contact_info}
              onChange={handleNewCarrierChange}
              fullWidth
            />
            <TextField
              label="Vehicle ID (optional)"
              name="vehicle_id"
              variant="outlined"
              value={newCarrier.vehicle_id}
              onChange={handleNewCarrierChange}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleAddCarrier}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Contact Info</strong></TableCell>
              <TableCell><strong>Vehicle ID</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carriers.map((carrier) => (
              <TableRow key={carrier.id}>
                <TableCell>{carrier.id}</TableCell>
                <TableCell>{carrier.name}</TableCell>
                <TableCell>{carrier.contact_info}</TableCell>
                <TableCell>{carrier.vehicle_id ? carrier.vehicle_id : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CarriersSection;
