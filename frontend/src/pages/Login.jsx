import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-md w-full z-10"
            >
                <div className="glass-card rounded-[3rem] p-10 md:p-12 border-white/50 dark:border-slate-800/50 shadow-2xl">
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-block mb-8">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-primary-500/20"
                            >
                                <span className="text-white font-bold text-3xl font-display">AI</span>
                            </motion.div>
                        </Link>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium">
                            Enter your credentials to continue
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-5 py-4 rounded-2xl text-sm font-bold"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-5 py-4 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white rounded-2xl outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-5 py-4 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white rounded-2xl outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center group cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500" />
                                <span className="ml-3 text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary-500 transition-colors">
                                    Remember me
                                </span>
                            </label>
                            <Link to="#" className="text-sm font-bold text-primary-600 hover:text-primary-500 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-primary-600 text-white rounded-[1.5rem] font-bold shadow-xl shadow-primary-500/20 hover:bg-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all text-lg"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </motion.button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-600 dark:text-slate-400 font-bold">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 hover:text-primary-500 transition-colors">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;