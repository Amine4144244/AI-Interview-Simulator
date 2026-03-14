import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Bell, TrendingUp, Lightbulb, Timer } from 'lucide-react';

const Analytics = () => {
    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await api.get('/interviews');
                setInterviews(response.data.interviews);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    const completedInterviews = interviews ? interviews.filter(interview => interview.status === 'completed') : [];

    // Sort chronologically for trend analysis
    const sortedInterviews = [...completedInterviews].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Calculate progression map data
    const progressionData = sortedInterviews.slice(-10).map((iv, index) => ({
        id: index + 1,
        score: iv.finalScore || 0,
        date: new Date(iv.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

    // Example Skill distribution data
    const skills = [
        { name: 'JavaScript React', value: 92, color: 'bg-[#f7df1e]' },
        { name: 'API Design', value: 85, color: 'bg-primary' },
        { name: 'System Architecture', value: 78, color: 'bg-[#5c75ff]' },
        { name: 'Data Structures', value: 88, color: 'bg-emerald-400' },
        { name: 'Communication', value: 95, color: 'bg-accent-neon' },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            <Sidebar activePath="/analytics" />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#0a0c16] relative pb-20">
                {/* Top Nav Placeholder */}
                <header className="sticky top-0 z-10 hidden md:flex items-center justify-between px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-glass-border">
                    <h2 className="font-display font-bold text-xl">Analytics & Telemetry</h2>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full glass text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="font-display text-4xl font-bold tracking-tight mb-2">Performance Analytics</h1>
                        <p className="text-slate-400">Deep insight into your interview proficiency and evolution pathways.</p>
                    </div>

                    {/* Progress Chart (Bespoke Tailwind implementation) */}
                    <div className="glass p-8 rounded-xl border border-glass-border">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-bold font-display">Performance Trajectory</h3>
                                <p className="text-sm text-slate-400">Scores across your last 10 completed sessions</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-emerald-400">+12%</p>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Trend</p>
                            </div>
                        </div>

                        {/* Custom Bar Chart Representation */}
                        <div className="h-64 flex items-end justify-between gap-2 border-b border-glass-border pb-2 relative">
                            {/* Y-axis guidelines */}
                            <div className="absolute left-0 right-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none">
                                <div className="border-t border-glass-border/30 w-full"></div>
                                <div className="border-t border-glass-border/30 w-full"></div>
                                <div className="border-t border-glass-border/30 w-full"></div>
                                <div className="border-t border-glass-border/30 w-full"></div>
                            </div>

                            {/* Bars */}
                            {progressionData.length > 0 ? progressionData.map((data, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                                    <div className="w-full max-w-[40px] bg-slate-800 rounded-t-sm relative h-full flex items-end overflow-hidden group-hover:bg-slate-700 transition-colors">
                                        <div
                                            className="w-full bg-gradient-to-t from-primary/50 to-primary rounded-t-sm transition-all duration-1000 ease-out"
                                            style={{ height: `${data.score}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold">{data.date}</span>

                                    {/* Tooltip */}
                                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-3 rounded-md font-bold pointer-events-none">
                                        {data.score}%
                                    </div>
                                </div>
                            )) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 italic">
                                    Complete more sessions to generate trajectory data.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Radar/Skill Map Replacement */}
                        <div className="glass p-8 rounded-xl border border-glass-border">
                            <h3 className="text-lg font-bold font-display mb-2">Skill Composition</h3>
                            <p className="text-sm text-slate-400 mb-8">AI-evaluated breakdown of your core competencies.</p>

                            <div className="space-y-6">
                                {skills.map((skill, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium">{skill.name}</span>
                                            <span className="font-bold">{skill.value}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${skill.color} shadow-[0_0_10px_currentColor]`}
                                                style={{ width: `${skill.value}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Insights */}
                        <div className="glass p-8 rounded-xl border border-glass-border">
                            <h3 className="text-lg font-bold font-display mb-2">Echo Intelligence Insights</h3>
                            <p className="text-sm text-slate-400 mb-6">Actionable feedback from your recent sessions.</p>

                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                                    <h4 className="text-emerald-400 text-sm font-bold flex items-center gap-2 mb-1">
                                        <TrendingUp size={16} /> Strength Identified
                                    </h4>
                                    <p className="text-sm text-slate-300">Your explanations of System Design tradeoffs are consistently clear and logically structured.</p>
                                </div>
                                <div className="p-4 rounded-lg bg-amber-400/10 border border-amber-400/20">
                                    <h4 className="text-amber-400 text-sm font-bold flex items-center gap-2 mb-1">
                                        <Lightbulb size={16} /> Optimization Opportunity
                                    </h4>
                                    <p className="text-sm text-slate-300">Try implementing edge-case validation earlier when writing algorithms to improve initial precision scores.</p>
                                </div>
                                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                    <h4 className="text-primary text-sm font-bold flex items-center gap-2 mb-1">
                                        <Timer size={16} /> Pace Analysis
                                    </h4>
                                    <p className="text-sm text-slate-300">Your speaking pace averages 140 WPM. This maps perfectly to the executive pacing of senior technical leads.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
