import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Button
} from '@mui/material';

interface Shipment {
  id: number;
  address: string;
  status: string;
  route?: string;
  carrier?: string;
  vehicle?: string;
}

interface RouteData {
  id: number;
  name: string;
}

interface CarrierData {
  id: number;
  name: string;
}

interface VehicleData {
  id: number;
  plate_number: string;
  capacity: number;
  type: string;
}

const ShipmentAssignmentSection: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [carriers, setCarriers] = useState<CarrierData[]>([]);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  
  const token = localStorage.getItem('token');
  const fixedStatus = "Pending";
  const fetchShipments = async (status: string) => {
    try {
      const url = `http://localhost:3000/api/shipments?status=${encodeURIComponent(status)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) {
        setShipments(data.shipments);
      } else {
        setSnackbar({ open: true, message: data.error || 'Error fetching shipments', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error', severity: 'error' });
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/routes', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setRoutes(data.routes);
      else setSnackbar({ open: true, message: data.error || 'Error fetching routes', severity: 'error' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error fetching routes', severity: 'error' });
    }
  };

  const fetchCarriers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/carriers', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setCarriers(data.carriers);
      else setSnackbar({ open: true, message: data.error || 'Error fetching carriers', severity: 'error' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error fetching carriers', severity: 'error' });
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/vehicles', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setVehicles(data.vehicles);
      else setSnackbar({ open: true, message: data.error || 'Error fetching vehicles', severity: 'error' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error fetching vehicles', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchShipments(fixedStatus);
    fetchRoutes();
    fetchCarriers();
    fetchVehicles();
  }, [token]);

  const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRouteChange = (shipmentId: number, newRoute: string) => {
    setShipments(prev => prev.map(s => s.id === shipmentId ? { ...s, route: newRoute } : s));
  };
  const handleCarrierChange = (shipmentId: number, newCarrier: string) => {
    setShipments(prev => prev.map(s => s.id === shipmentId ? { ...s, carrier: newCarrier } : s));
  };
  const handleVehicleChange = (shipmentId: number, newVehiclePlate: string) => {
    setShipments(prev => prev.map(s => s.id === shipmentId ? { ...s, vehicle: newVehiclePlate } : s));
  };

  const handleAssign = async (shipmentId: number, route: string, carrier: string, vehiclePlate: string) => {
    if (!route || !carrier || !vehiclePlate) {
      setSnackbar({ open: true, message: 'Route, Carrier and Vehicle are required.', severity: 'warning' });
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/shipments/assign', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shipmentId, route, carrier, vehicle: vehiclePlate }),
      });
      const data = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, message: 'Shipment assigned successfully', severity: 'success' });
        fetchShipments(fixedStatus);
      } else {
        setSnackbar({ open: true, message: data.error || 'Error assigning shipment', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error', severity: 'error' });
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" color='black' gutterBottom>
        Asignación de Envíos (Pendientes)
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Address</strong></TableCell>
              <TableCell><strong>Route</strong></TableCell>
              <TableCell><strong>Carrier</strong></TableCell>
              <TableCell><strong>Vehicle (Plate)</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map(shipment => (
              <TableRow key={shipment.id}>
                <TableCell>{shipment.id}</TableCell>
                <TableCell>{shipment.address}</TableCell>

                <TableCell>
                  <FormControl fullWidth size="small">
                    <InputLabel>Route</InputLabel>
                    <Select
                      value={shipment.route || ''}
                      label="Route"
                      onChange={e => handleRouteChange(shipment.id, e.target.value)}
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {routes.map(r => (
                        <MenuItem key={r.id} value={r.name}>{r.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell>
                  <FormControl fullWidth size="small">
                    <InputLabel>Carrier</InputLabel>
                    <Select
                      value={shipment.carrier || ''}
                      label="Carrier"
                      onChange={e => handleCarrierChange(shipment.id, e.target.value)}
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {carriers.map(c => (
                        <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell>
                  <FormControl fullWidth size="small">
                    <InputLabel>Vehicle</InputLabel>
                    <Select
                      value={shipment.vehicle || ''}
                      label="Vehicle"
                      onChange={e => handleVehicleChange(shipment.id, e.target.value)}
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {vehicles.map(v => (
                        <MenuItem key={v.id} value={v.plate_number}>
                          {v.plate_number} - {v.type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell>
                  <Button variant="contained" size="small" onClick={() => handleAssign(shipment.id, shipment.route || '', shipment.carrier || '', shipment.vehicle || '')}>
                    Asignar
                  </Button>
                </TableCell>
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

export default ShipmentAssignmentSection;
