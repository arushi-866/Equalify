const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    // Make this optional for non-group expenses
    required: false,
    default: null
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  
  },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      amount: { type: Number, required: true },
    }
  ],
  
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    default: 'other'
  },
  notes: {
    type: String,
    default: ''
  },
  settled: {
    type: Boolean,
    default: false
  },
  settledAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);