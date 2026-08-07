import React from 'react';
import { Navigate } from 'react-router-dom';
import LandingView from '../components/LandingView';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <LandingView />;
}
