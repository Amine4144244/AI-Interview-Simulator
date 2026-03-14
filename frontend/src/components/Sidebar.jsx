import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, LayoutDashboard, BarChart3, History, LogOut } from 'lucide-react';

const SkillMetric = ({ label, value, color }) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">{label}</span>
            <span className={`text-${color.replace('bg-', '')}`}>{value}%</span>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const Sidebar = ({ activePath = '/dashboard' }) => {
    const { user, logout } = useAuth();

    return (
        <aside className="hidden md:flex w-72 flex-shrink-0 border-r border-glass-border bg-background-dark p-6 flex-col gap-8">
            <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Zap className="text-white w-5 h-5" />
                </div>
                <h1 className="font-display font-bold text-xl tracking-tight">ECHO AI</h1>
            </div>

            <nav className="flex-1 flex flex-col gap-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 px-2">Evolution Path</p>
                <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activePath === '/dashboard' ? 'bg-primary/10 text-primary border border-transparent' : 'hover:bg-white/5 border border-transparent text-slate-400 hover:text-white'}`}>
                    <LayoutDashboard size={20} />
                    <span className="font-medium">Overview</span>
                </Link>
                <Link to="/analytics" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activePath === '/analytics' ? 'bg-primary/10 text-primary border border-transparent' : 'hover:bg-white/5 border border-transparent text-slate-400 hover:text-white'}`}>
                    <BarChart3 size={20} />
                    <span className="font-medium">Analytics</span>
                </Link>
                <Link to="/sessions" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activePath === '/sessions' ? 'bg-primary/10 text-primary border border-transparent' : 'hover:bg-white/5 border border-transparent text-slate-400 hover:text-white'}`}>
                    <History size={20} />
                    <span className="font-medium">Sessions</span>
                </Link>

                <div className="mt-8">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4 px-2">Skill Metrics</p>
                    <div className="space-y-4 px-2">
                        <SkillMetric label="Technical Precision" value={82} color="bg-primary" />
                        <SkillMetric label="System Thinking" value={68} color="bg-emerald-400" />
                        <SkillMetric label="Communication" value={91} color="bg-amber-400" />
                    </div>
                </div>
            </nav>

            <div className="glass p-4 rounded-xl border border-glass-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-glass-border overflow-hidden flex items-center justify-center text-primary font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate text-white">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">Pro Member</p>
                    </div>
                    <button onClick={logout} className="text-slate-400 hover:text-white transition-colors" title="Logout"><LogOut size={20} /></button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
