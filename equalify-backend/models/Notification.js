const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['expense_added', 'friend_request', 'payment_reminder', 'group_invite', 'expense_settled'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  relatedResource: {
    resourceType: {
      type: String,
      enum: ['expense', 'group', 'user', 'budget']
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
