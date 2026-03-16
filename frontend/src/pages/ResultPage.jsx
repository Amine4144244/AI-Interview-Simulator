import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Bell, ArrowLeft, Terminal, CheckCircle2, TrendingUp, AlertTriangle, Zap, RotateCcw, Home, Trash2 } from 'lucide-react';

const ResultPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [interview, setInterview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const response = await api.get(`/interviews/${id}`);
                setInterview(response.data.interview);
            } catch (err) {
                setError('Failed to fetch interview results');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterview();
    }, [id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
                <Sidebar activePath="/sessions" />
                <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#0a0c16] flex justify-center items-center pb-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-mono text-sm uppercase tracking-widest animate-pulse">Processing Telemetry...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !interview) {
        return (
            <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
                <Sidebar activePath="/sessions" />
                <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#0a0c16] flex justify-center items-center pb-20">
                    <div className="glass p-10 rounded-xl max-w-lg w-full mx-4 border border-rose-500/20 text-center">
                        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                        <h2 className="text-xl font-display font-bold text-rose-500 mb-6">{error || 'Artifact Corrupted or Not Found'}</h2>
                        <button onClick={() => navigate('/sessions')} className="bg-white/5 hover:bg-white/10 text-white border border-glass-border px-8 py-3 rounded-full font-bold transition-colors">Return to Library</button>
                    </div>
                </main>
            </div>
        );
    }

    const report = interview.finalReport || {};

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            <Sidebar activePath="/sessions" />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#0a0c16] relative pb-20">
                {/* Header Nav */}
                <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-glass-border">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/sessions')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                            <ArrowLeft size={16} /> <span className="hidden md:inline">Back to Telemetry</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <h2 className="font-display font-bold text-lg md:text-xl tracking-tight hidden sm:block">ECHO AI // Diagnostic Report</h2>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full glass text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                    {/* Header Hero */}
                    <section className="relative rounded-xl overflow-hidden h-64 flex flex-col justify-center px-8 md:px-12 border border-glass-border group glass">
                        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent z-10"></div>
                        <div className="absolute inset-0 bg-primary/5 bg-cover bg-center grayscale opacity-50 transition-transform duration-700"></div>
                        
                        <div className="relative z-20 flex flex-col md:flex-row justify-between items-center gap-10">
                            <div className="text-center md:text-left space-y-4">
                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <Terminal className="text-primary" size={20} />
                                    <span className="font-mono text-xs font-bold tracking-widest text-primary uppercase">
                                        Session #{id.substring(0, 8)}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-white shadow-sm">
                                    Performance Artifact
                                </h1>
                                <p className="text-slate-400 font-medium font-mono text-sm">
                                    {formatDate(interview.createdAt)} • Path: <span className="text-white">{interview.role}</span> • Level: <span className="text-white">{interview.difficulty}</span>
                                </p>
                            </div>

                            <div className="relative flex-shrink-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 relative flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(51,82,255,0.4)]">
                                        <circle
                                            cx="50%" cy="50%" r="42%"
                                            className="fill-none stroke-glass-border/50 stroke-[6px]"
                                        />
                                        <circle
                                            cx="50%" cy="50%" r="42%"
                                            className="fill-none stroke-primary stroke-[6px] transition-all duration-1000 ease-in-out"
                                            strokeDasharray="264"
                                            strokeDashoffset={264 - (264 * (interview.finalScore || 0)) / 100}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold font-mono text-white">{interview.finalScore}%</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Score</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Insights */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="glass rounded-xl p-8 border border-glass-border">
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="text-amber-400" size={24} />
                            <h2 className="text-2xl font-bold font-display text-white">Executive Summary</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm md:text-base">
                            <div dangerouslySetInnerHTML={{ __html: marked(report.summary || 'Summary pending...') }} />
                        </div>
                    </section>

                    <section className="glass rounded-xl p-8 border border-glass-border relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] pointer-events-none"></div>
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="text-emerald-400" size={24} />
                            <h3 className="text-2xl font-bold font-display text-white">Topic Mastery</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {(report.recommendedTopics || []).map((topic, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-glass-border hover:border-emerald-400/30 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span className="font-medium text-slate-200 text-sm">{topic}</span>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Breakdown */}
                    <div className="space-y-6">
                        <h2 className="font-display text-xl font-bold pt-4 text-white">Neural Breakdown</h2>
                        {(interview.answers || []).map((res, i) => {
                            const q = interview.questions?.[i] || {};
                            const f = res.feedback || {};
                            const scoreColor = f.score >= 8 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : (f.score >= 5 ? 'text-primary border-primary/30 bg-primary/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10');
                            
                            return (
                                <div key={i} className="glass rounded-xl overflow-hidden border border-glass-border">
                                    <div className="px-6 py-4 bg-glass-bg/50 border-b border-glass-border flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xs text-slate-400">0{i + 1}</span>
                                            <h4 className="font-medium text-white">Interaction</h4>
                                        </div>
                                        <div className={`px-3 py-1 rounded-md border text-xs font-bold font-mono ${scoreColor}`}>
                                            SYS.SCORE: {f.score || 0}/10
                                        </div>
                                    </div>
                                    <div className="p-6 md:p-8 space-y-6">
                                        <div>
                                            <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">The Challenge</h5>
                                            <div className="text-base text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: marked(q.questionText || '') }} />
                                        </div>
                                        <div className="p-5 bg-black/20 rounded-lg border border-white/5">
                                            <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Your Output</h5>
                                            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-mono">"{res.answerText}"</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6 pt-2">
                                            <div className="space-y-3">
                                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2"><CheckCircle2 size={12}/> Validated Logic</h5>
                                                <ul className="space-y-2">
                                                    {(f.strengths || []).map((s, idx) => (
                                                        <li key={idx} className="flex gap-2 text-sm text-slate-300 bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                                                            <span className="text-emerald-500 shrink-0 mt-0.5">•</span> 
                                                            <span className="leading-snug">{s}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="space-y-3">
                                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2"><AlertTriangle size={12}/> Optimization Required</h5>
                                                <ul className="space-y-2">
                                                    {(f.suggestions || []).map((s, idx) => (
                                                        <li key={idx} className="flex gap-2 text-sm text-slate-300 bg-amber-500/5 p-2 rounded border border-amber-500/10">
                                                            <span className="text-amber-500 shrink-0 mt-0.5">→</span> 
                                                            <span className="leading-snug">{s}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <div className="space-y-6">
                    <div className="sticky top-24 space-y-6">
                        <div className="glass rounded-xl p-6 border border-glass-border">
                            <h3 className="font-display text-lg font-bold mb-2 text-white">System Actions</h3>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">Manage this artifact or initiate a new simulation sequence.</p>
                            
                            <div className="space-y-3">
                                <Link to="/interview/new" className="block">
                                    <button className="w-full py-3 px-4 bg-primary text-white rounded-lg font-bold shadow-[0_0_15px_rgba(51,82,255,0.3)] hover:shadow-[0_0_20px_rgba(51,82,255,0.5)] transition-all flex items-center justify-center gap-2">
                                        <RotateCcw size={18} /> Re-Initialize
                                    </button>
                                </Link>
                                <button onClick={() => navigate('/dashboard')} className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold border border-glass-border transition-colors flex items-center justify-center gap-2">
                                    <Home size={18} /> Command Center
                                </button>

                                <button
                                    onClick={async () => {
                                        if (window.confirm('Are you sure you want to permanently delete this telemetry?')) {
                                            try {
                                                await api.delete(`/interviews/${id}`);
                                                navigate('/sessions');
                                            } catch (err) {
                                                console.error('Failed to delete interview:', err);
                                                alert('Failed to delete session');
                                            }
                                        }
                                    }}
                                    className="w-full py-3 px-4 mt-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg font-bold border border-rose-500/20 hover:border-transparent transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={18} /> Purge Data
                                </button>
                            </div>
                        </div>

                        <div className="glass rounded-xl p-6 border border-glass-border relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                                <Zap size={14} /> Global Insight
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed italic relative z-10">
                                "Consistent precision in architectural answers. We recommend standardizing your system design responses using the STAR method for future sessions."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            </main>
        </div>
    );
};

export default ResultPage;