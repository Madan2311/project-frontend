// src/pages/Admin/RoutesSection.tsx
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

interface RouteData {
  id: number;
  name: string;
  origin: string;
  destination: string;
  description?: string;
}

const RoutesSection: React.FC = () => {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    origin: '',
    destination: '',
    description: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const token = localStorage.getItem('token');

  // Función para obtener rutas
  const fetchRoutesData = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/routes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRoutes(data.routes);
      } else {
        setSnackbar({ open: true, message: data.error || 'Error fetching routes', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchRoutesData();
  }, [token]);

  // Función para manejar el cambio en el formulario de nuevo registro
  const handleNewRouteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoute({
      ...newRoute,
      [e.target.name]: e.target.value,
    });
  };

  // Función para guardar la nueva ruta
  const handleAddRoute = async () => {
    // Validación básica
    if (!newRoute.name || !newRoute.origin || !newRoute.destination) {
      setSnackbar({ open: true, message: 'Name, Origin, and Destination are required.', severity: 'warning' });
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRoute),
      });
      const data = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, message: 'Route created successfully.', severity: 'success' });
        // Actualizar la lista de rutas sin recargar la página
        setRoutes(prev => [...prev, { id: data.result.insertId, ...newRoute }]);
        setNewRoute({ name: '', origin: '', destination: '', description: '' });
        setIsAdding(false);
      } else {
        setSnackbar({ open: true, message: data.error || 'Error creating route.', severity: 'error' });
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5" gutterBottom color="black">
          Gestión de Rutas
        </Typography>
        {!isAdding && (
          <Button variant="contained" onClick={() => setIsAdding(true)}>
            Add New Route
          </Button>
        )}
      </Box>

      {/* Formulario para agregar nueva ruta */}
      {isAdding && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            New Route
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Route Name"
              name="name"
              variant="outlined"
              value={newRoute.name}
              onChange={handleNewRouteChange}
              fullWidth
            />
            <TextField
              label="Origin"
              name="origin"
              variant="outlined"
              value={newRoute.origin}
              onChange={handleNewRouteChange}
              fullWidth
            />
            <TextField
              label="Destination"
              name="destination"
              variant="outlined"
              value={newRoute.destination}
              onChange={handleNewRouteChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              variant="outlined"
              value={newRoute.description}
              onChange={handleNewRouteChange}
              fullWidth
              multiline
              rows={2}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleAddRoute}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Tabla de rutas */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Origin</strong></TableCell>
              <TableCell><strong>Destination</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>{route.id}</TableCell>
                <TableCell>{route.name}</TableCell>
                <TableCell>{route.origin}</TableCell>
                <TableCell>{route.destination}</TableCell>
                <TableCell>{route.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar para notificaciones */}
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

export default RoutesSection;
