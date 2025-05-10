const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const friendController = require('../controllers/friendController');
const auth = require('../middleware/auth');

// Get all friends for the current user
router.get('/', auth, friendController.getFriends);

// Add a new friend
router.post('/', [
  auth,
  check('email', 'Please provide a valid email address').isEmail()
], friendController.addFriend);

// Remove a friend
router.delete('/:friendId', auth, friendController.deleteFriend);

// Get friends who owe money to the current user
router.get('/debts/owe', auth, friendController.getFriendsWhoOwe);

// Get friends who are owed money by the current user
router.get('/debts/owed', auth, friendController.getFriendsUserOwes);

// Get the total balance (sum of amounts owed or to be paid)
router.get('/balance', auth, friendController.getTotalBalance);

// Update friend balance (this might be used for transactions between friends)
router.put('/:friendId/balance', [
  auth,
  check('owes', 'Owes must be a number').isNumeric(),
  check('isOwed', 'IsOwed must be a number').isNumeric()
], friendController.updateFriendBalance);

// Record settlement of debts
router.post('/:friendId/settle', [
  auth,
  check('amount', 'Settlement amount must be a number').isNumeric(),
  check('settleType', 'Settle type is required and must be one of ["theyPaidMe", "iPaidThem"]').isIn(['theyPaidMe', 'iPaidThem'])
], friendController.recordSettlement);

module.exports = router;
