const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/auth');
const interviewRoutes = require('./src/routes/interviews');
const errorHandler = require('./src/middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(limiter);
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://your-frontend-domain.com'
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);

// Import the proxyToAI function
const { proxyToAI } = require('./src/controllers/interviewController');

// AI proxy routes
app.post('/api/ai/generate-question', proxyToAI);
app.post('/api/ai/evaluate-answer', proxyToAI);
app.post('/api/ai/final-report', proxyToAI);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Only start the server if we're not running in a serverless environment (like Vercel)
        if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error('❌ MongoDB connection error: Could not connect to the database.');
        console.error(`Ensure MongoDB is running and that the MONGODB_URI environment variable is correct.`);
        console.error('Error details:', error.message);
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
};

connectDB();

module.exports = app;