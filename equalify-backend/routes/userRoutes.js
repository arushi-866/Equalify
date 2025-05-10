



const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/User');

// GET profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Format the response to match what frontend expects
    res.json({
      _id: user._id, // Added _id field which is needed by frontend
      name: user.name,
      email: user.email,
      phoneNumber: user.phone || '',
      country: user.country || 'IN',
      defaultCurrency: user.defaultCurrency || 'INR'
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phoneNumber, country, defaultCurrency } = req.body;

    const updatedFields = {
      name,
      phone: phoneNumber, // Mapping frontend phoneNumber to database phone
      country,
      defaultCurrency
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updatedFields,
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    // Include _id in response to match frontend expectations
    res.json({
      _id: updatedUser._id,
      name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phone || '',
      country,
      defaultCurrency
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.lastPasswordChange = Date.now();
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE profile
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.clearCookie('token');
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET sessions
router.get('/sessions', authenticateToken, (req, res) => {
  try {
    const sessions = [
      {
        id: '1',
        device: 'Chrome on Windows',
        location: 'Mumbai, India',
        ip: '192.168.1.1',
        lastActive: new Date()
      },
      {
        id: '2',
        device: 'Safari on iPhone',
        location: 'Bangalore, India',
        ip: '192.168.1.2',
        lastActive: new Date(Date.now() - 86400000)
      }
    ];

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;