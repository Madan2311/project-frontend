import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';
import ShipmentStatusTracker from './ShipmentStatusTracker';

const ShipmentTrackingSection: React.FC = () => {
  const [shipmentId, setShipmentId] = useState<number | null>(null);
  const [inputId, setInputId] = useState("");

  const handleTrack = () => {
    const id = Number(inputId);
    if (id > 0) {
      setShipmentId(id);
    } else {
      setShipmentId(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputId(e.target.value);
    setShipmentId(null);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" color="black" gutterBottom>
        Seguimiento de Envíos
      </Typography>
      <Card sx={{ p: 2, mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="ID de Envío"
              variant="outlined"
              value={inputId}
              onChange={handleChange}
              sx={{ width: '200px' }}
            />
            <Button variant="contained" onClick={handleTrack}>
              Buscar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {shipmentId && (
        <ShipmentStatusTracker shipmentId={shipmentId} />
      )}
    </Container>
  );
};

export default ShipmentTrackingSection;
