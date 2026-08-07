import React, { useState } from 'react';
import { Command, ArrowRight, Lock, Terminal, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TOTAL_COLS = 48;
const SCALE_FACTOR = 0.35; // ~65% reduction for fine precision grid
const BASE_DOT_SIZES = [5, 10, 16, 26];
const TOP_DOT_SIZES = BASE_DOT_SIZES.map((size) => size * SCALE_FACTOR); // [1.75, 3.5, 5.6, 9.1]
const BOTTOM_DOT_SIZES = [...TOP_DOT_SIZES].reverse(); // [9.1, 5.6, 3.5, 1.75]

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LandingView() {
  const [email, setEmail] = useState('lead.architect@enterprise.dev');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleGitHubLogin = () => {
    window.location.href = `${API_BASE}/auth/github`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(false);

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.token) {
        login(data.token);
      } else {
        throw new Error('No authorization token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Connection to authentication server failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-y-auto antialiased font-outfit selection:bg-zinc-700 text-white">
      <style>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.4);
            opacity: 0.2;
          }
        }
      `}</style>
      {/* Top Section (The Dark Hero Pitch) */}
      <section className="w-full min-h-[85vh] bg-black flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        <div className="max-w-3xl w-full space-y-8 z-10 my-auto">
          {/* Centered Branding Logo */}
          <div className="flex items-center justify-center gap-3 w-fit mx-auto">
            <div className="flex items-center justify-center">
              <Command className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold tracking-tight text-2xl text-white font-tech">
              Dev Assist AI
            </span>
          </div>

          {/* Centered Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-outfit tracking-tight text-white leading-tight max-w-3xl mx-auto">
            Engineering Intelligence, Institutionalized.
          </h1>

          {/* Centered Subheadline */}
          <p className="text-zinc-400 font-outfit text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
            Transform PRDs into enterprise architecture in seconds. Triage production incidents instantly with RAG-powered contextual memory.
          </p>

          {/* Centered Developer Terminal Mockup */}
          <div className="pt-4 max-w-2xl w-full mx-auto">
            <div className="bg-black border border-zinc-800 rounded-lg p-5 shadow-2xl relative text-left">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-tech font-bold text-zinc-400 ml-2 uppercase tracking-wider">
                    DEVOPS TELEMETRY SHELL
                  </span>
                </div>
                <span className="text-[10px] font-tech text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-0.5 rounded font-bold">
                  LIVE RAG CONNECTED
                </span>
              </div>
              
              <div className="font-fira text-xs space-y-2.5 leading-relaxed text-zinc-300">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-emerald-400 font-bold">$</span>
                  <span>dev-assist triage --context git:main --jira DEV-402</span>
                </div>
                <div className="text-zinc-400">
                  <span className="text-yellow-400 font-bold">[!]</span> Stack trace ingested: PoolExhaustedError in /services/matchmaking.js
                </div>
                <div className="text-zinc-400">
                  <span className="text-emerald-400 font-bold">[✓]</span> RAG correlation: 99.4% confidence (Commit <span className="text-white font-bold">a1b2c3d</span>)
                </div>
                <div className="text-emerald-400 font-bold bg-zinc-900/50 p-3 rounded border border-zinc-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Generated zero-leak remediation patch via PostgreSQL connection pooling</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle scroll hint */}
        <div className="mt-12 text-zinc-500 flex flex-col items-center gap-1 text-xs font-tech font-bold uppercase tracking-widest animate-pulse z-10">
          <span>Sign in below</span>
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </div>

        {/* Dynamic Full-Width Halftone Top Boundary (White Dots on Black) */}
        <div className="absolute bottom-0 left-0 w-full h-24 flex justify-between items-end px-4 pointer-events-none z-0 pb-2.5 overflow-hidden">
          {Array.from({ length: TOTAL_COLS }).map((_, index) => {
            const distance = Math.abs(index - (TOTAL_COLS - 1) / 2) / ((TOTAL_COLS - 1) / 2);
            const scale = Math.max(0.15, distance);
            return (
              <div key={index} className="flex flex-col items-center gap-2 justify-end">
                {TOP_DOT_SIZES.map((size, dotIdx) => (
                  <div
                    key={dotIdx}
                    className="bg-white rounded-full transition-all"
                    style={{
                      width: `${size * scale}px`,
                      height: `${size * scale}px`,
                      opacity: dotIdx === 0 ? 0.5 : dotIdx === 1 ? 0.75 : 1,
                      animation: 'breathe 4s ease-in-out infinite',
                      animationDelay: `${(index % 10) * 0.4}s`,
                      transformOrigin: 'center',
                      willChange: 'transform, opacity',
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Section (The Light Auth Gateway) */}
      <section className="w-full min-h-[50vh] bg-zinc-100 flex items-center justify-center py-20 px-6 relative overflow-hidden">
        {/* Dynamic Full-Width Halftone Bottom Boundary (Dark Dots on Light) */}
        <div className="absolute top-0 left-0 w-full h-24 flex justify-between items-start px-4 pointer-events-none z-0 pt-2.5 overflow-hidden">
          {Array.from({ length: TOTAL_COLS }).map((_, index) => {
            const distance = Math.abs(index - (TOTAL_COLS - 1) / 2) / ((TOTAL_COLS - 1) / 2);
            const scale = Math.max(0.15, distance);
            return (
              <div key={index} className="flex flex-col items-center gap-2 justify-start">
                {BOTTOM_DOT_SIZES.map((size, dotIdx) => (
                  <div
                    key={dotIdx}
                    className="bg-zinc-950 rounded-full transition-all"
                    style={{
                      width: `${size * scale}px`,
                      height: `${size * scale}px`,
                      opacity: dotIdx === 3 ? 0.5 : dotIdx === 2 ? 0.75 : 1,
                      animation: 'breathe 4s ease-in-out infinite',
                      animationDelay: `${(index % 10) * 0.4}s`,
                      transformOrigin: 'center',
                      willChange: 'transform, opacity',
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* Login Card - Pure bg-white container with deep custom shadow */}
        <div className="bg-white rounded-xl border border-zinc-300 p-8 w-full max-w-md shadow-[0_8px_24px_rgba(0,0,0,0.15)] text-zinc-950 z-10">
          <div className="space-y-1.5 mb-8">
            <h2 className="text-2xl font-bold font-outfit text-zinc-950 tracking-tight">
              Welcome back
            </h2>
            <p className="text-xs font-outfit text-zinc-500 font-medium">
              Sign in to access your Dev Assist AI institutional workspace.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-tech font-bold uppercase text-zinc-600 tracking-wider mb-1.5">
                ENTERPRISE EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lead.developer@company.com"
                required
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white text-xs text-zinc-950 font-outfit font-bold rounded-lg p-3.5 outline-none transition-colors shadow-inner placeholder:text-zinc-400 placeholder:font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-tech font-bold uppercase text-zinc-600 tracking-wider">
                  PASSWORD / TOKEN
                </label>
                <span className="text-xs text-zinc-500 font-bold hover:text-zinc-950 cursor-pointer transition-colors">
                  Forgot?
                </span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white text-xs text-zinc-950 font-outfit font-bold rounded-lg p-3.5 outline-none transition-colors shadow-inner tracking-widest placeholder:text-zinc-400 placeholder:font-medium placeholder:tracking-normal"
              />
            </div>

            <div className="pt-2">
              {/* Primary Sign In Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-lg bg-black hover:bg-zinc-900 text-white font-bold font-outfit text-xs tracking-wide uppercase transition-all border border-zinc-800 shadow-[0_4px_14px_rgba(0,0,0,0.2)] active:translate-y-[0.5px] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-white flex-shrink-0" />
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 text-white ml-0.5" />
              </button>
            </div>
          </form>

          {/* Footer Security Badge */}
          <div className="mt-8 pt-6 border-t border-zinc-200/80">
            <div className="flex flex-col items-center gap-1.5 mt-6">
              <div className="flex items-center gap-2 text-xs font-tech font-bold text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>256-BIT TLS ENCRYPTED RAG TELEMETRY</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-tech font-bold text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>END TO END ENCRYPTED WITH PASSWORD HASHING</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
