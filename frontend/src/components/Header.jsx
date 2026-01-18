import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
    const { user, logout } = useAuth();
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

    const menuVariants = {
        hidden: { opacity: 0, y: -20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
    };

    return (
        <header className="fixed top-6 left-0 right-0 z-50 px-4">
            <div
                className={`container mx-auto max-w-7xl transition-all duration-500 glass-card bg-white/90 dark:bg-slate-900/95 rounded-[2rem] border-white/60 dark:border-slate-700/60 shadow-2xl overflow-hidden`}
            >
                <div className="relative flex justify-between items-center h-20 px-6 md:px-10">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.6 }}
                            className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20"
                        >
                            <span className="text-white font-bold text-2xl font-display">AI</span>
                        </motion.div>
                        <span className="font-bold text-2xl tracking-tight text-slate-800 dark:text-white font-display">
                            IntelliSim
                        </span>
                    </Link>

                    {/* Right-side actions & Navigation */}
                    <div className="flex items-center space-x-8">
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-10 text-sm font-bold tracking-wide uppercase">
                            <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                                Home
                            </Link>
                            {user && (
                                <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                                    Dashboard
                                </Link>
                            )}
                        </nav>

                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

                        <div className="flex items-center space-x-5">
                            <DarkModeToggle />

                            {user ? (
                                <div className="relative">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={toggleUserMenu}
                                        className="flex items-center space-x-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="relative">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                alt="Avatar"
                                                className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800"
                                            />
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                                        </div>
                                    </motion.button>

                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial="hidden"
                                                animate="visible"
                                                exit="hidden"
                                                variants={menuVariants}
                                                className={`absolute right-0 mt-4 w-64 glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl shadow-2xl py-3 border-white/80 dark:border-slate-700/80 overflow-hidden`}
                                            >
                                                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                                                </div>
                                                <div className="p-2">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        <span>Logout</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center space-x-4">
                                    <Link to="/login">
                                        <motion.button
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:text-primary-500 transition-colors"
                                        >
                                            Sign In
                                        </motion.button>
                                    </Link>
                                    <Link to="/register">
                                        <motion.button
                                            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgb(51 80 255 / 0.2)" }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-2.5 text-sm bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/10 hover:bg-primary-500 transition-all"
                                        >
                                            Get Started
                                        </motion.button>
                                    </Link>
                                </div>
                            )}

                            {/* Hamburger Menu (Mobile) */}
                            <div className="md:hidden">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleMenu}
                                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16'} />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-slate-100 dark:border-slate-800 p-6 space-y-4"
                        >
                            <Link to="/" className="block py-3 text-lg font-bold text-slate-700 dark:text-slate-300" onClick={() => setIsMenuOpen(false)}>Home</Link>
                            {user && (
                                <Link to="/dashboard" className="block py-3 text-lg font-bold text-slate-700 dark:text-slate-300" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                            )}
                            {!user && (
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                        <button className="w-full py-4 text-sm font-bold text-slate-700 dark:text-slate-300 rounded-2xl bg-slate-100 dark:bg-slate-800">
                                            Sign In
                                        </button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                        <button className="w-full py-4 text-sm font-bold text-white rounded-2xl bg-primary-600">
                                            Join Now
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Header;
