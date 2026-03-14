import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
    BarChart3, Cpu, Terminal, RotateCw, Send, ArrowRight,
    Clock, Zap, AlertCircle, CheckCircle, XCircle,
    Hash, Gauge, BrainCircuit, ChevronLeft, Sparkles, Timer
} from 'lucide-react';

const InterviewSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const textareaRef = useRef(null);

    const [interview, setInterview] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [answerInput, setAnswerInput] = useState('');
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
    const [currentEvaluation, setCurrentEvaluation] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [error, setError] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Timer
    useEffect(() => {
        if (!isLoading && !isCompleted && !error) {
            const timer = setInterval(() => setElapsedTime(t => t + 1), 1000);
            return () => clearInterval(timer);
        }
    }, [isLoading, isCompleted, error]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    useEffect(() => {
        const initInterview = async () => {
            try {
                if (id === 'new') {
                    const urlParams = new URLSearchParams(window.location.search);
                    const role = urlParams.get('role') || 'Full-Stack';
                    const difficulty = urlParams.get('difficulty') || 'Mid';
                    const totalQuestions = parseInt(urlParams.get('questions')) || 5;

                    const response = await api.post('/interviews', { role, difficulty, totalQuestions });
                    navigate(`/interview/${response.data.interview._id}`, { replace: true });
                } else {
                    const response = await api.get(`/interviews/${id}`);
                    const interviewData = response.data.interview;
                    setInterview(interviewData);

                    if (interviewData.status === 'completed') {
                        setIsCompleted(true);
                        navigate(`/result/${id}`, { replace: true });
                    } else {
                        const questionIndex = interviewData.questions?.length || 0;
                        setCurrentQuestionIndex(questionIndex);

                        if (questionIndex < interviewData.totalQuestions) {
                            await generateQuestion(
                                interviewData._id,
                                interviewData.role,
                                interviewData.difficulty,
                                questionIndex + 1
                            );
                        }
                    }
                }
            } catch (err) {
                setError('Failed to initialize session');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            initInterview();
        }
    }, [id, navigate]);

    const generateQuestion = async (interviewId, role, difficulty, questionNumber) => {
        setIsGeneratingQuestion(true);
        try {
            const response = await api.post('/ai/generate-question', {
                role,
                difficulty,
                questionNumber
            });

            setCurrentQuestion(response.data.question);
            setAnswerInput('');
            setShowFeedback(false);
            setCurrentEvaluation(null);
        } catch (err) {
            setError('Neural network timeout');
            console.error(err);
        } finally {
            setIsGeneratingQuestion(false);
        }
    };

    const submitAnswer = async () => {
        if (!interview || !answerInput.trim()) return;

        setIsSubmittingAnswer(true);
        try {
            const evaluationResponse = await api.post('/ai/evaluate-answer', {
                question: currentQuestion,
                answer: answerInput,
                role: interview.role,
                difficulty: interview.difficulty
            });

            const evaluation = evaluationResponse.data;
            setCurrentEvaluation(evaluation);

            await api.post(`/interviews/${interview._id}/answer`, {
                question: currentQuestion,
                answer: answerInput,
                evaluation
            });

            setInterview(prev => ({
                ...prev,
                questions: [...(prev.questions || []), currentQuestion],
                answers: [...(prev.answers || []), answerInput],
                evaluations: [...(prev.evaluations || []), evaluation]
            }));

            setShowFeedback(true);
        } catch (err) {
            setError('Submission failure');
            console.error(err);
        } finally {
            setIsSubmittingAnswer(false);
        }
    };

    const nextQuestion = async () => {
        if (!interview) return;

        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex >= interview.totalQuestions) {
            try {
                const reportResponse = await api.post('/ai/final-report', {
                    role: interview.role,
                    difficulty: interview.difficulty,
                    evaluations: interview.evaluations || []
                });

                const { finalScore, summary, recommendedTopics } = reportResponse.data;

                await api.patch(`/interviews/${interview._id}`, {
                    isCompleted: true,
                    finalScore,
                    summary,
                    recommendedTopics
                });

                setIsCompleted(true);
                navigate(`/result/${interview._id}`, { replace: true });
            } catch (err) {
                setError('Report generation failed');
                console.error(err);
            }
        } else {
            setCurrentQuestionIndex(nextIndex);
            await generateQuestion(
                interview._id,
                interview.role,
                interview.difficulty,
                nextIndex + 1
            );
        }
    };

    const totalQ = interview?.totalQuestions || 5;
    const progressPercentage = (currentQuestionIndex / totalQ) * 100;
    const adjustedProgress = showFeedback
        ? progressPercentage + (100 / totalQ)
        : progressPercentage;

    // --- LOADING STATE ---
    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 selection:bg-primary/30">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="relative mb-8">
                        <div className="absolute inset-0 blur-[60px] opacity-30 bg-primary rounded-full"></div>
                        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto relative"></div>
                    </div>
                    <p className="text-primary font-display font-bold tracking-[0.3em] uppercase text-xs">Initializing Neural Core</p>
                    <div className="mt-4 flex justify-center gap-1">
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-primary/60"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- ERROR STATE ---
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-12 rounded-2xl border border-rose-accent/30 text-center max-w-md relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-accent/5 to-transparent"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-full bg-rose-accent/10 border border-rose-accent/30 flex items-center justify-center mx-auto mb-6">
                            <XCircle className="text-rose-accent" size={28} />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-white mb-3">System Interrupted</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">{error}</p>
                        <Link to="/dashboard">
                            <button className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-primary/20">
                                Return to Dashboard
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- MAIN SESSION ---
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 selection:bg-primary/30">

            {/* ─── Header ─── */}
            <header className="sticky top-0 z-50 w-full border-b border-glass-border glass px-4 lg:px-8 py-3">
                <div className="max-w-[100rem] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/dashboard" className="flex items-center gap-2.5 group">
                            <div className="bg-primary p-1.5 rounded-lg group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                                <BarChart3 className="text-white" size={18} />
                            </div>
                            <h2 className="font-display text-lg font-bold tracking-tight">ECHO<span className="text-primary">.AI</span></h2>
                        </Link>
                        <div className="hidden md:flex items-center">
                            <Link to="/dashboard" className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors text-sm">
                                <ChevronLeft size={14} />
                                <span className="font-display font-medium">Exit Session</span>
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Timer */}
                        <div className="hidden sm:flex items-center gap-2 text-slate-400 glass px-3 py-1.5 rounded-lg">
                            <Timer size={14} className="text-primary" />
                            <span className="font-display font-bold text-xs tracking-wider">{formatTime(elapsedTime)}</span>
                        </div>
                        <div className="h-9 w-9 rounded-full border-2 border-primary/40 flex items-center justify-center font-display font-bold text-sm text-primary">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                </div>
            </header>

            {/* ─── Progress Bar ─── */}
            <div className="w-full border-b border-glass-border glass px-4 lg:px-8 py-3">
                <div className="max-w-[100rem] mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                                <BrainCircuit size={12} className="text-primary" />
                                <span className="text-[11px] font-display font-bold uppercase tracking-widest text-primary">{interview?.role || 'Technical'}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-accent/10 border border-amber-accent/20 rounded-lg">
                                <Gauge size={12} className="text-amber-accent" />
                                <span className="text-[11px] font-display font-bold uppercase tracking-widest text-amber-accent">{interview?.difficulty || 'Mid'}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-slate-500 text-sm font-display">
                                Challenge <span className="text-white font-bold">{String(currentQuestionIndex + 1).padStart(2, '0')}</span>
                                <span className="mx-1.5 text-slate-700">/</span>
                                <span className="text-slate-400">{String(totalQ).padStart(2, '0')}</span>
                            </span>
                            <span className="font-display font-bold text-sm text-primary">{Math.round(adjustedProgress)}%</span>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-slate-800/60 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full shadow-[0_0_12px_rgba(51,82,255,0.4)]"
                            initial={false}
                            animate={{ width: `${adjustedProgress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            </div>

            {/* ─── Main Content ─── */}
            <main className="flex-1 flex flex-col py-6 px-4 lg:px-8">
                <div className="max-w-[100rem] mx-auto w-full flex-1 flex flex-col gap-6">
                    <AnimatePresence mode="wait">
                        {isGeneratingQuestion ? (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.03 }}
                                className="flex-1 glass rounded-2xl flex flex-col items-center justify-center min-h-[50vh] relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
                                <div className="relative z-10 text-center">
                                    <div className="relative mb-8">
                                        <div className="absolute inset-0 blur-[50px] opacity-25 bg-primary rounded-full scale-150"></div>
                                        <Cpu className="text-primary relative" size={56} />
                                        <motion.div
                                            className="absolute inset-0"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <Sparkles className="text-primary/40 absolute -top-2 -right-2" size={16} />
                                        </motion.div>
                                    </div>
                                    <h1 className="font-display text-2xl font-bold text-white mb-2">Generating Challenge</h1>
                                    <p className="text-slate-500 font-display font-medium text-sm">Consulting collective intelligence...</p>
                                    <div className="mt-6 flex justify-center gap-1.5">
                                        {[0, 1, 2, 3, 4].map(i => (
                                            <motion.div
                                                key={i}
                                                className="w-1 h-6 rounded-full bg-primary/40"
                                                animate={{ scaleY: [0.3, 1, 0.3] }}
                                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="question"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="flex-1 flex flex-col gap-6"
                            >
                                {/* ─── Two-Panel Layout ─── */}
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1">

                                    {/* ── Left Panel: Question ── */}
                                    <div className="lg:col-span-2 flex flex-col gap-4">
                                        <div className="glass rounded-2xl p-6 lg:p-8 relative overflow-hidden flex-1 flex flex-col">
                                            {/* Accent bar */}
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-primary/60 to-transparent"></div>
                                            {/* Glow */}
                                            <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 blur-[80px] rounded-full"></div>

                                            <div className="relative z-10 flex flex-col flex-1">
                                                <div className="flex items-center gap-2 text-primary/80 mb-4">
                                                    <Terminal size={14} />
                                                    <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em]">Incoming Prompt</span>
                                                </div>

                                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                                    <h2 className="font-display text-xl lg:text-2xl xl:text-3xl font-bold leading-snug tracking-tight text-white">
                                                        {currentQuestion}
                                                    </h2>
                                                </div>

                                                {/* Session metadata chips */}
                                                <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-glass-border">
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md text-slate-400">
                                                        <Hash size={11} />
                                                        <span className="text-[10px] font-display font-bold uppercase tracking-wider">Q{currentQuestionIndex + 1}</span>
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md text-slate-400">
                                                        <Gauge size={11} />
                                                        <span className="text-[10px] font-display font-bold uppercase tracking-wider">{interview?.difficulty || 'Mid'}</span>
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md text-slate-400">
                                                        <BrainCircuit size={11} />
                                                        <span className="text-[10px] font-display font-bold uppercase tracking-wider">{interview?.role || 'Technical'}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Right Panel: Answer / Feedback ── */}
                                    <div className="lg:col-span-3 flex flex-col gap-4">
                                        <AnimatePresence mode="wait">
                                            {!showFeedback ? (
                                                <motion.div
                                                    key="answer-input"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex-1 flex flex-col"
                                                >
                                                    <div className="group relative glow-primary rounded-2xl transition-all duration-500 flex-1 flex flex-col">
                                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/15 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                                                        <div className="relative flex-1 flex flex-col glass rounded-2xl overflow-hidden">
                                                            <textarea
                                                                ref={textareaRef}
                                                                className="flex-1 w-full bg-transparent min-h-[320px] lg:min-h-0 p-6 lg:p-8 text-base lg:text-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-0 leading-relaxed resize-none"
                                                                placeholder="Describe your architectural vision..."
                                                                value={answerInput}
                                                                onChange={(e) => setAnswerInput(e.target.value)}
                                                                disabled={isSubmittingAnswer}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                                                        submitAnswer();
                                                                    }
                                                                }}
                                                            />
                                                            <div className="flex items-center justify-between p-4 border-t border-glass-border">
                                                                <span className="text-slate-600 text-xs font-display">
                                                                    {answerInput.length > 0 && (
                                                                        <>{answerInput.length} chars · Ctrl+Enter to submit</>
                                                                    )}
                                                                </span>
                                                                <button
                                                                    onClick={submitAnswer}
                                                                    disabled={isSubmittingAnswer || !answerInput.trim()}
                                                                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/80 disabled:opacity-40 disabled:hover:bg-primary text-white rounded-xl transition-all font-display font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                                                                >
                                                                    {isSubmittingAnswer ? (
                                                                        <><RotateCw size={14} className="animate-spin" /> Analyzing</>
                                                                    ) : (
                                                                        <><Send size={14} /> Submit</>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="feedback"
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex-1 flex flex-col gap-4"
                                                >
                                                    {/* Score cards */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <FeedbackCard
                                                            title="Key Strength"
                                                            color="emerald"
                                                            icon="check_circle"
                                                            message={currentEvaluation?.strengths || "Strong analytical approach."}
                                                        />
                                                        <FeedbackCard
                                                            title="Improvement Area"
                                                            color="amber"
                                                            icon="bolt"
                                                            message={currentEvaluation?.weaknesses || "Consider edge cases."}
                                                        />
                                                        <FeedbackCard
                                                            title="Technical Score"
                                                            color={currentEvaluation?.score > 70 ? 'emerald' : 'amber'}
                                                            icon={currentEvaluation?.score > 70 ? 'check_circle' : 'speed'}
                                                            message={`${currentEvaluation?.score || 0}% match against elite standard.`}
                                                        />
                                                    </div>

                                                    {/* Detailed analysis */}
                                                    <div className="glass rounded-2xl p-6 lg:p-8 flex-1">
                                                        <h3 className="font-display font-bold text-base mb-3 text-white flex items-center gap-2">
                                                            <Sparkles size={16} className="text-primary" />
                                                            Detailed Analysis
                                                        </h3>
                                                        <p className="text-slate-400 leading-relaxed text-sm">{currentEvaluation?.feedback}</p>

                                                        {/* Suggestions */}
                                                        {currentEvaluation?.suggestions && currentEvaluation.suggestions.length > 0 && (
                                                            <div className="mt-4 pt-4 border-t border-glass-border">
                                                                <h4 className="text-xs font-display font-bold uppercase tracking-widest text-primary/80 mb-2">Suggestions</h4>
                                                                <ul className="space-y-1.5">
                                                                    {(Array.isArray(currentEvaluation.suggestions) ? currentEvaluation.suggestions : [currentEvaluation.suggestions]).map((s, i) => (
                                                                        <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                                                            <ArrowRight size={12} className="text-primary mt-1 shrink-0" />
                                                                            <span>{s}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Next button */}
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={nextQuestion}
                                                            className="flex items-center gap-2 px-7 py-3.5 bg-white text-background-dark hover:scale-[1.03] active:scale-[0.98] rounded-xl transition-all font-display font-bold text-sm uppercase tracking-wider shadow-lg shadow-white/10"
                                                        >
                                                            {currentQuestionIndex + 1 >= totalQ ? 'Complete Evaluation' : 'Next Challenge'}
                                                            <ArrowRight size={16} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* ─── Footer ─── */}
            <footer className="w-full py-4 px-4 lg:px-8 border-t border-glass-border">
                <div className="max-w-[100rem] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-5 text-slate-600 text-[10px] font-display font-medium uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent animate-pulse"></span>
                            Analysis Online
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            Neural Core v2.4
                        </span>
                    </div>
                    <span className="text-slate-700 text-[10px] font-display uppercase tracking-[0.2em]">
                        Session {id?.slice(-6) || '------'}
                    </span>
                </div>
            </footer>

            {/* Ambient glow */}
            <div className="fixed bottom-0 left-0 w-full h-[25vh] bg-gradient-to-t from-primary/3 to-transparent pointer-events-none"></div>
        </div>
    );
};

// ─── Feedback Card Component ───
const FeedbackCard = ({ title, color, icon, message }) => {
    const colorMap = {
        emerald: { border: 'border-emerald-accent/40', text: 'text-emerald-accent', bg: 'bg-emerald-accent/5' },
        amber: { border: 'border-amber-accent/40', text: 'text-amber-accent', bg: 'bg-amber-accent/5' },
        rose: { border: 'border-rose-accent/40', text: 'text-rose-accent', bg: 'bg-rose-accent/5' },
    };
    const colors = colorMap[color] || colorMap.emerald;

    const getIcon = () => {
        const iconClass = `${colors.text}`;
        switch (icon) {
            case 'check_circle': return <CheckCircle className={iconClass} size={18} />;
            case 'bolt': return <Zap className={iconClass} size={18} />;
            case 'speed': return <Clock className={iconClass} size={18} />;
            case 'error': return <AlertCircle className={iconClass} size={18} />;
            default: return <CheckCircle className={iconClass} size={18} />;
        }
    };

    // Handle array messages (strengths/weaknesses come as arrays from the API)
    const displayMessage = Array.isArray(message)
        ? message.join(' · ')
        : message;

    return (
        <div className={`glass border-l-4 ${colors.border} ${colors.bg} p-4 rounded-xl flex flex-col gap-2.5 min-h-[100px]`}>
            <div className="flex items-center justify-between">
                <span className={`text-[10px] font-display font-black uppercase tracking-[0.15em] ${colors.text}`}>{title}</span>
                {getIcon()}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">{displayMessage}</p>
        </div>
    );
};

export default InterviewSession;