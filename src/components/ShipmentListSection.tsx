import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button,
    Snackbar,
    Alert,
} from '@mui/material';

interface Shipment {
    id: number;
    address: string;
    status: string;
    // otros campos opcionales...
}

const ShipmentListSection: React.FC = () => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning' | 'info',
    });

    const token = localStorage.getItem('token');

    // Función para obtener envíos, opcionalmente filtrados
    const fetchShipments = async (status: string) => {
        try {
            let url = 'http://localhost:3000/api/shipments';
            if (status !== 'All') {
                url += `?status=${encodeURIComponent(status)}`;
            }
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

    useEffect(() => {
        fetchShipments(filterStatus);
    }, [filterStatus, token]);

    const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    // Función para actualizar el estado a "entregado"
    const handleMarkDelivered = async (shipmentId: number) => {
        try {
            const res = await fetch(`http://localhost:3000/api/shipments/${shipmentId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ newStatus: "Delivered" }),
            });
            const data = await res.json();
            if (res.ok) {
                setSnackbar({ open: true, message: 'Shipment marked as delivered', severity: 'success' });
                fetchShipments(filterStatus);
            } else {
                setSnackbar({ open: true, message: data.error || 'Error updating shipment status', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Network error', severity: 'error' });
        }
    };

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" color='black'>Lista de Envíos</Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="shipment-filter-label">Filtrar por Estado</InputLabel>
                    <Select
                        labelId="shipment-filter-label"
                        value={filterStatus}
                        label="Filtrar por Estado"
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <MenuItem value="All">Todos</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="In transit">In transit</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Address</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shipments.map((shipment) => (
                            <TableRow key={shipment.id}>
                                <TableCell>{shipment.id}</TableCell>
                                <TableCell>{shipment.address}</TableCell>
                                <TableCell>{shipment.status}</TableCell>
                                <TableCell>
                                    {shipment.status === "In transit" && (
                                        <Button variant="contained" size="small" onClick={() => handleMarkDelivered(shipment.id)}>
                                            Marcar como entregado
                                        </Button>
                                    )}
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

export default ShipmentListSection;
