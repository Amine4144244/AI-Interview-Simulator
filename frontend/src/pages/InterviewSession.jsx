import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import AnswerInput from '../components/AnswerInput';
import FeedbackPanel from '../components/FeedbackPanel';
import ProgressIndicator from '../components/ProgressIndicator';

const InterviewSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [interview, setInterview] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
    const [currentEvaluation, setCurrentEvaluation] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [error, setError] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

                    if (interviewData.isCompleted) {
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

        initInterview();
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
        } catch (err) {
            setError('Neural network timeout');
            console.error(err);
        } finally {
            setIsGeneratingQuestion(false);
        }
    };

    const submitAnswer = async (answer) => {
        if (!interview) return;

        setIsSubmittingAnswer(true);
        try {
            const evaluationResponse = await api.post('/ai/evaluate-answer', {
                question: currentQuestion,
                answer,
                role: interview.role,
                difficulty: interview.difficulty
            });

            const evaluation = evaluationResponse.data;
            setCurrentEvaluation(evaluation);

            await api.post(`/interviews/${interview._id}/answer`, {
                question: currentQuestion,
                answer,
                evaluation
            });

            setInterview(prev => ({
                ...prev,
                questions: [...(prev.questions || []), currentQuestion],
                answers: [...(prev.answers || []), answer],
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

        setShowFeedback(false);
        setCurrentEvaluation(null);

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-950">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-primary-500 font-black tracking-widest uppercase text-xs">Syncing Neural Core...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
                <div className="glass-card p-10 rounded-[3rem] border-red-500/20 text-center max-w-md">
                    <h2 className="text-2xl font-black text-red-500 mb-4 tracking-tight">System Interrupted</h2>
                    <p className="text-slate-400 font-bold mb-8 leading-relaxed">{error}</p>
                    <button onClick={() => window.location.reload()} className="glass-button px-10 py-4 rounded-2xl font-black">Reload System</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col max-w-6xl mx-auto px-4 pb-20">
            {/* Immersive Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black font-display text-slate-900 dark:text-white mb-2">
                        {interview?.role} <span className="premium-gradient-text">Simulation</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">{interview?.difficulty} Level Activity</span>
                    </div>
                </div>

                <div className="glass-card px-8 py-4 rounded-[2rem] flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</div>
                        <div className="text-xl font-black text-slate-900 dark:text-white font-display">{currentQuestionIndex + 1} / {interview?.totalQuestions || 5}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-primary-500/20 flex items-center justify-center p-1">
                        <div className="w-full h-full rounded-full border-2 border-primary-500 border-t-transparent animate-spin-slow"></div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-1 gap-8 flex-grow">
                {isGeneratingQuestion ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card rounded-[3rem] p-20 text-center flex flex-col items-center justify-center min-h-[400px]"
                    >
                        <div className="relative mb-10 text-primary-500">
                            <div className="absolute inset-0 blur-[40px] opacity-20">AI</div>
                            <svg className="w-20 h-20 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white mb-2">Generating Simulation</h2>
                        <p className="text-slate-500 font-bold max-w-xs leading-relaxed uppercase tracking-tighter text-sm">Consulting collective intelligence...</p>
                    </motion.div>
                ) : (
                    <div className="space-y-8 h-full flex flex-col">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-grow flex flex-col"
                        >
                            <QuestionCard
                                question={currentQuestion}
                                questionNumber={currentQuestionIndex + 1}
                                totalQuestions={interview?.totalQuestions || 5}
                            />

                            {!showFeedback ? (
                                <AnswerInput onSubmit={submitAnswer} isSubmitting={isSubmittingAnswer} />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-8"
                                >
                                    <FeedbackPanel evaluation={currentEvaluation} isVisible={showFeedback} />

                                    <div className="flex justify-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(51 80 255 / 0.2)" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={nextQuestion}
                                            className="px-12 py-5 bg-primary-600 text-white rounded-[2rem] text-xl font-black shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all flex items-center gap-4"
                                        >
                                            {currentQuestionIndex + 1 >= (interview?.totalQuestions || 5) ? 'Finalize Artifact' : 'Initiate Next Phase'}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-primary-500/5 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
};

export default InterviewSession;