const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    category: String,
});

const AnswerSchema = new mongoose.Schema({
    questionIndex: {
        type: Number,
        required: true,
    },
    answerText: {
        type: String,
        required: true,
    },
    feedback: {
        score: Number,
        strengths: [String],
        weaknesses: [String],
        suggestions: [String],
    },
});

const InterviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'Full-Stack',
    },
    difficulty: {
        type: String,
        required: true,
        default: 'Mid',
    },
    totalQuestions: {
        type: Number,
        default: 5,
    },
    questions: [QuestionSchema],
    answers: [AnswerSchema],
    finalScore: {
        type: Number,
        default: 0,
    },
    finalReport: {
        summary: String,
        recommendedTopics: [String],
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Interview', InterviewSchema);
