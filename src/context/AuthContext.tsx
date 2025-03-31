import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {}
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setToken(null);
        navigate('/login');
    }

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    )

}