// MUST be required first, before express/routes are set up. This patches
// Express so that a rejected promise inside any async route handler is
// automatically passed to the error-handling middleware below, instead of
// becoming an "unhandled promise rejection" - which previously triggered
// server.js's unhandledRejection handler and killed + restarted the whole
// process on a single bad request (causing every visitor to see the site
// hang for 10-30+ seconds while the server rebooted and reconnected to
// MongoDB).
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    // Was 100 - too low for a real admin session: with 1000+ documents,
    // just loading the document list now takes several paginated GET
    // requests, on top of categories/products/images/etc. Hitting this
    // ceiling made GET /documents return 429 right after bulk uploads,
    // which the frontend logged silently and looked like old documents
    // had disappeared.
    max: 500,
    message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(compression()); // gzip API/JSON responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Routes
app.use('/api/v1', routes);

// Root route - friendly response instead of a 404 when someone (or an
// uptime pinger) hits the bare domain with no path.
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Mechanical Portfolio API is running',
        health: '/health',
        api: '/api/v1'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.all('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Cannot find ${req.originalUrl} on this server`
    });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;