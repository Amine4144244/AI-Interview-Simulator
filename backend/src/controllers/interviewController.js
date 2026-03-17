const Interview = require('../models/Interview');
const axios = require('axios');

exports.createInterview = async (req, res, next) => {
    try {
        const { role, difficulty, totalQuestions } = req.body;
        const user = req.user.id;

        // Check for existing in-progress interview
        const existingInterview = await Interview.findOne({ user, status: 'in_progress' });
        if (existingInterview) {
            return res.status(200).json({ success: true, interview: existingInterview });
        }

        const interview = await Interview.create({
            user,
            role,
            difficulty,
            totalQuestions: totalQuestions || 5,
            questions: [],
            answers: [],
            status: 'in_progress',
        });

        res.status(201).json({ success: true, interview: interview });
    } catch (error) {
        next(error);
    }
};

exports.getInterviews = async (req, res, next) => {
    try {
        const query = { user: req.user.id };
        if (req.query.status) {
            query.status = req.query.status;
        }
        const interviews = await Interview.find(query);
        res.status(200).json({ success: true, interviews: interviews });
    } catch (error) {
        next(error);
    }
};

exports.getInterviewById = async (req, res, next) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ success: false, error: 'Interview not found' });
        }

        // Ensure user is authorized to view this interview
        if (interview.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        res.status(200).json({ success: true, interview: interview });
    } catch (error) {
        next(error);
    }
};

exports.submitAnswer = async (req, res, next) => {
    try {
        const { question, answer, evaluation } = req.body;
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ success: false, error: 'Interview not found' });
        }

        // Ensure user is authorized to submit to this interview
        if (interview.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }
        
        // Ensure questions and answers arrays exist
        if (!interview.questions) {
            interview.questions = [];
        }
        if (!interview.answers) {
            interview.answers = [];
        }

        // Add answer to the answers array (structured as AnswerSchema)
        // The question is already in the interview.questions array, so we add to the next index
        interview.answers.push({
            questionIndex: interview.answers.length, // Next available index
            answerText: answer,
            feedback: evaluation // Store the evaluation in the feedback field
        });

        await interview.save();

        res.status(200).json({ success: true, interview });
    } catch (error) {
        next(error);
    }
};

exports.completeInterview = async (req, res, next) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ success: false, error: 'Interview not found' });
        }

        // Ensure user is authorized to complete this interview
        if (interview.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        const { finalScore, summary, recommendedTopics } = req.body;

        interview.finalScore = finalScore;
        interview.finalReport = { summary, recommendedTopics };
        interview.status = 'completed';

        await interview.save();

        res.status(200).json({ success: true, interview });
    } catch (error) {
        next(error);
    }
};

exports.proxyToAI = async (req, res, next) => {
    const aiAgentUrl = process.env.AI_AGENT_URL;
    const internalApiKey = process.env.INTERNAL_API_KEY;
    
    try {
        // Handle different request paths depending on where the request came from
        let requestPath;
        if (req.path.startsWith('/api/ai')) {
            // For requests coming directly from /api/ai/* routes
            requestPath = req.path.replace('/api/ai', '');
        } else {
            // For requests coming from /api/interviews/* routes
            requestPath = req.path.replace('/interviews', '');
        }
        
        if (!aiAgentUrl) {
            return res.status(500).json({ success: false, error: 'AI Agent URL not configured' });
        }

        console.log(`Forwarding request to: ${aiAgentUrl}${requestPath}`);
        console.log(`Request body:`, req.body);
        console.log(`Internal API key:`, internalApiKey);
        
        const response = await axios.post(`${aiAgentUrl}${requestPath}`, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'x-internal-api-key': internalApiKey,
            },
            timeout: 30000, // 30 second timeout
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        // Log the full error for debugging
        console.error('AI Proxy Error Details:');
        console.error('Request path:', req.path);
        console.error('Request body:', req.body);
        console.error('AI Agent URL:', aiAgentUrl);
        console.error('Error message:', error.message);
        console.error('Error response:', error.response ? error.response.data : 'No response data');
        console.error('Error code:', error.code);

        // Forward a sanitized error to the client
        const status = error.response ? error.response.status : 500;
        let message = error.response ? error.response.data?.error || error.response.data : error.message || 'An unexpected error occurred with the AI service.';
        
        // Ensure message is a string for the frontend (fix React Error #31)
        if (typeof message === 'object') {
            message = message.message || JSON.stringify(message);
        }
        
        res.status(status).json({ success: false, error: message });
    }
};

exports.deleteInterview = async (req, res, next) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ success: false, error: 'Interview not found' });
        }

        // Ensure user is authorized to delete this interview
        if (interview.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await Interview.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
