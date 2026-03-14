import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Sparkles, AlertCircle, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setIsLoading(false);
    };

    return (
        <div className="bg-background-dark text-slate-100 min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(51,82,255,0.15)_0%,transparent_70%)] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 size-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md z-10"
            >
                <div className="glass p-8 md:p-12 rounded-xl border border-glass-border shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                    <div className="text-center mb-10">
                        <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                            <div className="bg-primary p-2 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Sparkles className="text-white text-2xl" />
                            </div>
                            <span className="font-display font-bold text-2xl tracking-tight">Echo</span>
                        </Link>

                        <h1 className="font-display text-4xl font-bold mb-3 text-gradient">Welcome back</h1>
                        <p className="text-slate-400 font-light">Access the simulation environment</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                            >
                                <AlertCircle className="text-base" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Terminal</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-glass-border focus:border-primary/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600"
                                        placeholder="user@echo.ai"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Access Key</label>
                                    <Link to="#" className="text-[10px] uppercase font-bold text-primary hover:text-accent-neon transition-colors">Lost key?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-glass-border focus:border-primary/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-primary to-[#5c75ff] hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(51,82,255,0.3)] flex items-center justify-center gap-2 mt-8 group"
                        >
                            {isLoading ? (
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Establish Link
                                    <LogIn className="text-xl group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-glass-border text-center">
                        <p className="text-slate-400 text-sm">
                            New recruit? <Link to="/register" className="text-primary font-bold hover:text-accent-neon transition-colors ml-1">Create Artifact</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;