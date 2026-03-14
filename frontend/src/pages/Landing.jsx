import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, CheckCircle, LogIn, Globe, Mail, Cpu, Zap, Target, TrendingUp, FileSearch, Shield } from 'lucide-react';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-x-hidden min-h-screen">
            {/* Top Navigation */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between glass px-8 py-4 rounded-full border border-glass-border">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sparkles className="text-white text-[20px]" />
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight">Echo</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-10">
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#features">Features</a>
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#intelligence">About AI</a>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link to="/dashboard">
                                <button className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(51,82,255,0.3)]">
                                    Go to Dashboard
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className="hidden sm:block text-sm font-medium px-6">Login</button>
                                </Link>
                                <Link to="/register">
                                    <button className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(51,82,255,0.3)]">
                                        Get Started
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="relative pt-32">
                {/* Hero Section */}
                <section className="relative px-6 py-20 lg:py-32 hero-gradient">
                    <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/30 mb-8"
                        >
                            <Sparkles className="text-primary text-sm" />
                            <span className="text-xs font-bold tracking-widest uppercase text-primary">Future of Interviewing</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8 text-gradient"
                        >
                            Master the Art of <br />The Interview.
                        </motion.h1>

                        <p className="max-w-2xl text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-12">
                            Experience the most advanced data-driven simulator ever built. Echo's stealth AI analyzes every nuance of your performance to secure your elite career move.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6">
                            {user ? (
                                <Link to="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-primary to-[#5c75ff] hover:opacity-90 text-white font-bold px-10 py-5 rounded-full transition-all shadow-[0_10px_30px_rgba(51,82,255,0.4)] flex items-center gap-2"
                                    >
                                        Start Simulation <ArrowRight />
                                    </motion.button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-gradient-to-r from-primary to-[#5c75ff] hover:opacity-90 text-white font-bold px-10 py-5 rounded-full transition-all shadow-[0_10px_30px_rgba(51,82,255,0.4)] flex items-center gap-2"
                                        >
                                            Get Started <ArrowRight />
                                        </motion.button>
                                    </Link>
                                    <Link to="/login">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="glass border border-glass-border hover:bg-white/5 text-white font-bold px-10 py-5 rounded-full transition-all flex items-center gap-2"
                                        >
                                            View Demo
                                        </motion.button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Bento Grid Features */}
                <section id="features" className="px-6 py-24 max-w-7xl mx-auto scroll-mt-24">
                    <div className="mb-16">
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Stealth Intelligence</h2>
                        <p className="text-slate-400">Engineered for elite candidates targeting FAANG, Finance, and Leadership.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon="psychology"
                            title="AI Intelligence"
                            desc="Neural networks that adapt to your unique speaking style, vocabulary, and deep industry knowledge."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon="monitoring"
                            title="Real-time Evaluation"
                            desc="Instant feedback loops analyzing sentiment, pace, micro-expressions, and technical precision."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon="conversion_path"
                            title="Custom Tracks"
                            desc="Tailored simulation paths for specialized roles, high-stakes board meetings, and venture pitches."
                            delay={0.3}
                        />
                    </div>
                </section>

                {/* Visual Intelligence Section */}
                <section id="intelligence" className="px-6 py-24 max-w-7xl mx-auto overflow-hidden scroll-mt-24">
                    <div className="glass rounded-xl border border-glass-border flex flex-col lg:flex-row items-center overflow-hidden">
                        <div className="p-12 lg:w-1/2">
                            <h2 className="font-display text-4xl font-bold mb-6">Global Talent Graph</h2>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Join 50,000+ elite professionals across top tech hubs using Echo to benchmark their performance against the world's highest earners.
                            </p>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <CheckCircle className="text-primary" />
                                    Benchmarked against Top 1% candidates
                                </div>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <CheckCircle className="text-primary" />
                                    Localized market salary intelligence
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full h-[400px] relative">
                            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10"></div>
                            <img className="w-full h-full object-cover opacity-60" alt="Digital network map of world cities" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop" />
                        </div>
                    </div>
                </section>

                {/* Final Immersive CTA */}
                <section className="px-6 py-24 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative glass rounded-xl border border-glass-border p-12 md:p-24 text-center overflow-hidden"
                    >
                        {/* Background Decorative Gradients */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(51,82,255,0.2)_0%,transparent_70%)]"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="font-display text-4xl md:text-6xl font-bold mb-8 max-w-3xl">Ready to enter the next phase of your career?</h2>
                            <p className="text-slate-400 text-lg mb-12 max-w-xl">
                                The simulation is ready. Your future self is waiting on the other side.
                            </p>
                            <Link to={user ? "/dashboard" : "/register"}>
                                <button className="group bg-white text-background-dark font-bold text-lg px-12 py-6 rounded-full transition-all hover:scale-105 shadow-[0_20px_40px_rgba(255,255,255,0.15)] flex items-center gap-3">
                                    Enter the Simulator
                                    <LogIn className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="border-t border-glass-border py-20 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                        <div className="col-span-2 lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="bg-primary p-1.5 rounded-lg">
                                    <Sparkles className="text-white text-[20px]" />
                                </div>
                                <span className="font-display font-bold text-xl">Echo</span>
                            </div>
                            <p className="text-slate-400 max-w-xs mb-8">
                                The world's leading AI-powered performance intelligence platform for elite candidates.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full glass border border-glass-border flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                                    <Globe className="text-sm" />
                                </div>
                                <div className="w-10 h-10 rounded-full glass border border-glass-border flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                                    <Mail className="text-sm" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Product</h4>
                            <ul className="flex flex-col gap-4 text-slate-400 text-sm">
                                <li><a className="hover:text-primary transition-colors" href="#">Intelligence</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Simulation</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Enterprise</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Resources</h4>
                            <ul className="flex flex-col gap-4 text-slate-400 text-sm">
                                <li><a className="hover:text-primary transition-colors" href="#">Success Stories</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Career Blog</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">API Docs</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Legal</h4>
                            <ul className="flex flex-col gap-4 text-slate-400 text-sm">
                                <li><a className="hover:text-primary transition-colors" href="#">Privacy</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Terms</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-glass-border flex flex-col md:flex-row justify-between gap-6 text-slate-500 text-xs uppercase tracking-widest">
                        <span>© 2024 Echo Intelligence Systems. All rights reserved.</span>
                        <div className="flex gap-8">
                            <span>Engineered in San Francisco</span>
                            <span>Systems Status: Active</span>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => {
    const getIcon = () => {
        switch (icon) {
            case 'memory': return <Cpu className="text-accent-neon text-3xl" />;
            case 'bolt': return <Zap className="text-accent-neon text-3xl" />;
            case 'target': return <Target className="text-accent-neon text-3xl" />;
            case 'trending_up': return <TrendingUp className="text-accent-neon text-3xl" />;
            case 'search': return <FileSearch className="text-accent-neon text-3xl" />;
            case 'shield': return <Shield className="text-accent-neon text-3xl" />;
            default: return <Cpu className="text-accent-neon text-3xl" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -10 }}
            className="glass p-10 rounded-xl border border-glass-border flex flex-col gap-6 group hover:border-primary/50 transition-all"
        >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                {getIcon()}
            </div>
            <div>
                <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    );
};

export default Landing;