import React, { useState } from 'react';
import { Layout, Server, ShieldCheck, Cpu, Database, Zap, ArrowRight, DollarSign, AlertTriangle, Terminal, Code, Network, Activity } from 'lucide-react';

const iconMap = {
  Layout: Layout,
  Server: Server,
  ShieldCheck: ShieldCheck,
  Cpu: Cpu,
  Database: Database,
  Zap: Zap
};

const typeColorMap = {
  client: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-400',
  api: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-indigo-400',
  microservice: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-400',
  database: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400',
  cache: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400'
};

export default function ArchitectMode({ data }) {
  const [activeTab, setActiveTab] = useState('nodes');

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-900 text-slate-100 flex flex-col overflow-y-auto p-6 space-y-6">
      {/* Top System Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-900/50 border border-slate-800/80 rounded-xl p-5 backdrop-blur-md shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold uppercase tracking-wider">
            <Network className="w-4 h-4 animate-pulse" />
            <span>Architecture Overview</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {data.systemName}
          </h1>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg px-4 py-2.5 flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimated Infra Cost</div>
              <div className="text-sm font-bold text-emerald-400">{data.totalCost}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {data.warningNote && (
        <div className="flex items-start gap-3 bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 text-amber-300 text-sm backdrop-blur-sm shadow-[0_0_15px_rgba(245,158,11,0.08)] animate-in fade-in duration-500">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-200">Architecture Warning:</span> {data.warningNote}
          </div>
        </div>
      )}

      {/* Navigation Tabs for Details */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('nodes')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'nodes'
              ? 'border-indigo-500 text-indigo-400 font-semibold shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" /> Components & Flows
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'schema'
              ? 'border-indigo-500 text-indigo-400 font-semibold shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" /> Data Schemas & APIs
        </button>
        <button
          onClick={() => setActiveTab('infra')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'infra'
              ? 'border-indigo-500 text-indigo-400 font-semibold shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" /> Docker & Cost Breakdown
        </button>
      </div>

      {/* Tab 1: Components & Flows */}
      {activeTab === 'nodes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Architecture Nodes Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-semibold text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> System Nodes ({data.architectureNodes.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.architectureNodes.map((node) => {
                const IconComponent = iconMap[node.icon] || Cpu;
                const badgeColor = typeColorMap[node.type] || 'from-slate-500/20 to-slate-600/20 border-slate-500 text-slate-300';
                return (
                  <div
                    key={node.id}
                    className="group bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 rounded-xl p-5 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all duration-500" />
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 group-hover:text-indigo-400 transition-colors">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border bg-gradient-to-r uppercase tracking-wider ${badgeColor}`}>
                          {node.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">
                        {node.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{node.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Architecture Flow List */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <h2 className="text-base font-semibold text-slate-300 flex items-center gap-2 mb-4">
                <Network className="w-4 h-4 text-cyan-400" /> Integration Flows
              </h2>
              <div className="space-y-3">
                {data.architectureFlow.map((flow, index) => (
                  <div
                    key={index}
                    className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-3 hover:border-slate-700/80 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-300 font-medium">
                      <span className="truncate max-w-[40%] text-indigo-300">{flow.from}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mx-1" />
                      <span className="truncate max-w-[40%] text-cyan-300 text-right">{flow.to}</span>
                    </div>
                    <div className="mt-2 text-[10px] font-mono font-semibold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded inline-block border border-slate-800">
                      {flow.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schemas & APIs */}
      {activeTab === 'schema' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {/* SQL & Mongo Schemas */}
          <div className="space-y-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-indigo-300 flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-400" /> PostgreSQL Schema
                </span>
                <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">SQL</span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto bg-slate-950/30">
                <code>{data.sqlSchema}</code>
              </pre>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-emerald-300 flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" /> MongoDB NoSQL Document Structure
                </span>
                <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">JSON</span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto bg-slate-950/30">
                <code>{data.mongoSchema}</code>
              </pre>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" /> API Endpoints & Contracts
            </h2>
            <div className="space-y-3">
              {data.apiEndpoints.map((ep, idx) => {
                const methodColor = ep.method === 'POST'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                return (
                  <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-lg p-3.5 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className={`px-2 py-0.5 rounded font-bold border text-[10px] ${methodColor}`}>
                          {ep.method}
                        </span>
                        <span className="text-slate-200 font-semibold">{ep.path}</span>
                      </div>
                      {ep.requiresAuth ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/50 text-purple-300 border border-purple-500/30">
                          Auth Required
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          Public
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{ep.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Docker & Costs */}
      {activeTab === 'infra' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-blue-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" /> docker-compose.yml
              </span>
              <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">YAML</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto bg-slate-950/30">
              <code>{data.dockerCompose}</code>
            </pre>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Cost Breakdown
              </h2>
              <div className="space-y-3">
                {data.costBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between pb-3 border-b border-slate-800/80 last:border-0 last:pb-0">
                    <span className="text-xs text-slate-300 font-medium">{item.service}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{item.cost}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-300">Total Monthly Est.</span>
              <span className="text-base font-bold font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg">
                {data.totalCost}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
