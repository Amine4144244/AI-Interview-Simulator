import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import { api } from '../services/api';

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
            <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !interview) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="glass-card p-10 rounded-[3rem] max-w-lg mx-auto border-red-500/20">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">{error || 'Session Not Found'}</h2>
                    <button onClick={() => navigate('/dashboard')} className="glass-button px-8 py-3 rounded-2xl font-bold">Back to Base</button>
                </div>
            </div>
        );
    }

    const report = interview.finalReport || {};

    return (
        <div className="max-w-6xl mx-auto pb-24 px-4">
            {/* Header Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[3rem] p-10 md:p-14 mb-10 relative overflow-hidden bg-slate-900 text-white"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 blur-[150px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/10 blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left">
                        <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-widest text-primary-400 uppercase bg-primary-400/10 rounded-full border border-primary-400/20">
                            Post-Session Analysis
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight mb-4">
                            Performance <br /><span className="text-primary-400">Artifact</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium">{formatDate(interview.createdAt)} • {interview.role} ({interview.difficulty})</p>
                    </div>

                    <div className="relative">
                        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-[10px] border-slate-800 flex items-center justify-center relative shadow-2xl">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                    cx="50%" cy="50%" r="42%"
                                    className="fill-none stroke-primary-500 stroke-[10px]"
                                    strokeDasharray="264"
                                    strokeDashoffset={264 - (264 * (interview.finalScore || 0)) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="text-center">
                                <div className="text-5xl md:text-6xl font-black font-display">{interview.finalScore}%</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-primary-400">Score</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Main Insights */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="glass-card rounded-[2.5rem] p-10 md:p-12">
                        <h2 className="text-2xl font-black font-display mb-8 text-slate-900 dark:text-white">Executive Summary</h2>
                        <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed font-medium text-slate-600 dark:text-slate-400">
                            <div dangerouslySetInnerHTML={{ __html: marked(report.summary || 'Summary pending...') }} />
                        </div>
                    </section>

                    <section className="glass-card rounded-[2.5rem] p-10 md:p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] pointer-events-none"></div>
                        <h3 className="text-2xl font-black font-display mb-10 text-slate-900 dark:text-white">Topic Mastery</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {(report.recommendedTopics || []).map((topic, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-slate-700 dark:text-slate-200">{topic}</span>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Breakdown */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-black font-display text-slate-900 dark:text-white mt-10">Neural Breakdown</h2>
                        {(interview.answers || []).map((res, i) => {
                            const q = interview.questions?.[i] || {};
                            const f = res.feedback || {};
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="glass-card rounded-[2.5rem] overflow-hidden"
                                >
                                    <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white">Interaction 0{i + 1}</h4>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Score</span>
                                            <div className="px-4 py-1.5 bg-primary-500 text-white rounded-full font-black text-sm">{f.score || 0}/10</div>
                                        </div>
                                    </div>
                                    <div className="p-8 md:p-10 space-y-8">
                                        <div>
                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-4">The Challenge</h5>
                                            <div className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed" dangerouslySetInnerHTML={{ __html: marked(q.questionText || '') }} />
                                        </div>
                                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Your Response</h5>
                                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">"{res.answerText}"</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8 pt-4">
                                            <div>
                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Strengths</h5>
                                                <ul className="space-y-3">
                                                    {(f.strengths || []).map((s, idx) => (
                                                        <li key={idx} className="flex gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                                                            <span className="text-emerald-500">✓</span> {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4">Growth Plan</h5>
                                                <ul className="space-y-3">
                                                    {(f.suggestions || []).map((s, idx) => (
                                                        <li key={idx} className="flex gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                                                            <span className="text-amber-500">→</span> {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <div className="space-y-8">
                    <div className="sticky top-28 space-y-8">
                        <div className="glass-card rounded-[2.5rem] p-10 text-center">
                            <h3 className="text-xl font-black font-display mb-2 text-slate-900 dark:text-white">Evolution Ready?</h3>
                            <p className="text-sm text-slate-500 font-bold mb-8 leading-relaxed">Submit this session to your global profile to update your ranking.</p>
                            <div className="space-y-4">
                                <Link to="/interview/new" className="block">
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black shadow-lg shadow-primary-500/20">Recycle Process</motion.button>
                                </Link>
                                <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black border border-slate-200 dark:border-slate-700">Command Center</button>

                                <button
                                    onClick={async () => {
                                        if (window.confirm('Are you sure you want to delete this performance artifact?')) {
                                            try {
                                                await api.delete(`/interviews/${id}`);
                                                navigate('/dashboard');
                                            } catch (err) {
                                                console.error('Failed to delete interview:', err);
                                                alert('Failed to delete session');
                                            }
                                        }
                                    }}
                                    className="w-full py-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl font-black border border-red-200 dark:border-red-900/30 hover:bg-red-600 hover:text-white transition-all"
                                >
                                    Purge Data
                                </button>
                            </div>
                        </div>

                        <div className="glass-card rounded-[2.5rem] p-10 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none"></div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Expert Insight</h4>
                            <p className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                                "Your articulation on micro-interactions in the third question was state-of-the-art. Focus now on quantifying your engineering impact in the first section."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;