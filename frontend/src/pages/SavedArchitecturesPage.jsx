import React, { useState } from 'react';
import { Layers, Clock, ArrowLeft, Loader2, AlertCircle, Inbox, Trash2, DollarSign, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useArchitectures from '../hooks/useArchitectures';

const hideScrollbar = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

export default function SavedArchitecturesPage() {
    const { architectures, loading, error, deleteArchitecture, refetch } = useArchitectures();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    const handleDelete = async (id) => {
        setDeletingId(id);
        const result = await deleteArchitecture(id);
        setDeletingId(null);

        if (result.success) {
            setToastMessage('Architecture deleted successfully');
            setTimeout(() => setToastMessage(null), 3000);
        } else {
            setToastMessage(`Error: ${result.error}`);
            setTimeout(() => setToastMessage(null), 4000);
        }
    };

    return (
        <div className={`h-full w-full bg-black text-zinc-100 font-outfit font-medium flex flex-col p-6 gap-6 overflow-y-auto relative ${hideScrollbar}`}>
            {/* Toast Notification */}
            {toastMessage && (
                <div className="absolute top-6 right-8 z-50 animate-in slide-in-from-top duration-200 bg-zinc-100 border border-zinc-300 text-zinc-950 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold font-outfit">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{toastMessage}</span>
                </div>
            )}

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
                            <Layers className="w-4 h-4 text-zinc-950" />
                            <span>ARCHITECT MODE</span>
                        </div>
                        <h1 className="text-lg font-bold text-zinc-950 tracking-tight">
                            Saved Architectures
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-950 font-tech text-xs font-bold shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                        {architectures.length} Saved
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
                        Loading Saved Architectures...
                    </h3>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-zinc-100 rounded-xl p-6 border border-white/10 shadow-xl flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-base font-bold text-zinc-950">Failed to load architectures</h3>
                        <p className="text-xs text-zinc-500 font-medium mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && architectures.length === 0 && (
                <div className="flex-1 bg-zinc-100 rounded-xl p-12 border border-white/10 shadow-xl flex flex-col items-center justify-center text-center">
                    <div className="p-3.5 rounded-lg bg-white border border-zinc-300 text-zinc-950 w-fit mx-auto mb-4 shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                        <Inbox className="w-6 h-6 text-zinc-950" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-950 tracking-tight">
                        No Saved Architectures Yet
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1 max-w-sm">
                        Generate architectures in Architect Mode. They will be automatically saved here for future reference.
                    </p>
                </div>
            )}

            {/* Architecture Cards Grid */}
            {!loading && !error && architectures.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {architectures.map((arch) => (
                        <div
                            key={arch.id}
                            className="bg-zinc-100 rounded-xl p-6 border border-white/10 shadow-xl flex flex-col justify-between hover:border-zinc-400 transition-all"
                        >
                            <div>
                                {/* Title */}
                                <h3 className="text-base font-bold text-zinc-950 tracking-tight mb-2 line-clamp-2 font-outfit">
                                    {arch.title || 'Untitled Architecture'}
                                </h3>

                                {/* Prompt Preview */}
                                <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-4 line-clamp-3">
                                    {arch.prompt || 'No description available'}
                                </p>

                                {/* Cost Badge */}
                                {arch.total_monthly_estimate && (
                                    <div className="flex items-center gap-2 bg-black text-white rounded-lg px-3.5 py-2 w-fit shadow-[0_4px_14px_rgba(0,0,0,0.2)]">
                                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-xs font-tech font-bold">
                                            {arch.total_monthly_estimate}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Footer: Date + Delete */}
                            <div className="mt-5 pt-4 border-t border-zinc-300 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{new Date(arch.created_at).toLocaleDateString()}</span>
                                </div>

                                <button
                                    onClick={() => handleDelete(arch.id)}
                                    disabled={deletingId === arch.id}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-300 hover:border-red-400 hover:bg-red-50 text-zinc-500 hover:text-red-600 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                                >
                                    {deletingId === arch.id ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
