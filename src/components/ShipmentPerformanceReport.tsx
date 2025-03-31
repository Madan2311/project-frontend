import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Snackbar,
    Alert
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportData {
    carrierName: string;
    avgDeliveryTime: number;
    completedShipments: number;
}

interface CarrierData {
    id: number;
    name: string;
}

const ShipmentPerformanceReport: React.FC = () => {
    const [startDate, setStartDate] = useState('2025-01-01');
    const [endDate, setEndDate] = useState('2025-01-31');
    const [carrier, setCarrier] = useState<string>('');
    const [carriers, setCarriers] = useState<CarrierData[]>([]);
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning' | 'info'
    });
    const token = localStorage.getItem('token');

    const fetchReport = async () => {
        try {
            let url = `http://localhost:3000/api/shipments/report/advanced?startDate=${startDate}&endDate=${endDate}`;
            if (carrier) {
                url += `&carrier=${encodeURIComponent(carrier)}&page=1&pageSize=10`;
            }
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setReportData(data.report);
            } else {
                setSnackbar({ open: true, message: data.error || 'Error fetching report', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Network error', severity: 'error' });
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

    useEffect(() => {
        fetchReport();
        fetchCarriers();
    }, []);

    const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSearch = () => {
        fetchReport();
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h5" color='black' gutterBottom>
                Reporte de Desempeño de Envíos
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <TextField
                    label="Fecha Inicio"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ color: 'black' }}
                />
                <TextField
                    label="Fecha Fin"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="carrier-label">Transportista</InputLabel>
                    <Select
                        labelId="carrier-label"
                        label="Transportista"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                    >
                        <MenuItem value=""><em>Todos</em></MenuItem>
                        {carriers.map(c => (
                            <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleSearch}>
                    Buscar
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Transportista</strong></TableCell>
                            <TableCell><strong>Tiempo Promedio de Entrega (minutos)</strong></TableCell>
                            <TableCell><strong>Envíos Completados</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.carrierName}</TableCell>
                                <TableCell>
                                    {typeof row.avgDeliveryTime === 'number'
                                        ? row.avgDeliveryTime.toFixed(2)
                                        : row.avgDeliveryTime ? Number(row.avgDeliveryTime).toFixed(2) : 'N/A'}
                                </TableCell>
                                <TableCell>{row.completedShipments}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Gráfico de Desempeño
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="carrierName" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgDeliveryTime" fill="#8884d8" name="Tiempo Promedio (min)" />
                        <Bar dataKey="completedShipments" fill="#82ca9d" name="Envíos Completados" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>

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

export default ShipmentPerformanceReport;
