// models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  allocated: {
    type: Number,
    required: true
  },
  spent: {
    type: Number,
    default: 0
  },
  remaining: {
    type: Number,
    required: true
  },
  icon: String, // optional
  color: String, // optional
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Category', CategorySchema);
