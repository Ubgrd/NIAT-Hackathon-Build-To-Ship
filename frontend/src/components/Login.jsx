import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Command, Mail, Lock, ArrowRight, ShieldAlert, Loader2, Building2 } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            });

            if (error) {
                throw error;
            }

            if (data.session) {
                onLoginSuccess(data.session);
            }
        } catch (err) {
            setErrorMsg(err.message || 'Authentication failed. Please verify your corporate credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-black text-zinc-100 font-outfit flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

            {/* Main Login Card */}
            <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-10 relative">

                {/* Top Enterprise Logo & Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white mb-4 shadow-inner">
                        <Command className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white font-outfit">
                        Dev Assist AI
                    </h1>
                    <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-tech text-zinc-400">
                        <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Enterprise Member Portal</span>
                    </div>
                </div>

                {/* Error Alert Box */}
                {errorMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-start gap-3 animate-in fade-in duration-150">
                        <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="leading-relaxed font-outfit">{errorMsg}</div>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 tracking-wider uppercase mb-2 font-tech">
                            Corporate Email ID
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="developer@organization.com"
                                className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-zinc-500 text-sm font-medium text-white rounded-xl px-4 py-3 pl-11 focus:outline-none transition-colors placeholder:text-zinc-600 font-outfit"
                            />
                            <Mail className="w-4.5 h-4.5 text-zinc-500 absolute left-4 top-3.5 pointer-events-none" />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 tracking-wider uppercase mb-2 font-tech">
                            Security Access Token / Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-zinc-500 text-sm font-medium text-white rounded-xl px-4 py-3 pl-11 focus:outline-none transition-colors placeholder:text-zinc-600 font-outfit"
                            />
                            <Lock className="w-4.5 h-4.5 text-zinc-500 absolute left-4 top-3.5 pointer-events-none" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3.5 px-5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs tracking-wide uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:pointer-events-none cursor-pointer border border-white shadow-xl active:translate-y-[0.5px] font-outfit"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                                <span>Verifying Credentials...</span>
                            </>
                        ) : (
                            <>
                                <span>Authenticate Session</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Corporate Notice Footer */}
                <div className="mt-8 pt-5 border-t border-zinc-800/60 text-center">
                    <p className="text-[11px] text-zinc-500 font-medium font-outfit leading-relaxed">
                        Access restricted to authorized corporate personnel. Account provisioning is managed by your engineering administrator.
                    </p>
                </div>
            </div>
        </div>
    );
}