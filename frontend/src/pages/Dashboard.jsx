import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api, deleteInterview } from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
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
        try {
            await deleteInterview(interviewId);
            setInterviews(interviews.filter((interview) => interview._id !== interviewId));
        } catch (err) {
            setError('Failed to delete interview');
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const completedInterviews = interviews ? interviews.filter(interview => interview.status === 'completed') : [];
    const avgScore = completedInterviews.length > 0
        ? Math.round(completedInterviews.reduce((sum, interview) => sum + (interview.finalScore || 0), 0) / completedInterviews.length)
        : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Header / Welcome */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-[3rem] p-10 md:p-14 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                            Hello, <span className="premium-gradient-text">{user?.name}</span>
                        </h1>
                        <p className="mt-4 text-xl text-slate-500 dark:text-slate-400 max-w-lg font-medium">
                            Ready to sharpen your mind? Your evolution as an engineer continues today.
                        </p>
                    </div>
                    <Link to="/interview/new">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(51 80 255 / 0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 bg-primary-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all font-display"
                        >
                            Start New Session
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6">
                <StatCard label="Completed" value={completedInterviews.length} unit="sessions" color="bg-primary-500" />
                <StatCard label="Avg Score" value={`${avgScore}%`} unit="accuracy" color="bg-secondary-500" />
                <StatCard label="Hours Practiced" value={Math.round(completedInterviews.length * 0.5)} unit="hours" color="bg-accent" />
                <StatCard label="Global Rank" value="#124" unit="top 5%" color="bg-slate-900 dark:bg-white" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Paths Bento */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Choose Your Path</h2>
                            <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800"></div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <PathCard
                                role="Frontend"
                                skills="React, CSS, Modern Web"
                                difficulty="Junior"
                                color="blue"
                                icon={<path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                                link="/interview/new?role=Frontend&difficulty=Junior"
                            />
                            <PathCard
                                role="Backend"
                                skills="Node, SQL, Architecture"
                                difficulty="Mid"
                                color="indigo"
                                icon={<path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />}
                                link="/interview/new?role=Backend&difficulty=Mid"
                            />
                            <PathCard
                                role="Full-Stack"
                                skills="End-to-End Synergy"
                                difficulty="Senior"
                                color="emerald"
                                icon={<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />}
                                link="/interview/new?role=Full-Stack&difficulty=Senior"
                            />
                        </div>
                    </div>

                    {/* Recent Sessions */}
                    <div className="glass-card rounded-[2.5rem] p-8 md:p-10">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Recent Artifacts</h2>
                            <button className="text-xs font-black uppercase tracking-widest text-primary-600 hover:text-primary-500 transition-all group flex items-center gap-2 font-display">
                                View History
                                <div className="h-px w-4 bg-primary-600 group-hover:w-8 transition-all"></div>
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-400 uppercase text-xs font-black tracking-widest">
                                            <th className="pb-6 px-4">Role</th>
                                            <th className="pb-6 px-4 text-center">Difficulty</th>
                                            <th className="pb-6 px-4">Performance</th>
                                            <th className="pb-6 px-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {interviews.length > 0 ? interviews.slice(0, 5).map((interview) => (
                                            <tr key={interview._id} className="group">
                                                <td className="py-6 px-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">{interview.role}</div>
                                                    <div className="text-sm text-slate-500 font-medium whitespace-nowrap">{formatDate(interview.createdAt)}</div>
                                                </td>
                                                <td className="py-6 px-4 text-center">
                                                    <DifficultyBadge level={interview.difficulty} />
                                                </td>
                                                <td className="py-6 px-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-grow bg-slate-100 dark:bg-slate-800 h-2 rounded-full min-w-[120px] overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${interview.finalScore}%` }}
                                                                className={`h-full rounded-full ${interview.finalScore >= 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                                                                    interview.finalScore >= 50 ? 'bg-primary-500 shadow-[0_0_10px_rgba(51,80,255,0.3)]' :
                                                                        'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                                                                    }`}
                                                            />
                                                        </div>
                                                        <span className="font-black text-slate-900 dark:text-white min-w-[3ch] font-display">{interview.finalScore}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <Link to={`/result/${interview._id}`}>
                                                            <button className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-sm" title="View Report">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                                </svg>
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Are you sure you want to delete this session?')) {
                                                                    handleDelete(interview._id);
                                                                }
                                                            }}
                                                            className="w-10 h-10 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                            title="Delete Session"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <>
                                                <tr className="opacity-40">
                                                    <td className="py-6 px-4 animate-pulse">
                                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-2"></div>
                                                        <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded w-16"></div>
                                                    </td>
                                                    <td className="py-6 px-4 text-center">
                                                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20 mx-auto"></div>
                                                    </td>
                                                    <td className="py-6 px-4">
                                                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-32 mx-auto"></div>
                                                    </td>
                                                    <td className="py-6 px-4 text-right">
                                                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl ml-auto"></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="4" className="py-20 text-center">
                                                        <div className="max-w-xs mx-auto">
                                                            <p className="text-slate-400 font-bold mb-8">Your evolution is just beginning. Complete 3 sessions to unlock deep analytics.</p>
                                                            <Link to="/interview/new">
                                                                <button className="px-8 py-4 border-2 border-primary-600/20 text-primary-600 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all font-display">
                                                                    Initiate New Sequence
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Evolution Sidebar */}
                <div className="space-y-8">
                    <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-primary-500/20 overflow-hidden relative h-full flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[50px] pointer-events-none"></div>
                        <h2 className="text-2xl font-bold font-display mb-8 text-slate-900 dark:text-white">Evolution Path</h2>

                        <div className="space-y-8">
                            <GrowthItem label="Technical Precision" progress={78} />
                            <GrowthItem label="System Thinking" progress={62} />
                            <GrowthItem label="Communication" progress={85} />
                        </div>

                        <div className="mt-auto pt-10">
                            <div className="p-8 bg-slate-900 dark:bg-primary-600 rounded-[2.5rem] text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] group-hover:bg-white/20 transition-all"></div>
                                <h3 className="font-bold text-xl mb-3 relative z-10 font-display">Continue Learning</h3>
                                <p className="text-sm opacity-80 leading-relaxed font-medium mb-8 relative z-10">Master <b>System Design</b>. Your telemetry shows a significant gap in scalability terminology.</p>
                                <Link to="/interview/new?role=Full-Stack&difficulty=Senior">
                                    <motion.button
                                        whileHover={{ x: 5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.3)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest bg-primary-700 text-white dark:bg-white dark:text-slate-900 px-6 py-5 rounded-[2rem] relative z-10 shadow-xl font-display"
                                    >
                                        Initialize Simulation
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DifficultyBadge = ({ level }) => {
    const config = {
        Senior: {
            color: 'bg-red-500/10 text-red-500 border-red-500/20',
            icon: (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" />
                    <path d="M19 19H5" strokeLinecap="round" />
                </svg>
            )
        },
        Mid: {
            color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            icon: (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            )
        },
        Junior: {
            color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            icon: (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
                </svg>
            )
        }
    };

    const { color, icon } = config[level] || config.Junior;

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${color}`}>
            {icon}
            {level}
        </span>
    );
};

const StatCard = ({ label, value, unit, color }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="glass-card p-8 rounded-[2rem] border-white/50 dark:border-slate-800/50"
    >
        <div className="flex items-center gap-4 mb-3">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-display">{label}</span>
        </div>
        <div className="text-3xl font-black text-slate-900 dark:text-white font-display mb-1">{value}</div>
        <div className="text-xs font-bold text-slate-400 font-medium">{unit}</div>
    </motion.div>
);

const PathCard = ({ role, skills, difficulty, color, icon, link }) => {
    const [questionCount, setQuestionCount] = useState(5);

    // Parse the base link to append question count
    const finalLink = `${link}&questions=${questionCount}`;

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="glass-card p-10 rounded-[3rem] hover:bg-white dark:hover:bg-slate-900 transition-all border-slate-200/50 dark:border-slate-800/50 text-center flex flex-col items-center min-h-[500px]"
        >
            <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-8 bg-${color}-500/10 text-${color}-600`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {icon}
                </svg>
            </div>

            <h3 className="text-2xl font-black mb-1 text-slate-900 dark:text-white font-display">{role}</h3>
            <p className="text-xs font-bold text-slate-500 mb-8">{skills}</p>

            <div className="mb-10">
                <span className={`px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-${color}-500/20 text-${color}-600 bg-${color}-500/5`}>
                    {difficulty}
                </span>
            </div>

            {/* Action Block */}
            <div className="mt-auto w-full space-y-8">
                <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">Target Questions</span>
                    <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5 w-full">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                onClick={() => setQuestionCount(num)}
                                className={`flex-grow h-10 rounded-xl text-xs font-black transition-all ${questionCount === num
                                    ? `bg-primary-600 text-white shadow-lg`
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                <Link to={finalLink} className="block w-full">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all bg-primary-600 text-white shadow-2xl shadow-primary-500/30 hover:scale-[1.02] font-display"
                    >
                        Initialize Simulation
                    </motion.button>
                </Link>
            </div>
        </motion.div>
    );
};

const GrowthItem = ({ label, progress }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-black uppercase tracking-tighter font-display">
            <span className="text-slate-500 dark:text-slate-400">{label}</span>
            <span className="text-slate-900 dark:text-white">{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary-600 rounded-full"
            />
        </div>
    </div>
);

export default Dashboard;