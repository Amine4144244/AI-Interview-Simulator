const express = require('express');
const {
    createInterview,
    getInterviews,
    getInterviewById,
    submitAnswer,
    completeInterview,
    proxyToAI,
    deleteInterview
} = require('../controllers/interviewController');
const auth = require('../middleware/auth');

const router = express.Router();

// Interview routes
router.post('/', auth, createInterview);
router.get('/', auth, getInterviews);
router.get('/:id', auth, getInterviewById);
router.delete('/:id', auth, deleteInterview);
router.post('/:id/answer', auth, submitAnswer);
router.patch('/:id', auth, completeInterview);

// AI agent proxy routes
router.post('/generate-question', proxyToAI);
router.post('/evaluate-answer', proxyToAI);
router.post('/final-report', proxyToAI);

module.exports = router;