import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Sparkles, AlertCircle, User, Mail, UserPlus } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setIsLoading(true);

        const result = await register(name, email, password);

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
            <div className="absolute -bottom-24 -right-24 size-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
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

                        <h1 className="font-display text-4xl font-bold mb-3 text-gradient">Create profile</h1>
                        <p className="text-slate-400 font-light">Join the global talent intelligence graph</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                            >
                                <AlertCircle className="text-base" />
                                {typeof error === 'object' ? (error.message || JSON.stringify(error)) : error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Identity</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-glass-border focus:border-primary/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Communications</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-glass-border focus:border-primary/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600"
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Key</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-glass-border focus:border-primary/50 text-white rounded-xl py-4 px-4 outline-none transition-all placeholder:text-slate-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Confirm</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-glass-border focus:border-primary/50 text-white rounded-xl py-4 px-4 outline-none transition-all placeholder:text-slate-600"
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
                                    Initialize Account
                                    <UserPlus className="text-xl group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-glass-border text-center">
                        <p className="text-slate-400 text-sm">
                            Already active? <Link to="/login" className="text-primary font-bold hover:text-accent-neon transition-colors ml-1">Sign In</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
