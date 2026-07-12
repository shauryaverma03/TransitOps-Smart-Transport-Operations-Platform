const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const LOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const MAX_FAILED_ATTEMPTS = 5;

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.', locked: false });
    }

    // Check account lock
    if (user.isLocked()) {
      const remainingMs = user.lockedUntil - new Date();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return res.status(423).json({
        message: `Account locked. Try again in ${remainingMin} minute(s).`,
        locked: true,
        lockedUntil: user.lockedUntil
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.failedAttempts = (user.failedAttempts || 0) + 1;
      if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
        await user.save();
        return res.status(423).json({
          message: 'Account locked after 5 failed attempts. Try again in 30 minutes.',
          locked: true,
          lockedUntil: user.lockedUntil
        });
      }
      await user.save();
      return res.status(401).json({
        message: 'Invalid credentials.',
        locked: false,
        attemptsRemaining: MAX_FAILED_ATTEMPTS - user.failedAttempts
      });
    }

    // Verify role matches (user must select their actual role)
    if (user.role !== role) {
      return res.status(401).json({
        message: 'Selected role does not match account role.',
        locked: false
      });
    }

    // Reset failed attempts on success
    user.failedAttempts = 0;
    user.lockedUntil = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
};

module.exports = { login, getMe };
