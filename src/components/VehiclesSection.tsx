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

interface VehicleData {
  id: number;
  plate_number: string;
  capacity: number;
  type: string;
  status: string;
}

const VehiclesSection: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    plate_number: '',
    capacity: '',
    type: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const token = localStorage.getItem('token');

  const fetchVehiclesData = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/vehicles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setVehicles(data.vehicles);
      } else {
        setSnackbar({ open: true, message: data.error || 'Error fetching vehicles', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchVehiclesData();
  }, [token]);

  const handleNewVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVehicle({
      ...newVehicle,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddVehicle = async () => {
    if (!newVehicle.plate_number || !newVehicle.capacity || !newVehicle.type) {
      setSnackbar({ open: true, message: 'All fields are required.', severity: 'warning' });
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plateNumber: newVehicle.plate_number,
          capacity: parseFloat(newVehicle.capacity),
          type: newVehicle.type,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, message: 'Vehicle created successfully.', severity: 'success' });
        setVehicles(prev => [...prev, { id: data.result.insertId, plate_number: newVehicle.plate_number, capacity: parseFloat(newVehicle.capacity), type: newVehicle.type, status: 'available' }]);
        setNewVehicle({ plate_number: '', capacity: '', type: '' });
        setIsAdding(false);
      } else {
        setSnackbar({ open: true, message: data.error || 'Error creating vehicle.', severity: 'error' });
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
          Manage Vehicles
        </Typography>
        {!isAdding && (
          <Button variant="contained" onClick={() => setIsAdding(true)} sx={{ mb: 2 }}>
            Add New Vehicle
          </Button>
        )}
      </Box>
      {isAdding && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            New Vehicle
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Plate Number"
              name="plate_number"
              variant="outlined"
              value={newVehicle.plate_number}
              onChange={handleNewVehicleChange}
              fullWidth
            />
            <TextField
              label="Capacity"
              name="capacity"
              variant="outlined"
              value={newVehicle.capacity}
              onChange={handleNewVehicleChange}
              fullWidth
            />
            <TextField
              label="Type"
              name="type"
              variant="outlined"
              value={newVehicle.type}
              onChange={handleNewVehicleChange}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleAddVehicle}>
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
              <TableCell><strong>Plate Number</strong></TableCell>
              <TableCell><strong>Capacity</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.id}</TableCell>
                <TableCell>{vehicle.plate_number}</TableCell>
                <TableCell>{vehicle.capacity}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.status}</TableCell>
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

export default VehiclesSection;
