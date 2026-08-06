import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layers, Cpu, Command, Download, LogOut, Sun, Moon, History, Bookmark } from 'lucide-react';
import { mockArchitectData, mockBrainData } from './mockData';
import ArchitectView from './components/ArchitectView';
import BrainView from './components/BrainView';
import LoginPage from './pages/LoginPage';
import AuthSuccess from './pages/AuthSuccess';
import HistoryPage from './pages/HistoryPage';
import SavedArchitecturesPage from './pages/SavedArchitecturesPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

const presetTexts = {
  'Low traffic - 10 - 100 people': "Lightweight single-instance application optimized for minimal operational cost, standard monolithic architecture, single PostgreSQL database instance, and basic caching.",
  'Generic traffic - 100-1000 people': "Balanced microservice architecture with read-replica database scaling, Redis caching layer, load balancer auto-scaling, and background job queue processing.",
  'High traffic - 1000- 10k+ people': "High-throughput enterprise distributed architecture with multi-region database sharding, WebSocket event streaming, CDN edge caching, and zero-downtime microservice orchestration."
};

function Dashboard() {
  const [activeMode, setActiveMode] = useState('architect');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Lifted ArchitectView state
  const [activePreset, setActivePreset] = useState('Low traffic - 10 - 100 people');
  const [requirements, setRequirements] = useState(presetTexts['Low traffic - 10 - 100 people']);
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [archData, setArchData] = useState(null);
  const [activeTab, setActiveTab] = useState('Architecture Canvas');
  const [schemaToggle, setSchemaToggle] = useState('SQL (PostgreSQL)');

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
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs transition-all duration-150 cursor-pointer ${
                activeMode === 'architect'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
                  : 'text-zinc-400 hover:text-zinc-100 font-medium'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Architect Mode (System Design)</span>
            </button>

            <button
              onClick={() => setActiveMode('brain')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs transition-all duration-150 cursor-pointer ${
                activeMode === 'brain'
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

            {/* History Link */}
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/20 bg-black text-zinc-100 hover:bg-white/10 text-xs font-bold shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-colors duration-150 active:translate-y-[0.5px] cursor-pointer"
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </button>

            {/* Saved Architectures Link */}
            <button
              onClick={() => navigate('/saved')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/20 bg-black text-zinc-100 hover:bg-white/10 text-xs font-bold shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-colors duration-150 active:translate-y-[0.5px] cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </button>

            {/* User Avatar */}
            {user?.avatar_url && (
              <img
                src={user.avatar_url}
                alt={user.login || 'User'}
                className="w-8 h-8 rounded-full border border-zinc-700"
                title={user.name || user.login}
              />
            )}

            {/* Sign Out */}
            <button
              onClick={logout}
              title="Sign Out of Workspace"
              className="flex items-center gap-1.5 p-2 rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Body Viewport */}
        <main className="flex-1 w-full overflow-hidden relative bg-black">
          {activeMode === 'architect' ? (
            <ArchitectView
              data={mockArchitectData}
              activePreset={activePreset}
              setActivePreset={setActivePreset}
              requirements={requirements}
              setRequirements={setRequirements}
              showGithubInput={showGithubInput}
              setShowGithubInput={setShowGithubInput}
              githubUrl={githubUrl}
              setGithubUrl={setGithubUrl}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              archData={archData}
              setArchData={setArchData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              schemaToggle={schemaToggle}
              setSchemaToggle={setSchemaToggle}
            />
          ) : (
            <BrainView data={mockBrainData} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/history"
            element={
              <PrivateRoute>
                <HistoryPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/saved"
            element={
              <PrivateRoute>
                <SavedArchitecturesPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}