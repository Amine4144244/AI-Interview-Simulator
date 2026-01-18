import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>
            </div>

            {/* Hero Section */}
            <section className="relative flex-grow flex items-center justify-center pt-20 pb-20">
                <div className="container mx-auto px-4 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary-600 uppercase bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 rounded-full"
                        >
                            Future of Interviewing
                        </motion.span>

                        <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tight font-display">
                            Master Your <br />
                            <span className="premium-gradient-text">Next Interview</span>
                        </h1>

                        <p className="text-xl md:text-2xl mb-12 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Experience the power of AI-driven mock interviews. Get instant feedback,
                            refined scores, and professional insights to land your dream job.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            {user ? (
                                <Link to="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(51 80 255 / 0.1), 0 8px 10px -6px rgb(51 80 255 / 0.1)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-10 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-500 transition-all text-lg font-bold shadow-xl shadow-primary-500/20"
                                    >
                                        Go to Dashboard
                                    </motion.button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register">
                                        <motion.button
                                            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(51 80 255 / 0.1), 0 8px 10px -6px rgb(51 80 255 / 0.1)" }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-10 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-500 transition-all text-lg font-bold shadow-xl shadow-primary-500/20"
                                        >
                                            Get Started Free
                                        </motion.button>
                                    </Link>
                                    <Link to="/login">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-10 py-4 glass-button bg-slate-100/50 dark:bg-slate-800/50 text-slate-800 dark:text-white rounded-2xl transition-all text-lg font-bold border-slate-300 dark:border-slate-700 shadow-lg"
                                        >
                                            View Demo
                                        </motion.button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">Why Practice With Us?</h2>
                        <div className="w-20 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <FeatureCard
                            delay={0.1}
                            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />}
                            title="AI Intelligence"
                            desc="Leverage state-of-the-art LLMs that understand your role and experience level perfectly."
                        />
                        <FeatureCard
                            delay={0.2}
                            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                            title="Real-time Evaluation"
                            desc="Get instant scores and detailed analysis on your answers, highlighting strengths and weaknesses."
                        />
                        <FeatureCard
                            delay={0.3}
                            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                            title="Custom Tracks"
                            desc="Choose from Frontend, Backend, or Full-Stack paths with varying difficulty levels."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto glass-card bg-white/90 dark:bg-slate-900/95 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border-white dark:border-slate-700 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/5 blur-[100px] pointer-events-none"></div>

                    <h2 className="text-4xl md:text-6xl font-bold mb-6 font-display">Ready to land <br /> the job?</h2>
                    <p className="text-xl mb-12 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Stop guessing and start practicing. The best way to predict your success is to simulate it.
                    </p>
                    <Link to={user ? "/dashboard" : "/register"}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xl font-bold transition-transform"
                        >
                            Start Now — It's Free
                        </motion.button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -10 }}
        className="glass-card p-10 rounded-[2.5rem] bg-white/90 dark:bg-slate-900/95 border-white dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg"
    >
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-8 border border-primary-200 dark:border-primary-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {icon}
            </svg>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white font-display">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {desc}
        </p>
    </motion.div>
);

export default Landing;