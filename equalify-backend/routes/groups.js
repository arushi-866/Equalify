const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const groupController = require('../controllers/groupController');
const auth = require('../middleware/auth');

// Get all groups for the current user
router.get('/', auth, groupController.getGroups);

// Get specific group details
router.get('/:groupId', auth, groupController.getGroupDetails);

// Create new group - no auth middleware
router.post('/', [
  check('name').not().isEmpty(),
  check('members').optional().isArray()  // Members should be optional, it is added later
], groupController.createGroup);

// Update group
router.put('/:groupId', [
  auth,
  check('name').not().isEmpty()
], groupController.updateGroup);

// Delete group
router.delete('/:groupId', auth, groupController.deleteGroup);

// Add members to group
router.post('/:groupId/members', [
  auth,
  check('members').isArray()
], groupController.addMember);

// Remove member from group
router.delete('/:groupId/members/:userId', auth, groupController.removeMember);

module.exports = router;
