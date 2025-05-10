// models/Friend.js
const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  friendUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who is the friend
  name: String, // Name of the friend
  email: String, // Email of the friend
  owes: { type: Number, default: 0 }, // Amount user is owed by friend
  isOwed: { type: Number, default: 0 }, // Amount friend owes user
  dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Friend', friendSchema);
