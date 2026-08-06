import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthSuccess() {
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            login(token);
            navigate('/dashboard', { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white font-outfit">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mb-4" />
            <p className="text-sm text-zinc-400 font-tech">Completing GitHub authentication...</p>
        </div>
    );
}
