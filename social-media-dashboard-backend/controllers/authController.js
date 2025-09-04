// controllers/authController.js
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');
const config = require('../config/config');

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      const { username, email, password, firstName, lastName } = req.body;
      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }]
        }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email or username already exists'
        });
      }
      // Create new user
      const user = await User.create({
        username,
        email,
        password_hash: password, // Will be hashed by the model hook
        first_name: firstName,
        last_name: lastName
      });
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );
      res.status(201).json({
        success: true,
        data: {
          token,
          user: user.toJSON()
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to register user'
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
      // Update last login
      await user.update({ last_login: new Date() });
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );
      res.json({
        success: true,
        data: {
          token,
          user: user.toJSON()
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to login'
      });
    }
  }

  // Get current user
  static async getMe(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [
          {
            association: 'socialAccounts',
            where: { is_active: true },
            required: false
          }
        ]
      });
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user information'
      });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const { firstName, lastName, bio } = req.body;
      
      await req.user.update({
        first_name: firstName,
        last_name: lastName,
        bio
      });
      res.json({
        success: true,
        data: { user: req.user.toJSON() }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  }
}

module.exports = AuthController;