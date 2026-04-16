// routes/auth.js
const express = require('express');
const router = express.Router();

// Mock user storage (temporary - replace with database later)
let users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'hashed_Admin123!',
    firstName: 'Admin',
    lastName: 'User',
    createdAt: new Date('2024-01-01T00:00:00Z')
  }
];

const createMockToken = (userId) => `mock_jwt_token_${userId}_${Date.now()}`;

const getUserFromRequest = (req) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const [, , rawUserId] = token.split('_');
  const userId = Number.parseInt(rawUserId, 10);

  if (Number.isNaN(userId)) {
    return null;
  }

  return users.find((user) => user.id === userId) || null;
};

// Register route
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    
    const { username, email, password, firstName, lastName } = req.body;

    // Basic validation
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Check if user already exists (mock check)
    const existingUser = users.find(user => 
      user.email === email || user.username === username
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Create new user (mock - no real password hashing yet)
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: `hashed_${password}`, // Mock hashing
      firstName,
      lastName,
      createdAt: new Date()
    };

    users.push(newUser);

    // Mock JWT token
    const mockToken = createMockToken(newUser.id);

    res.status(201).json({
      success: true,
      data: {
        token: mockToken,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user (mock check)
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Mock password check (in real app, use bcrypt.compare)
    const isValidPassword = user.password === `hashed_${password}`;
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Mock JWT token
    const mockToken = createMockToken(user.id);

    res.json({
      success: true,
      data: {
        token: mockToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Get current user (mock protected route)
router.get('/me', (req, res) => {
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided'
    });
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }
  });
});

module.exports = router;
