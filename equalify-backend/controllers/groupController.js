const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Notification = require('../models/Notification');

// Create group
exports.createGroup = async (req, res) => {
  try {
    console.log('Received create group request:', req.body); // Debug log

    const { name, description, members } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required'
      });
    }

    // Create group with provided data
    const group = new Group({
      name,
      description: description || '',
      members: members || [],
      createdAt: new Date(),
      totalExpenses: 0
    });

    console.log('Saving group:', group); // Debug log

    const savedGroup = await group.save();
    console.log('Group saved successfully:', savedGroup); // Debug log

    res.status(201).json({
      success: true,
      data: savedGroup
    });

  } catch (error) {
    console.error('Group creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating group',
      error: error.message
    });
  }
};

// Get all groups for a user
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      'members.user': req.user.id
    })
    .populate('members.user', 'name email')
    .sort({ lastActivity: -1 });
    
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get group by ID
exports.getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('members.user', 'name email')
      .populate('creator', 'name email');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is a member of the group
    const isMember = group.members.some(member => 
      member.user._id.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(500).send('Server error');
  }
};

// Update group
exports.updateGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const group = await Group.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is admin of the group
    const isAdmin = group.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    group.name = name || group.name;
    group.description = description || group.description;
    group.lastActivity = Date.now();
    
    await group.save();
    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(500).send('Server error');
  }
};

// Add member to group
exports.addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    const group = await Group.findById(req.params.groupId);
    const user = await User.findById(userId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is admin of the group
    const isAdmin = group.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Check if user is already a member
    if (group.members.some(member => member.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }
    
    group.members.push({ user: userId, role: role || 'member' });
    group.lastActivity = Date.now();
    
    await group.save();
    
    // Create notification for the added user
    await new Notification({
      recipient: userId,
      sender: req.user.id,
      type: 'group_invite',
      text: `You've been added to group "${group.name}"`,
      relatedResource: {
        resourceType: 'group',
        resourceId: group._id
      }
    }).save();
    
    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Group or user not found' });
    }
    res.status(500).send('Server error');
  }
};

// Remove member from group
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const group = await Group.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is admin of the group or removing themselves
    const isAdmin = group.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    const isSelf = userId === req.user.id;
    
    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Check if user is the only admin
    if (
      userId === req.user.id &&
      group.members.filter(member => member.role === 'admin').length === 1 &&
      group.members.some(member => 
        member.user.toString() === req.user.id && member.role === 'admin'
      )
    ) {
      return res.status(400).json({ message: 'Cannot leave group as the only admin' });
    }
    
    // Remove the member
    group.members = group.members.filter(member => member.user.toString() !== userId);
    group.lastActivity = Date.now();
    
    await group.save();
    res.json({ message: 'Member removed from group' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Group or user not found' });
    }
    res.status(500).send('Server error');
  }
};

// Delete group
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is admin of the group
    const isAdmin = group.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete all expenses associated with the group
    await Expense.deleteMany({ group: req.params.groupId });
    
    // Delete the group
    await group.remove();
    
    res.json({ message: 'Group deleted' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(500).send('Server error');
  }
};
