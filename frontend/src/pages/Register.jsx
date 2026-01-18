import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-md w-full z-10"
            >
                <div className="glass-card rounded-[3rem] p-10 md:p-12 border-white/50 dark:border-slate-800/50 shadow-2xl">
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-block mb-6">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: -10 }}
                                className="w-14 h-14 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-primary-500/20"
                            >
                                <span className="text-white font-bold text-2xl font-display">AI</span>
                            </motion.div>
                        </Link>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
                            Create Account
                        </h2>
                        <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium">
                            Start your journey to interview mastery
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-5 py-4 rounded-2xl text-sm font-bold"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-3.5 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white rounded-2xl outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-5 py-3.5 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white rounded-2xl outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white rounded-2xl outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                        Confirm
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white rounded-2xl outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-[1.5rem] font-bold shadow-xl hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-all text-lg"
                        >
                            {isLoading ? 'Creating Account...' : 'Join the Community'}
                        </motion.button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-600 dark:text-slate-400 font-bold">
                            Already a member?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-500 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
