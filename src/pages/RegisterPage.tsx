import React, { useContext, useState } from 'react';
import { Box, Button, TextField, Typography, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        setError('');
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            console.log(res.ok);
            if (res.ok) {
                login(data.token);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Fallo en el registro');
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
                                Crear cuenta
                            </Typography>
                            <div className="relative w-full mt-5">
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    fullWidth
                                    sx={{ maxWidth: 400, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
                                />
                            </div>
                            <div className="relative w-full">
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    fullWidth
                                    sx={{ maxWidth: 400, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
                                />
                            </div>
                            <div className="relative w-full">
                                <TextField
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    fullWidth
                                    sx={{ maxWidth: 400, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
                                />
                            </div>
                            <div className="relative w-full">
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    variant="outlined"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    fullWidth
                                    sx={{ maxWidth: 400, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
                                />
                            </div>
                            {error && (
                                <Typography variant="body2" color="error" sx={{ mb: 2, maxWidth: 400, textAlign: 'center' }}>
                                    {error}
                                </Typography>
                            )}
                            <div className="relative w-full">
                                <Button
                                    variant="contained"
                                    onClick={handleRegister}
                                    fullWidth
                                    sx={{
                                        maxWidth: 400,
                                        mb: 2,
                                        borderRadius: 50,
                                        py: 1.5,
                                        backgroundColor: '#FF6F00',
                                        '&:hover': { backgroundColor: '#e65a00' },
                                    }}
                                >
                                    Registrarse
                                </Button>
                            </div>

                            <Link href="/login" underline="hover" sx={{ color: 'primary.main' }}>
                                ¿Ya tienes cuenta? Inicia sesión
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default RegisterPage;
