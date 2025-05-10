const Friend = require('../models/Friend');
const User = require('../models/User');

// Get all friends for a user
exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const friends = await Friend.find({ user: userId })
      .populate('friendUser', 'name email'); // Populate friend details

    res.status(200).json({
      success: true,
      data: friends
    });
  } catch (error) {
    console.error('Error getting friends:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Add a new friend
exports.addFriend = async (req, res) => {
  try {
    const { email, name } = req.body;
    const userId = req.user.id;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    // Check if the friend exists in the system
    let friendUser = await User.findOne({ email });
    let friendId = null;

    if (friendUser) {
      friendId = friendUser._id;

      // Check if they are already friends
      const existingFriend = await Friend.findOne({
        user: userId,
        friendUser: friendId
      });

      if (existingFriend) {
        return res.status(400).json({
          success: false,
          message: 'Friend already added'
        });
      }
    }

    // Create friend record
    const friend = await Friend.create({
      user: userId,
      friendUser: friendId,
      name: friendUser ? friendUser.name : name,
      email,
      owes: 0,
      isOwed: 0
    });

    res.status(201).json({
      success: true,
      data: friend
    });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get total balance across all friends
exports.getTotalBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await Friend.find({ user: userId });

    let totalOwes = 0;
    let totalIsOwed = 0;

    friends.forEach(friend => {
      totalOwes += friend.owes || 0;
      totalIsOwed += friend.isOwed || 0;
    });

    res.status(200).json({
      success: true,
      data: {
        totalOwes,
        totalIsOwed,
        netBalance: totalIsOwed - totalOwes
      }
    });
  } catch (error) {
    console.error('Error getting total balance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// Update friend balance
exports.updateFriendBalance = async (req, res) => {
  try {
    const { friendId } = req.params; // Friend's ID passed in the URL
    const { owes, isOwed } = req.body; // The balance amounts to update
    const userId = req.user.id; // The logged-in user's ID from authentication

    // Ensure both owes and isOwed are provided in the body
    if (owes === undefined || isOwed === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Both "owes" and "isOwed" amounts are required'
      });
    }

    // Find the friend by ID
    const friend = await Friend.findById(friendId);
    
    // Check if the friend exists
    if (!friend) {
      return res.status(404).json({
        success: false,
        message: 'Friend not found'
      });
    }

    // Check if the friend belongs to the current user
    if (friend.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this friend'
      });
    }

    // Update the friend balance (owes and isOwed)
    friend.owes = owes;
    friend.isOwed = isOwed;

    // Save the updated friend record
    const updatedFriend = await friend.save();

    // Return the updated friend data
    res.status(200).json({
      success: true,
      data: updatedFriend
    });
  } catch (error) {
    console.error('Error updating friend balance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete a friend
exports.deleteFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;

    const friend = await Friend.findById(friendId);

    if (!friend) {
      return res.status(404).json({
        success: false,
        message: 'Friend not found'
      });
    }

    if (friend.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this friend'
      });
    }

    await friend.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting friend:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get friends who owe the user
exports.getFriendsWhoOwe = async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await Friend.find({
      user: userId,
      owes: { $gt: 0 }
    }).populate('friendUser', 'name email');

    res.status(200).json({
      success: true,
      data: friends
    });
  } catch (error) {
    console.error('Error getting friends who owe:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get friends the user owes
exports.getFriendsUserOwes = async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await Friend.find({
      user: userId,
      isOwed: { $gt: 0 }
    }).populate('friendUser', 'name email');

    res.status(200).json({
      success: true,
      data: friends
    });
  } catch (error) {
    console.error('Error getting friends user owes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Record a settled payment
exports.recordSettlement = async (req, res) => {
  try {
    const { friendId } = req.params;
    const { amount, settleType } = req.body;
    const userId = req.user.id;

    if (!amount || !settleType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide amount and settlement type'
      });
    }

    const friend = await Friend.findById(friendId);

    if (!friend) {
      return res.status(404).json({
        success: false,
        message: 'Friend not found'
      });
    }

    if (friend.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to settle with this friend'
      });
    }

    let updatedFriend;

    if (settleType === 'theyPaidMe') {
      if (amount > friend.owes) {
        return res.status(400).json({
          success: false,
          message: 'Settlement amount exceeds debt'
        });
      }

      updatedFriend = await Friend.findByIdAndUpdate(
        friendId,
        { owes: friend.owes - amount },
        { new: true }
      );
    } else if (settleType === 'iPaidThem') {
      if (amount > friend.isOwed) {
        return res.status(400).json({
          success: false,
          message: 'Settlement amount exceeds debt'
        });
      }

      updatedFriend = await Friend.findByIdAndUpdate(
        friendId,
        { isOwed: friend.isOwed - amount },
        { new: true }
      );
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid settlement type'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedFriend
    });
  } catch (error) {
    console.error('Error recording settlement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
