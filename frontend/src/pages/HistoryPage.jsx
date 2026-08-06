import React from 'react';
import { MessageSquare, Clock, ArrowLeft, Loader2, AlertCircle, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useHistory from '../hooks/useHistory';

const hideScrollbar = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

export default function HistoryPage() {
    const { history, loading, error, refetch } = useHistory();
    const navigate = useNavigate();

    return (
        <div className={`h-full w-full bg-black text-zinc-100 font-outfit font-medium flex flex-col p-6 gap-6 overflow-y-auto ${hideScrollbar}`}>
            {/* Header */}
            <div className="bg-zinc-100 rounded-xl p-6 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2.5 rounded-lg bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-950 transition-colors cursor-pointer shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 tracking-wider uppercase mb-1 font-tech">
                            <MessageSquare className="w-4 h-4 text-zinc-950" />
                            <span>INSTITUTIONAL BRAIN</span>
                        </div>
                        <h1 className="text-lg font-bold text-zinc-950 tracking-tight">
                            Chat Query History
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-950 font-tech text-xs font-bold shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                        {history.length} Entries
                    </span>
                    <button
                        onClick={refetch}
                        className="px-4 py-2 rounded-lg bg-black text-white text-xs font-bold uppercase tracking-wide border border-zinc-800 shadow-xl hover:bg-zinc-900 transition-colors cursor-pointer active:translate-y-[0.5px]"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex-1 bg-zinc-100 rounded-xl p-12 border border-white/10 shadow-xl flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-950 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-950 tracking-tight">
                        Loading Chat History...
                    </h3>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-zinc-100 rounded-xl p-6 border border-white/10 shadow-xl flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-base font-bold text-zinc-950">Failed to load history</h3>
                        <p className="text-xs text-zinc-500 font-medium mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && history.length === 0 && (
                <div className="flex-1 bg-zinc-100 rounded-xl p-12 border border-white/10 shadow-xl flex flex-col items-center justify-center text-center">
                    <div className="p-3.5 rounded-lg bg-white border border-zinc-300 text-zinc-950 w-fit mx-auto mb-4 shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                        <Inbox className="w-6 h-6 text-zinc-950" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-950 tracking-tight">
                        No Chat History Yet
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1 max-w-sm">
                        Start using the Institutional Brain to ask questions. Your queries and AI responses will be saved here.
                    </p>
                </div>
            )}

            {/* History List */}
            {!loading && !error && history.length > 0 && (
                <div className="space-y-4">
                    {history.map((entry) => (
                        <div
                            key={entry.id}
                            className="bg-zinc-100 rounded-xl p-6 border border-white/10 shadow-xl space-y-4"
                        >
                            {/* Timestamp */}
                            <div className="flex items-center gap-2 text-xs text-zinc-500 font-bold font-tech">
                                <Clock className="w-3.5 h-3.5 text-zinc-950" />
                                <span>{new Date(entry.created_at).toLocaleString()}</span>
                            </div>

                            {/* User Query */}
                            <div className="bg-black border border-black text-white rounded-lg p-4 ml-6 sm:ml-12 shadow-[0_6px_18px_rgba(0,0,0,0.25)]">
                                <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                                    Your Query
                                </span>
                                <p className="text-sm font-medium leading-relaxed">{entry.query}</p>
                            </div>

                            {/* AI Answer */}
                            <div className="bg-white border border-zinc-300 text-zinc-950 rounded-lg p-4 shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                                <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-500 block mb-1.5">
                                    AI Response
                                </span>
                                <p className="text-sm font-medium leading-relaxed">{entry.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
