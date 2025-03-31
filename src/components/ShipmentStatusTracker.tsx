import React, { useEffect, useState } from "react";
import { Box, Typography, Snackbar, Alert, Card, CardContent } from "@mui/material";
import socket from "../services/socket";

interface ShipmentStatusTrackerProps {
  shipmentId: number;
}

const ShipmentStatusTracker: React.FC<ShipmentStatusTrackerProps> = ({ shipmentId }) => {
  const [currentStatus, setCurrentStatus] = useState<string>("Unknown");
  const [history, setHistory] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "info" | "success" | "error" | "warning",
  });
  const [notFound, setNotFound] = useState(false);
  const token = localStorage.getItem('token');

  const fetchShipmentStatus = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/shipments/${shipmentId}/status`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        if (data.currentStatus === "Unknown") {
          setNotFound(true);
          setCurrentStatus("Unknown");
          setHistory([]);
        } else {
          setNotFound(false);
          setCurrentStatus(data.currentStatus);
          setHistory(data.history || []);
        }
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching shipment status:", error);
      setNotFound(true);
    }
  };

  useEffect(() => {
    fetchShipmentStatus();

    console.log("Emitiendo subscribeShipment con ID:", shipmentId);
    socket.emit("subscribeShipment", shipmentId);

    socket.on("shipmentStatusUpdated", (data: { shipmentId: number; newStatus: string }) => {
      if (data.shipmentId === shipmentId) {
        console.log("Recibido evento shipmentStatusUpdated:", data);
        setCurrentStatus(data.newStatus);
        setHistory(prev => [data.newStatus, ...prev]);
        setSnackbar({ open: true, message: `Status updated to ${data.newStatus}`, severity: "info" });
      }
    });

    return () => {
      socket.off("shipmentStatusUpdated");
    };
  }, [shipmentId]);

  const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        {notFound ? (
          <Typography variant="body1" color="error">
            No se encontró el envío #{shipmentId}.
          </Typography>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Shipment #{shipmentId} Tracker
            </Typography>
            <Typography variant="body1">
              <strong>Current Status:</strong> {currentStatus}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>History:</strong>
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {history.map((status, index) => (
                <li key={index}>{status}</li>
              ))}
            </Box>
          </Box>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default ShipmentStatusTracker;
