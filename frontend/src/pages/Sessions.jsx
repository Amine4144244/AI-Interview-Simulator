import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { api, deleteInterview } from '../services/api';
import { Bell, Search, Terminal, Eye, Delete, AlertTriangle } from 'lucide-react';

const Sessions = () => {
    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await api.get('/interviews');
                setInterviews(response.data.interviews);
            } catch (err) {
                console.error('Failed to fetch interviews:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInterviews();
    }, []);

    const handleDelete = async (interviewId) => {
        if (!window.confirm('Are you sure you want to completely erase this session telemetry?')) return;
        try {
            await deleteInterview(interviewId);
            setInterviews(interviews.filter((interview) => interview._id !== interviewId));
        } catch (err) {
            console.error('Failed to delete interview:', err);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredInterviews = interviews.filter(interview =>
        interview.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort descending by default
    filteredInterviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            <Sidebar activePath="/sessions" />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#0a0c16] relative pb-20">
                {/* Header */}
                <header className="sticky top-0 z-10 hidden md:flex items-center justify-between px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-glass-border">
                    <h2 className="font-display font-bold text-xl tracking-tight">ECHO AI // Telemetry</h2>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full glass text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                    {/* Title Section */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                        <div>
                            <h1 className="font-display text-4xl font-bold tracking-tight mb-2">Session History</h1>
                            <p className="text-slate-400 max-w-xl">Every interview session is recorded here. Analyze past performance, review system feedback, or purge legacy data.</p>
                        </div>
                        <div className="relative w-full md:w-auto">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                className="bg-glass-bg border border-glass-border rounded-full pl-10 pr-4 py-2 w-full md:w-64 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-white"
                                placeholder="Search UUID or Path..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="glass rounded-xl overflow-x-auto border border-glass-border shadow-lg">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-glass-bg/50 border-b border-glass-border">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Session ID</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Evolution Path</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Difficulty</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Precision Score</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Timestamp</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-glass-border">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 animate-pulse">
                                            Pulling telemetry data...
                                        </td>
                                    </tr>
                                ) : filteredInterviews.length > 0 ? (
                                    filteredInterviews.map((interview) => (
                                        <tr key={interview._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-slate-800 border border-glass-border flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                        <Terminal size={18} className="text-slate-500 group-hover:text-primary" />
                                                    </div>
                                                    <span className="font-mono text-sm tracking-wider font-bold">#{interview._id.substring(0, 8).toUpperCase()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${interview.role === 'Frontend' ? 'bg-primary' : (interview.role === 'Backend' ? 'bg-emerald-400' : 'bg-amber-400')}`}></span>
                                                    <span className="font-medium">{interview.role || 'Custom Protocol'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-md bg-white/5 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-glass-border">
                                                    {interview.difficulty || 'Default'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {interview.status === 'completed' ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${interview.finalScore >= 80 ? 'bg-emerald-400 shadow-[0_0_10px_emerald]' : (interview.finalScore >= 50 ? 'bg-primary shadow-[0_0_10px_primary]' : 'bg-rose-500')} `}
                                                                style={{ width: `${interview.finalScore}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-bold font-mono">{interview.finalScore}%</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold text-amber-500 flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                                                        IN PROGRESS
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-sm font-mono">{formatDate(interview.createdAt)}</td>
                                            <td className="px-6 py-4 text-right space-x-1">
                                                <Link to={`/result/${interview._id}`}>
                                                    <button className="w-9 h-9 rounded-lg hover:bg-primary hover:text-white transition-all text-slate-400 inline-flex items-center justify-center border border-transparent hover:border-primary/50 bg-white/5 hover:bg-primary/20">
                                                        <Eye size={18} />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(interview._id)}
                                                    className="w-9 h-9 rounded-lg hover:bg-rose-500 hover:text-white transition-all text-slate-400 inline-flex items-center justify-center border border-transparent hover:border-rose-500/50 bg-white/5 hover:bg-rose-500/20"
                                                >
                                                    <Delete size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600">
                                                    <AlertTriangle size={36} className="text-slate-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">No Telemetry Found</p>
                                                    <p className="text-slate-500 text-sm">Either your search yielded no results, or you need to initialize a new session.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Sessions;
