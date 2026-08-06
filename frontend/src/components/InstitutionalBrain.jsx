import React from 'react';
import { Cpu, Bug, CheckCircle2, Clock, GitCommit, AlertCircle, FileCode2, Link as LinkIcon, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';

const priorityBadgeMap = {
  Critical: 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.15)]',
  High: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Medium: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Low: 'bg-slate-500/10 text-slate-400 border-slate-500/30'
};

const statusIconMap = {
  Resolved: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  'In Progress': <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />
};

export default function InstitutionalBrain({ data }) {
  const { sampleDiagnosis, recentCommits, jiraTickets } = data;

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-900 text-slate-100 flex flex-col overflow-y-auto p-6 space-y-6">
      {/* Top Banner / Hero Diagnosis Section */}
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/80 rounded-xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Automated Root-Cause Diagnosis</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
              Incident Analysis: Connection Pool Exhaustion
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed bg-slate-950/50 p-3.5 rounded-lg border border-slate-800/60">
              <span className="font-bold text-red-400">Root Cause Detected:</span> {sampleDiagnosis.rootCause}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:max-w-xs">
            {sampleDiagnosis.matchedSources.map((src, idx) => (
              <a
                key={idx}
                href={src.link}
                className="group flex items-start gap-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-lg p-3 text-xs transition-all w-full"
              >
                <LinkIcon className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div className="overflow-hidden">
                  <div className="font-semibold text-indigo-300 flex items-center gap-1">
                    {src.type}
                    <ArrowRight className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-slate-400 truncate mt-0.5 font-sans">{src.reference}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Code Diff Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-950/20 border border-red-500/30 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-slate-950/90 px-4 py-2.5 border-b border-red-500/20 flex items-center justify-between text-xs font-mono text-red-300">
              <span className="flex items-center gap-2 font-semibold">
                <ShieldAlert className="w-4 h-4 text-red-400" /> Vulnerable / Existing Implementation
              </span>
              <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px]">BUG DETECTED</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto">
              <code>{sampleDiagnosis.originalCode}</code>
            </pre>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-slate-950/90 px-4 py-2.5 border-b border-emerald-500/20 flex items-center justify-between text-xs font-mono text-emerald-300">
              <span className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Fix & Patch
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px]">VERIFIED SOLUTION</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto">
              <code>{sampleDiagnosis.fixedCode}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Grid: Recent Commits & Jira Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Commits */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-indigo-400" /> Recent Commit Telemetry
            </h3>
            <div className="space-y-3.5">
              {recentCommits.map((commit) => (
                <div
                  key={commit.id}
                  className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-lg p-3.5 transition-all group"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded font-bold text-[11px] group-hover:bg-indigo-500/20 transition-colors">
                      {commit.id}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-500" /> {commit.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed mt-1">
                    {commit.message}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-900 pt-2">
                    <span>Committed by</span>
                    <span className="font-semibold text-slate-300">{commit.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Jira Tickets */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Bug className="w-5 h-5 text-amber-400" /> Linked JIRA & Triage Queue
            </h3>
            <div className="space-y-3.5">
              {jiraTickets.map((ticket) => (
                <div
                  key={ticket.key}
                  className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-lg p-3.5 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-white bg-slate-800 px-2 py-0.5 rounded">
                        {ticket.key}
                      </span>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold border ${priorityBadgeMap[ticket.priority] || 'bg-slate-800 text-slate-300'}`}>
                        {ticket.priority} Priority
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                      {statusIconMap[ticket.status]}
                      <span>{ticket.status}</span>
                    </div>
                  </div>
                  <h4 className="text-xs md:text-sm font-semibold text-slate-200 mt-1 group-hover:text-indigo-300 transition-colors">
                    {ticket.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
