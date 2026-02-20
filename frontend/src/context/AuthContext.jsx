import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { 'x-auth-token': token }
            });
            setUser(res.data);
        } catch (err) {
            console.error(err);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const loginServer = async (email, password, role) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const registerServer = async (fullName, email, password, role) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { fullName, email, password, role });
            // Optionally auto-login, but PRD standard is to redirect.
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    };

    const logoutServer = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Keep original wrapper functions for backwards compatibility if needed, but 
    // export the real ones.
    const login = (role) => setUser({ role }); // Mock fallback just in case
    const logout = () => logoutServer();

    return (
        <AuthContext.Provider value={{ user, loading, loginServer, registerServer, logoutServer, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
