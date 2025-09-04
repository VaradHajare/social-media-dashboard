// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({ 
    message: 'Social Media Dashboard API',
    status: 'Server is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts'
    }
  });
});

app.get('/health', (req, res) => {
  console.log('Health route accessed');
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 404 handler - Must be LAST
app.use((req, res) => {
  console.log('404 handler triggered for:', req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error middleware triggered:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`✅ Server started successfully`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  / - API info`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /api/auth/register - User registration`);
  console.log(`   POST /api/auth/login - User login`);
  console.log(`   GET  /api/auth/me - Get current user`);
  console.log(`   GET  /api/posts - Get all posts`);
  console.log(`   POST /api/posts - Create new post`);
  console.log(`   GET  /api/posts/:id - Get single post`);
  console.log(`   PUT  /api/posts/:id - Update post`);
  console.log(`   DELETE /api/posts/:id - Delete post`);
});
