import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Layout, Server, ShieldCheck, Cpu, Database, Zap, 
  Layers, ArrowRight, Check, Loader2, X, Terminal, 
  Code, Copy, Lock, Unlock, AlertTriangle, Download, Network
} from 'lucide-react';
import { mockArchitectData } from '../mockData';

const iconMap = {
  Layout: Layout,
  Server: Server,
  ShieldCheck: ShieldCheck,
  Cpu: Cpu,
  Database: Database,
  Zap: Zap
};

const presetTexts = {
  'Esports Platform': "Real-time competitive tournament gaming platform requiring ultra-low latency matchmaking, WebSocket live streaming leaderboards, JWT authentication, and resilient state handling for 100,000+ concurrent players.",
  'Fintech Payments': "High-frequency payment processing engine with immutable audit logs, strict ACID compliance, fraud detection microservices, tokenized PCI-DSS storage, and zero-downtime redundant database topology.",
  'Healthcare EHR': "HIPAA-compliant electronic health records management platform with role-based end-to-end encryption, multi-tenant doctor-patient communication channels, and secure biometric document storage pipelines."
};

const hideScrollbar = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

export default function ArchitectView({ data = mockArchitectData }) {
  const [activePreset, setActivePreset] = useState('Esports Platform');
  const [requirements, setRequirements] = useState(presetTexts['Esports Platform']);
  const [dbPreference] = useState('SQL - PostgreSQL');

  const [isGenerating, setIsGenerating] = useState(false);
  const [archData, setArchData] = useState(null);

  const [activeTab, setActiveTab] = useState('Architecture Canvas');
  const [schemaToggle, setSchemaToggle] = useState('SQL (PostgreSQL)');
  const [isCopied, setIsCopied] = useState(false);
  const [isDockerCopied, setIsDockerCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setSchemaToggle('SQL (PostgreSQL)');
  }, [dbPreference]);

  const handlePresetClick = (presetName) => {
    setActivePreset(presetName);
    setRequirements(presetTexts[presetName]);
  };

  const handleClearText = () => {
    setRequirements('');
    setActivePreset(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-architecture', { 
        prompt: requirements,
        dbPreference
      });
      setArchData(response.data);
      setIsGenerating(false);
    } catch (error) {
      setTimeout(() => {
        setArchData(mockArchitectData);
        setIsGenerating(false);
      }, 1500);
    }
  };

  const handleCopySchema = () => {
    if (!archData) return;
    const textToCopy = schemaToggle === 'SQL (PostgreSQL)' ? archData.sqlSchema : archData.mongoSchema;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyDocker = () => {
    if (!archData) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(archData.dockerCompose);
    }
    setIsDockerCopied(true);
    setTimeout(() => setIsDockerCopied(false), 2000);
  };

  const handleDownloadStarterKit = () => {
    setToastMessage('Scaffolding package generated!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const tabs = [
    'Architecture Canvas',
    'Database Schema',
    'API Endpoints',
    'Cost Breakdown',
    'Docker Setup'
  ];

  const getMethodBadge = (method) => {
    return 'bg-white text-zinc-950 border border-zinc-300 font-fira text-xs px-2.5 py-1 rounded-md shadow-[0_4px_14px_rgba(0,0,0,0.15)] font-bold';
  };

  return (
    <div className="h-full w-full bg-black text-zinc-950 font-outfit font-medium flex flex-col lg:flex-row p-4 lg:p-6 gap-6 overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-6 right-8 z-50 animate-in slide-in-from-top duration-200 bg-zinc-100 border border-zinc-300 text-zinc-950 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold font-outfit">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Left Sidebar (30% width) - Deeper bg-zinc-100 rounded-xl with hidden scrollbar */}
      <aside className={`w-full lg:w-[30%] bg-zinc-100 rounded-xl p-5 lg:p-6 border border-white/10 shadow-xl flex flex-col justify-between overflow-y-auto ${hideScrollbar} flex-shrink-0 z-10`}>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 tracking-wider uppercase mb-1.5 font-tech">
              <Layers className="w-4 h-4 text-zinc-950" />
              <span>ARCHITECT CONTROL DESK</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-950 tracking-tight font-outfit">
              System Requirements & Parameters
            </h2>
            <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed font-outfit">
              Define product requirements and architectural scaling targets to generate technical blueprints.
            </p>
          </div>

          {/* Presets Row */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 tracking-wider uppercase mb-2 font-tech">
              DOMAIN PRESETS
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(presetTexts).map((preset) => {
                const isSelected = activePreset === preset;
                return (
                  <button
                    key={preset}
                    onClick={() => handlePresetClick(preset)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs transition-all duration-150 border flex items-center gap-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.15)] cursor-pointer font-outfit ${
                      isSelected
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-white border-zinc-300 text-zinc-950 font-bold hover:border-zinc-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{preset}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Requirement Textarea & Helper Text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-zinc-500 tracking-wider uppercase font-tech">
                PRD / BUSINESS REQUIREMENTS
              </label>
              {requirements.length > 0 && (
                <button
                  onClick={handleClearText}
                  className="text-xs text-zinc-500 font-bold hover:text-zinc-950 flex items-center gap-1 transition-colors cursor-pointer font-outfit"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
            <div className="relative rounded-lg overflow-hidden border border-zinc-300 bg-white focus-within:border-zinc-500 transition-colors shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
              <textarea
                rows={6}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Describe systemic requirements, concurrency targets, fault tolerance goals..."
                className={`w-full bg-white p-4 text-xs text-zinc-950 font-medium focus:outline-none resize-none placeholder:text-zinc-400 leading-relaxed font-outfit ${hideScrollbar}`}
              />
              <div className="bg-zinc-100 px-3 py-1.5 border-t border-zinc-300 flex items-center justify-end text-[11px] font-bold text-zinc-500 font-tech">
                <span>{requirements.length} chars</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 font-medium mt-1.5 font-outfit">
              Press Generate to map requirements to system nodes.
            </p>
          </div>

          {/* Parameter Inputs */}
          <div className="space-y-4 pt-3 border-t border-zinc-300">
            <div>
              <label className="block text-xs font-bold text-zinc-500 tracking-wider uppercase mb-1.5 font-tech">
                DATABASE PREFERENCE
              </label>
              <div className="w-full p-3 rounded-lg border border-zinc-300 bg-white text-zinc-500 font-medium cursor-not-allowed flex items-center justify-between text-xs font-outfit shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                <span>SQL - PostgreSQL (Relational & ACID)</span>
                <Lock className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 mt-6 border-t border-zinc-300">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 px-5 rounded-lg bg-black hover:bg-zinc-900 text-white font-bold text-xs tracking-wide uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:pointer-events-none cursor-pointer border border-zinc-800 shadow-xl active:translate-y-[0.5px] font-outfit"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-white" />
                <span>Generate Architecture</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Segmented Right Workspace (70% width) - Transparent wrapper with hidden scrollbar */}
      <section className={`w-full lg:w-[70%] bg-transparent flex flex-col space-y-6 overflow-y-auto ${hideScrollbar}`}>
        {!archData ? (
          <div className="flex-1 bg-zinc-100 rounded-xl p-12 border border-white/10 shadow-xl flex flex-col items-center justify-center text-center my-auto">
            {isGenerating ? (
              <div className="space-y-4 max-w-sm animate-in fade-in duration-200">
                <div className="p-3.5 rounded-lg bg-white border border-zinc-300 text-zinc-950 w-fit mx-auto mb-4 shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-950" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 tracking-tight font-outfit">
                  Synthesizing Architecture Blueprint...
                </h3>
                <p className="text-xs text-zinc-500 font-medium font-fira">
                  Evaluating microservice dependencies and offline fallback vectors...
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 max-w-sm animate-in fade-in duration-200">
                <div className="p-3.5 rounded-lg bg-white border border-zinc-300 text-zinc-950 w-fit mx-auto mb-2 shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                  <Network className="w-6 h-6 text-zinc-950" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 tracking-tight font-outfit">
                  Architecture Canvas Empty
                </h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed font-outfit">
                  Enter requirements on the control desk and click <span className="text-zinc-950 font-bold">Generate Architecture</span> to synthesize systemic nodes.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Top Navigation Tabs Bar - Floating Card rounded-xl bg-zinc-100 */}
            <nav className={`flex-shrink-0 bg-zinc-100 rounded-xl px-6 py-3.5 border border-white/10 shadow-xl flex overflow-x-auto ${hideScrollbar} gap-8 items-center z-10 font-outfit`}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-1.5 text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'text-zinc-950 font-bold border-b-2 border-zinc-950 pb-1.5'
                        : 'text-zinc-500 hover:text-zinc-950 font-semibold border-b-2 border-transparent pb-1.5'
                    }`}
                  >
                    <span>{tab}</span>
                  </button>
                );
              })}
            </nav>

            {/* Loading Indicator when regenerating */}
            {isGenerating && (
              <div className="bg-zinc-100 rounded-xl p-8 border border-white/10 shadow-xl flex flex-col items-center justify-center animate-in fade-in duration-150 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-950 mb-3" />
                <h3 className="text-lg font-bold text-zinc-950 font-outfit">
                  Regenerating Topology...
                </h3>
                <p className="text-xs text-zinc-500 font-medium mt-1 font-fira">
                  Applying SQL PostgreSQL schema guidelines
                </p>
              </div>
            )}

            {/* Tab 1: Architecture Canvas */}
            {activeTab === 'Architecture Canvas' && !isGenerating && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header Card rounded-xl */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-100 border border-white/10 p-6 rounded-xl shadow-xl">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 tracking-tight font-outfit">
                      Interactive System Architecture
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1 font-outfit">
                      Real-time component map and service mesh topology.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-950 font-tech text-xs font-bold shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                      Nodes: {archData.architectureNodes?.length || 0}
                    </span>
                    <span className="px-3.5 py-1.5 rounded-lg bg-black text-white font-tech text-xs font-bold shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                      Enterprise Scale
                    </span>
                  </div>
                </div>

                {/* Component Grid - Each node is a floating bg-zinc-100 card rounded-xl */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(archData.architectureNodes || []).map((node) => {
                    const IconComp = iconMap[node.icon] || Cpu;
                    return (
                      <div
                        key={node.id}
                        className="bg-zinc-100 border border-white/10 rounded-xl p-6 shadow-xl hover:border-zinc-400 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-white border border-zinc-300 text-zinc-950 shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                              <IconComp className="w-5 h-5 text-zinc-950" />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-tech font-bold uppercase bg-white text-zinc-950 border border-zinc-300 shadow-sm">
                              {node.type}
                            </span>
                          </div>
                          <h4 className="font-bold text-zinc-950 text-base font-outfit">
                            {node.title}
                          </h4>
                          <p className="text-xs text-zinc-500 font-medium mt-2 leading-relaxed font-outfit">
                            {node.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Data Flow Connections Panel - Floating Card rounded-xl */}
                <div className="bg-zinc-100 border border-white/10 rounded-xl p-6 shadow-xl">
                  <div className="mb-5 flex items-center justify-between border-b border-zinc-300 pb-4">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-zinc-950 font-bold" />
                      <h4 className="text-xs font-bold text-zinc-500 tracking-wider uppercase font-tech">
                        DATA FLOW & IPC NETWORK MAP
                      </h4>
                    </div>
                    <span className="text-xs text-zinc-950 bg-white px-3 py-1 rounded-md border border-zinc-300 font-tech font-bold shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                      {(archData.architectureFlow || []).length} Channels
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {(archData.architectureFlow || []).map((flow, index) => (
                      <div
                        key={index}
                        className="bg-white border border-zinc-300 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-fira shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:border-zinc-400 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-md bg-black border border-black text-white font-bold shadow-sm">
                            [{flow.from}]
                          </span>
                          <div className="hidden sm:flex items-center text-zinc-400 font-bold">
                            <span>──────</span>
                            <span className="text-xs font-tech font-bold text-zinc-950 mx-3 bg-zinc-100 px-3 py-0.5 rounded-md border border-zinc-300 shadow-sm">
                              {flow.label}
                            </span>
                            <span>──────</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto">
                          <div className="sm:hidden text-xs font-tech font-bold text-zinc-950 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-300 mr-2 shadow-sm">
                            {flow.label}
                          </div>
                          <ArrowRight className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                          <span className="px-3 py-1 rounded-md bg-black border border-black text-white font-bold shadow-sm">
                            [{flow.to}]
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Database Schema */}
            {activeTab === 'Database Schema' && !isGenerating && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header & Toggle Card rounded-xl */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-100 border border-white/10 p-6 rounded-xl shadow-xl">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2 font-outfit">
                      <Database className="w-5 h-5 text-zinc-950" />
                      <span>Database Schema Architecture</span>
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1 font-outfit">
                      Inspect DDL statements and object document structures.
                    </p>
                  </div>
                  
                  <div className="flex items-center bg-white p-1.5 rounded-lg border border-zinc-300 shadow-[0_4px_14px_rgba(0,0,0,0.15)] font-outfit">
                    <button
                      onClick={() => setSchemaToggle('SQL (PostgreSQL)')}
                      className={`px-4 py-2 rounded-md text-xs transition-all cursor-pointer ${
                        schemaToggle === 'SQL (PostgreSQL)'
                          ? 'bg-black text-white font-bold shadow-md'
                          : 'text-zinc-500 font-semibold hover:text-zinc-950'
                      }`}
                    >
                      SQL (PostgreSQL)
                    </button>
                    <button
                      onClick={() => setSchemaToggle('NoSQL (MongoDB)')}
                      className={`px-4 py-2 rounded-md text-xs transition-all cursor-pointer ${
                        schemaToggle === 'NoSQL (MongoDB)'
                          ? 'bg-black text-white font-bold shadow-md'
                          : 'text-zinc-500 font-semibold hover:text-zinc-950'
                      }`}
                    >
                      NoSQL (MongoDB)
                    </button>
                  </div>
                </div>

                {/* Code Cutout Card rounded-xl containing rounded-lg black terminal */}
                <div className="bg-zinc-100 rounded-xl p-6 border border-white/10 shadow-xl relative">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-300">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-tech font-bold flex items-center gap-2">
                      <Code className="w-4 h-4 text-zinc-950" />
                      <span>{schemaToggle} SCHEMA DEFINITION</span>
                    </div>
                    <button
                      onClick={handleCopySchema}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black hover:bg-zinc-900 text-white text-xs font-outfit font-bold transition-colors border border-zinc-800 shadow-[0_4px_14px_rgba(0,0,0,0.15)] active:translate-y-[0.5px] cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-300" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className={`bg-black text-zinc-300 font-fira p-5 rounded-lg border-none shadow-inner overflow-auto ${hideScrollbar}`}>
                    <pre className="text-xs text-zinc-300 leading-relaxed overflow-x-auto">
                      <code>{schemaToggle === 'SQL (PostgreSQL)' ? archData.sqlSchema : archData.mongoSchema}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: API Endpoints */}
            {activeTab === 'API Endpoints' && !isGenerating && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header Card rounded-xl */}
                <div className="bg-zinc-100 border border-white/10 p-6 rounded-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2 font-outfit">
                      <Server className="w-5 h-5 text-zinc-950" />
                      <span>API Gateway Endpoint Contract</span>
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1 font-outfit">
                      RESTful routes, authorization tokens, and traffic bindings.
                    </p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-950 font-tech font-bold shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                    {(archData.apiEndpoints || []).length} Registered Routes
                  </span>
                </div>

                {/* Stack of Floating Endpoint Cards rounded-xl */}
                <div className="space-y-4">
                  {(archData.apiEndpoints || []).map((ep, idx) => (
                    <div 
                      key={idx} 
                      className="bg-zinc-100 border border-white/10 rounded-xl p-5 shadow-xl hover:border-zinc-400 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={getMethodBadge(ep.method)}>
                          {ep.method}
                        </span>
                        <span className="text-white font-fira font-bold text-xs bg-black px-3 py-1.5 rounded-lg border border-black shadow-sm">
                          {ep.path}
                        </span>
                        <p className="text-xs text-zinc-800 font-medium font-outfit">
                          {ep.desc}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-300 justify-end">
                        {ep.requiresAuth ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-zinc-950 font-bold border border-zinc-300 text-xs font-tech shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                            <Lock className="w-3.5 h-3.5 text-zinc-950" />
                            <span>Auth Required</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-zinc-950 font-bold border border-zinc-300 text-xs font-tech shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                            <Unlock className="w-3.5 h-3.5 text-zinc-950" />
                            <span>Public</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Cost Breakdown */}
            {activeTab === 'Cost Breakdown' && !isGenerating && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Grid of Floating Metric Cards rounded-xl */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(archData.costBreakdown || []).map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-zinc-100 border border-white/10 p-6 rounded-xl shadow-xl flex flex-col justify-between hover:border-zinc-400 transition-all"
                    >
                      <div>
                        <span className="text-xs font-bold font-tech text-zinc-500 tracking-wider uppercase block mb-2">
                          LINE ITEM
                        </span>
                        <h4 className="text-base font-bold text-zinc-950 truncate pr-2 font-outfit">
                          {item.service}
                        </h4>
                      </div>
                      <div className="mt-6 pt-4 border-t border-zinc-300 flex items-center justify-between">
                        <span className="text-xs text-zinc-500 font-bold font-outfit">Monthly</span>
                        <span className="text-lg font-fira font-bold text-zinc-950">
                          {item.cost}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Floating Card rounded-xl with Cutout Box */}
                <div className="bg-zinc-100 rounded-xl p-7 border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="text-xs font-bold font-tech text-zinc-500 tracking-wider uppercase inline-block mb-2">
                      INFRASTRUCTURE FORECAST
                    </span>
                    <h3 className="text-lg font-bold text-zinc-950 tracking-tight font-outfit">
                      Total Estimated Operating Expense
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1.5 max-w-xl leading-relaxed font-outfit">
                      Composite pricing includes database replicas, edge caching layers, API rate-limiting firewalls, and continuous deployment hosting.
                    </p>
                  </div>
                  
                  <div className="bg-black border border-zinc-800 text-white rounded-lg px-7 py-5 text-center flex flex-col items-center flex-shrink-0 min-w-[220px] shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                    <span className="text-[11px] font-tech font-bold text-zinc-400 uppercase tracking-widest block">
                      Monthly Projection
                    </span>
                    <div className="text-3xl font-fira font-bold text-white my-2">
                      {archData.totalCost}
                    </div>
                    <span className="text-[11px] text-emerald-400 font-tech font-bold">
                      Billed monthly / scale-ready
                    </span>
                  </div>
                </div>

                {/* Amber Warning Notice Floating Card rounded-xl */}
                {archData.warningNote && (
                  <div className="bg-zinc-100 border border-white/10 text-zinc-950 rounded-xl p-6 flex items-start gap-4 shadow-xl border-l-4 border-l-black">
                    <AlertTriangle className="w-6 h-6 text-zinc-950 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-zinc-950 text-xs uppercase font-tech tracking-wider">
                        HIGH CONCURRENCY NOTICE
                      </h4>
                      <p className="text-xs text-zinc-800 font-bold mt-1.5 leading-relaxed font-outfit">
                        {archData.warningNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Docker Setup */}
            {activeTab === 'Docker Setup' && !isGenerating && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header Card rounded-xl */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-100 border border-white/10 p-6 rounded-xl shadow-xl">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2 font-outfit">
                      <Terminal className="w-5 h-5 text-zinc-950" />
                      <span>Infrastructure Boilerplate</span>
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1 font-outfit">
                      Ready-to-deploy Docker compose configurations and microservice orchestration networks.
                    </p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-950 text-xs font-tech font-bold shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                    Docker v3.8 Spec
                  </span>
                </div>

                {/* Cutout Code Block Card rounded-xl */}
                <div className="bg-zinc-100 rounded-xl p-6 border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-300">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-tech font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-zinc-950" />
                      <span>DOCKER-COMPOSE.YML</span>
                    </div>
                    <button
                      onClick={handleCopyDocker}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black hover:bg-zinc-900 text-white text-xs font-outfit font-bold transition-colors border border-zinc-800 shadow-[0_4px_14px_rgba(0,0,0,0.15)] active:translate-y-[0.5px] cursor-pointer"
                    >
                      {isDockerCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied YAML</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-300" />
                          <span>Copy YAML</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className={`bg-black text-zinc-300 font-fira p-5 rounded-lg border-none shadow-inner overflow-auto ${hideScrollbar}`}>
                    <pre className="text-xs text-zinc-300 leading-relaxed overflow-x-auto">
                      <code>{archData.dockerCompose}</code>
                    </pre>
                  </div>

                  {/* Prominent Stark Download Button */}
                  <div className="pt-2 flex justify-end border-t border-zinc-300">
                    <button
                      onClick={handleDownloadStarterKit}
                      className="px-6 py-3 rounded-lg bg-black hover:bg-zinc-900 text-white font-bold text-xs tracking-wide uppercase flex items-center gap-2 transition-colors border border-zinc-800 shadow-xl active:translate-y-[0.5px] cursor-pointer font-outfit"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>Download Starter Kit (.zip)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
