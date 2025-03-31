import { useState } from "react";
import { Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";

const CreateShipment = () => {
    const [weight, setWeight] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [productType, setProductType] = useState("");
    const [address, setAddress] = useState("");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleCloseSnackbar = (reason?: string) => {
        if (reason === "clickaway") return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");

        if (!weight || !dimensions || !productType || !address) {
            setSnackbar({
                open: true,
                message: "Todos los campos son obligatorios.",
                severity: "warning",
            });
            return;
        }
        if (parseFloat(weight) <= 0) {
            setSnackbar({
                open: true,
                message: "EL peso debe ser mayor a 0.",
                severity: "warning",
            });
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/shipments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    weight: parseFloat(weight),
                    dimensions,
                    product_type: productType,
                    address,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSnackbar({
                    open: true,
                    message: "Envio registrado exitosamente.",
                    severity: "success",
                });
                setWeight("");
                setDimensions("");
                setProductType("");
                setAddress("");
            } else {
                setSnackbar({
                    open: true,
                    message: data.error || "Error registering shipment.",
                    severity: "error",
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error de red.",
                severity: "error",
            });
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography
                variant="h6"
                align="center"
                color="black"
                sx={{ fontWeight: "bold" }}
            >
                Crear Envio
            </Typography>
            <TextField
                label="Peso (kg)"
                variant="outlined"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                fullWidth
                InputProps={{
                    style: {
                        borderRadius: 50,

                    },
                }}
            />
            <TextField
                label="Dimensiones (LxWxH)"
                variant="outlined"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                fullWidth
                InputProps={{
                    style: {
                        borderRadius: 50,

                    },
                }}
            />
            <TextField
                label="Tipo de Producto"
                variant="outlined"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                fullWidth
                InputProps={{
                    style: {
                        borderRadius: 50,

                    },
                }}
            />
            <TextField
                label="Dirección de Entrega"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                InputProps={{
                    style: {
                        borderRadius: 50,

                    },
                }}
            />

            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{
                    maxWidth: 400,
                    mb: 2,
                    borderRadius: 50,
                    py: 1.5,
                    alignSelf: "center",
                    marginTop: "10px",
                    backgroundColor: '#FF6F00',
                    '&:hover': { backgroundColor: '#e65a00' }
                }}
            >
                Registrar Envio
            </Button>
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
        </Box>
    );
};

export default CreateShipment;
