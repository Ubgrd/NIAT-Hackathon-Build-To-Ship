// frontend/src/hooks/useAuth.js
// Custom hook for authentication state management.
// Stores JWT in localStorage, decodes user info, provides login/logout.

import { useState, useEffect, createContext, useContext } from 'react';
import apiFetch from '../lib/apiFetch';

const AuthContext = createContext(null);

/**
 * AuthProvider — Wraps the app and provides auth state to all children.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // On mount or when token changes, verify the token and fetch user info
    useEffect(() => {
        async function verifyToken() {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await apiFetch('get', '/auth/me');
                setUser(response.data.user);
            } catch (error) {
                // Token is invalid or expired — clear it
                console.warn('Token verification failed:', error.message);
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        verifyToken();
    }, [token]);

    // Called after GitHub OAuth callback with the JWT token
    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * useAuth — Hook to access auth state from any component.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default useAuth;
