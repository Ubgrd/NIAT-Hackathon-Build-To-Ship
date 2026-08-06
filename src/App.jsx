import React, { useState, useEffect } from 'react';
import { Layers, Cpu, Command, Download, LogOut, Sun, Moon } from 'lucide-react';
import { mockArchitectData, mockBrainData } from './mockData';
import ArchitectView from './components/ArchitectView';
import BrainView from './components/BrainView';
import LandingView from './components/LandingView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeMode, setActiveMode] = useState('architect');
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (!isAuthenticated) {
    return <LandingView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'dark' : ''}`}>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-black text-zinc-100 font-outfit font-medium antialiased selection:bg-zinc-700">
        {/* Floating Top Navigation Bar */}
        <header className="h-16 flex-shrink-0 mt-6 mx-6 mb-0 rounded-xl bg-[#0a0a0a] border border-white/10 px-6 flex items-center justify-between z-30 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
          {/* Left: Dev Assist AI Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <Command className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg text-zinc-100 font-tech">
              Dev Assist AI
            </span>
          </div>

          {/* Center: Segmented Mode Switcher */}
          <div className="flex items-center bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
            <button
              onClick={() => setActiveMode('architect')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs transition-all duration-150 cursor-pointer ${activeMode === 'architect'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
                : 'text-zinc-400 hover:text-zinc-100 font-medium'
                }`}
            >
              <Layers className="w-4 h-4" />
              <span>Architect Mode (System Design)</span>
            </button>

            <button
              onClick={() => setActiveMode('brain')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs transition-all duration-150 cursor-pointer ${activeMode === 'brain'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
                : 'text-zinc-400 hover:text-zinc-100 font-medium'
                }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Institutional Brain (DevOps Triage)</span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setIsDarkMode(prev => !prev)}
              className="w-12 h-6 rounded-full bg-zinc-300 dark:bg-zinc-700 relative transition-colors flex items-center px-1 mr-4 cursor-pointer"
            >
              <Sun className="w-3 h-3 text-zinc-500 absolute left-1.5" />
              <Moon className="w-3 h-3 text-zinc-400 absolute right-1.5" />
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute transition-transform duration-300 z-10 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>

            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/20 bg-black text-zinc-100 hover:bg-white/10 text-xs font-bold shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-colors duration-150 active:translate-y-[0.5px] cursor-pointer">
              <Download className="w-4 h-4" />
              <span>Export Blueprint</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              title="Sign Out of Institutional Workspace"
              className="flex items-center gap-1.5 p-2 rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Body Viewport */}
        <main className="flex-1 w-full overflow-hidden relative bg-black">
          {activeMode === 'architect' ? (
            <ArchitectView data={mockArchitectData} />
          ) : (
            <BrainView data={mockBrainData} />
          )}
        </main>
      </div>
    </div>
  );
}
