const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user using JWT
const authenticateUser = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token is found, return an unauthorized error
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided',
        });
    }

    try {
        // Verify token and attach user to request object (excluding password)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
        });
    }
};

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'Please enter all required fields' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with given email or phone already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, phone, password: hashedPassword });
        await newUser.save();

        // Fix: Use { id: user._id } in the JWT payload
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const { password: _, ...userWithoutPassword } = newUser._doc;

        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required' });
        }

        // Find the user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        try {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Fix: Use { id: user._id } in the JWT payload
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Send response with user data (excluding password)
            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (bcryptError) {
            console.error("Bcrypt comparison error:", bcryptError);
            return res.status(500).json({ error: "Password comparison failed" });
        }
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateUser, (req, res) => {
    res.json(req.user);
});

router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ success: true, user: decoded });
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  });

router.get('/search', authenticateUser, async (req, res) => {
    try {
      const { query } = req.query;
      const currentUser = req.user.id;
  
      // Search for users whose name or email matches the query
      const users = await User.find({
        $and: [
          { _id: { $ne: currentUser } }, // Exclude current user
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { email: { $regex: query, $options: 'i' } }
            ]
          }
        ]
      }).select('name email -_id');
  
      res.json({ users });
    } catch (error) {
      console.error('Search users error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
