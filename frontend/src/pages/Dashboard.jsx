import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api, deleteInterview } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Search, Bell, Play, ArrowRight, Terminal, Eye, Delete, Zap, LogOut, Code2, Database, Layers } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await api.get('/interviews');
                setInterviews(response.data.interviews);
            } catch (err) {
                setError('Failed to fetch interviews');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    const handleDelete = async (interviewId) => {
        if (!window.confirm('Are you sure you want to delete this session?')) return;
        try {
            await deleteInterview(interviewId);
            setInterviews(interviews.filter((interview) => interview._id !== interviewId));
        } catch (err) {
            setError('Failed to delete interview');
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const completedInterviews = interviews ? interviews.filter(interview => interview.status === 'completed') : [];
    const avgScore = completedInterviews.length > 0
        ? Math.round(completedInterviews.reduce((sum, interview) => sum + (interview.finalScore || 0), 0) / completedInterviews.length)
        : 0;

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            {/* Sidebar */}
            <Sidebar activePath="/dashboard" />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#0a0c16] relative pb-20">
                {/* Top Nav */}
                <header className="sticky top-0 z-10 hidden md:flex items-center justify-between px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-glass-border">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Search size={18} /></span>
                            <input className="bg-glass-bg border border-glass-border rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary w-64 outline-none" placeholder="Search sessions..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full glass text-slate-400 hover:text-white transition-colors">
                            <span className="text-slate-400"><Bell size={20} /></span>
                        </button>
                    </div>
                </header>

                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-glass-border glass">
                    <h1 className="font-display font-bold text-xl tracking-tight">ECHO AI</h1>
                    <button onClick={logout} className="text-slate-400"><LogOut size={20} /></button>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                    {/* Welcome Banner */}
                    <section className="relative rounded-xl overflow-hidden h-64 flex flex-col justify-center px-8 md:px-12 border border-glass-border group glass">
                        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent z-10"></div>
                        <div className="absolute inset-0 bg-primary/5 bg-cover bg-center grayscale opacity-50 group-hover:scale-105 transition-transform duration-700"></div>
                        <div className="relative z-20 space-y-4 max-w-xl">
                            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                                Hello, {user?.name}. <br /><span className="text-primary text-glow">Ready for your next evolution?</span>
                            </h2>
                            <p className="text-slate-400 font-light hidden md:block">Your last session performance was in the top 5% of all candidates this week. Keep the momentum.</p>
                            <button 
                                onClick={() => document.getElementById('evolution-path')?.scrollIntoView({ behavior: 'smooth' })}
                                className="mt-4 bg-primary text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(51,82,255,0.4)] transition-all"
                            >
                                <Play size={20} />
                                Custom Session
                            </button>
                        </div>
                    </section>

                    {/* Stats Grid */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Completed Sessions" value={completedInterviews.length} detail="High Activity" type="count" index={0} />
                        <StatCard title="Avg Score" value={avgScore} detail="Performance" type="percent" color="emerald" index={1} />
                        <StatCard title="Success Rate" value={avgScore > 0 ? Math.min(100, avgScore + 5) : 0} detail="Projected" type="percent" color="primary" index={2} />
                        <StatCard title="Total Questions" value={completedInterviews.length * 5} detail="Answered" type="count" index={3} />
                    </section>

                    {/* Path Selection */}
                    <motion.section 
                        id="evolution-path" 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h4 className="font-display text-xl font-bold">Select Evolution Path</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <PathCard
                                role="Frontend"
                                icon="javascript"
                                color="primary"
                                desc="Master complex UI patterns, React internals, and performance optimization."
                                index={0}
                            />
                            <PathCard
                                role="Backend"
                                icon="database"
                                color="emerald-400"
                                borderClass="border-emerald-400"
                                desc="Focus on scalability, distributed systems, and API efficiency."
                                index={1}
                            />
                            <PathCard
                                role="Full-Stack"
                                icon="layers"
                                color="amber-400"
                                borderClass="border-amber-400"
                                desc="The complete cycle: from database schemas to responsive design."
                                index={2}
                            />
                        </div>
                    </motion.section>

                    {/* Artifacts Table */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="font-display text-xl font-bold">Recent Telemetry</h4>
                            <Link to="/sessions" className="text-primary text-sm font-bold flex items-center gap-1 hover:text-primary/80 transition-colors">
                                View Full Library <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="glass rounded-xl overflow-x-auto border border-glass-border">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="bg-glass-bg/50 border-b border-glass-border">
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Session ID</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Path</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Performance Index</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Timestamp</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-glass-border">
                                    {isLoading ? (
                                        <tr><td colSpan="5" className="text-center py-8">Loading telemetry...</td></tr>
                                    ) : interviews.length > 0 ? (
                                        interviews.map((interview) => (
                                            <tr key={interview._id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-slate-500"><Terminal size={16} /></span>
                                                        <span className="font-medium text-sm">#{interview._id.substring(0, 6).toUpperCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase border border-primary/20">{interview.role || 'Custom'}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {interview.status === 'completed' ? (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-24 md:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                                <div className={`h-full ${interview.finalScore >= 80 ? 'bg-emerald-400' : (interview.finalScore >= 50 ? 'bg-primary' : 'bg-amber-400')} `} style={{ width: `${interview.finalScore}%` }}></div>
                                                            </div>
                                                            <span className="text-sm font-bold">{interview.finalScore}%</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-slate-400">In Progress</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 text-sm">{formatDate(interview.createdAt)}</td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <Link to={`/result/${interview._id}`}>
                                                        <button className="w-8 h-8 rounded-lg hover:bg-primary hover:text-white transition-all text-slate-400 inline-flex items-center justify-center">
                                                            <span className="text-lg"><Eye size={18} /></span>
                                                        </button>
                                                    </Link>
                                                    <button onClick={() => handleDelete(interview._id)} className="w-8 h-8 rounded-lg hover:bg-rose-500 hover:text-white transition-all text-slate-400 inline-flex items-center justify-center">
                                                        <span className="text-lg"><Delete size={18} /></span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                                No sessions found. Start a new simulation above.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ title, value, detail, type, color = "primary", index }) => {
    // Generate a stroke color class based on the prop
    let strokeClass = "stroke-primary";
    if (color === "emerald") strokeClass = "stroke-emerald-400";
    else if (color === "amber") strokeClass = "stroke-amber-400";

    const percentage = type === 'percent' ? value : 100;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass p-6 rounded-xl flex items-center justify-between group hover:border-primary/50 transition-colors h-full"
        >
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <div className="flex items-baseline gap-1">
                    <motion.h3 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 + index * 0.1, type: "spring" }}
                        className="font-display text-3xl font-bold mt-1"
                    >
                        {value}{type === 'percent' ? '%' : ''}
                    </motion.h3>
                </div>
                <span className="text-primary text-xs flex items-center gap-1 mt-2">
                    <Zap size={14} /> {detail}
                </span>
            </div>
            <div className="w-16 h-16 relative flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle className="stroke-slate-800" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                    <motion.circle
                        initial={{ strokeDasharray: "0, 100" }}
                        animate={{ strokeDasharray: `${percentage}, 100` }}
                        transition={{ duration: 1.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                        className={`${strokeClass}`}
                        cx="18"
                        cy="18"
                        fill="none"
                        r="16"
                        strokeLinecap="round"
                        strokeWidth="3"
                    ></motion.circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="text-[12px] font-bold leading-none"
                    >
                        {value}{type === 'percent' ? '%' : ''}
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
};

const PathCard = ({ role, icon, color, desc, borderClass = "border-primary", index }) => {
    const navigate = useNavigate();

    const startInterview = (difficulty) => {
        navigate(`/interview/new?role=${role}&difficulty=${difficulty}`);
    };

    const getIcon = () => {
        switch (icon) {
            case 'javascript': return <Code2 className={`text-${color} text-4xl mb-4`} />;
            case 'database': return <Database className={`text-${color} text-4xl mb-4`} />;
            case 'layers': return <Layers className={`text-${color} text-4xl mb-4`} />;
            default: return <Code2 className={`text-${color} text-4xl mb-4`} />;
        }
    };

    const hoverStyles = {
        'primary': 'hover:bg-primary/20 hover:border-primary',
        'emerald-400': 'hover:bg-emerald-400/20 hover:border-emerald-400',
        'amber-400': 'hover:bg-amber-400/20 hover:border-amber-400'
    };

    const hoverClass = hoverStyles[color] || hoverStyles['primary'];

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className={`glass p-8 rounded-xl border-l-4 border-l-${color} group hover:bg-white/5 transition-all`}
        >
            {getIcon()}
            <h5 className="font-display text-2xl font-bold mb-2">{role} {role !== 'Full-Stack' ? (role === 'Frontend' ? 'Architect' : 'Systems') : 'Lead'}</h5>
            <p className="text-slate-400 text-sm mb-6 h-10">{desc}</p>
            <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Target Difficulty</p>
                <div className="flex gap-2">
                    <button onClick={() => startInterview('Junior')} className={`flex-1 py-1 px-2 rounded-lg border border-glass-border flex items-center justify-center ${hoverClass} transition-all text-[10px] font-bold uppercase`}>Junior</button>
                    <button onClick={() => startInterview('Mid')} className={`flex-1 py-1 px-2 rounded-lg border border-glass-border flex items-center justify-center ${hoverClass} transition-all text-[10px] font-bold uppercase`}>Mid</button>
                    <button onClick={() => startInterview('Senior')} className={`flex-1 py-1 px-2 rounded-lg border border-glass-border flex items-center justify-center ${hoverClass} transition-all text-[10px] font-bold uppercase`}>Senior</button>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;