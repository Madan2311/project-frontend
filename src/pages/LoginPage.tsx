import React, { useContext, useState } from 'react';
import { Box, Button, TextField, Typography, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                console.log(data);
                login(data.token);
                localStorage.setItem("token", data.token);
                localStorage.setItem("userRole", data.user.role);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Credeciales incorrectas');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <Box className="relative w-screen h-screen">
            <Box
                className="absolute inset-0 bg-cover bg-center bg-auth"
            />
            <Box
                className="absolute inset-0"
                style={{ backgroundColor: "rgba(33, 150, 243, 0.5)" }}
            />
            <Box className="relative z-10 flex items-center justify-center w-full h-full">
                <Paper
                    elevation={3}
                    className="rounded-3xl overflow-hidden max-w-md w-full"
                >

                    <Box className="p-4">
                        <Box className="p-1 flex flex-col items-center">
                            <Typography variant="h5" className="font-bold mb-4">
                                Iniciar sesión
                            </Typography>
                            <div className="relative w-full mt-5">
                                <TextField
                                    label="Correo electrónico"
                                    fullWidth
                                    variant="outlined"
                                    className="mt-5"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputProps={{
                                        style: {
                                            borderRadius: 50,

                                        },
                                    }}
                                />
                            </div>
                            <div className="relative w-full mt-5">
                                <TextField
                                    label="Contraseña"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    className="mt-5"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        style: {
                                            borderRadius: 50,
                                        },
                                    }}
                                />
                            </div>
                            {error && (
                                <Typography variant="body2" color="error" sx={{ mb: 2, maxWidth: 400, textAlign: 'center' }}>
                                    {error}
                                </Typography>
                            )}
                            <div className="relative w-full mt-5">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="mb-2 mt-5 w-full"
                                    sx={{
                                        maxWidth: 400,
                                        mb: 2,
                                        borderRadius: 50,
                                        py: 1.5,
                                        marginTop: "10px",
                                        backgroundColor: '#FF6F00',
                                        '&:hover': { backgroundColor: '#e65a00' }
                                    }}
                                    onClick={handleLogin}>
                                    Continuar
                                </Button>
                            </div>

                            <Link href="/register" underline="hover" sx={{ color: 'primary.main' }}>
                                Crear una cuenta
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>

    );
};

export default LoginPage;