const Expense = require('../models/Expense');
const Group = require('../models/Group');
const User = require('../models/User'); // Make sure User model is imported

// Get all expenses for a specific group
exports.getExpensesByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const isMember = group.members.some(member =>
      member.user.toString() === req.user.id
    );
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this group\'s expenses' });
    }

    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email')
      .sort({ date: -1 });

    res.json({ success: true, data: expenses });
  } catch (error) {
    console.error('Error fetching group expenses:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create a new expense for a group
exports.createExpense = async (req, res) => {
  try {
    console.log('Received expense creation request:', req.body);
    const { title, description, amount, group, paidBy, participants, splits, date, category, notes } = req.body;

    // Enhanced validation
    if (!amount || isNaN(Number(amount))) {
      console.log('Invalid amount:', amount);
      return res.status(400).json({ 
        success: false, 
        message: 'Valid amount is required' 
      });
    }

    if (!paidBy) {
      console.log('Missing paidBy field');
      return res.status(400).json({ 
        success: false, 
        message: 'PaidBy field is required' 
      });
    }

    // Validate group membership if group is specified
    if (group) {
      const groupDoc = await Group.findById(group);
      if (!groupDoc) {
        console.log('Group not found:', group);
        return res.status(404).json({
          success: false,
          message: 'Group not found'
        });
      }

      const isMember = groupDoc.members.some(member => 
        member.user.toString() === req.user.id
      );
      
      if (!isMember) {
        console.log('User not authorized for group:', req.user.id);
        return res.status(403).json({
          success: false,
          message: 'Not authorized to create expense in this group'
        });
      }
    }

    // Handle participants data with validation
    let participantsArray = [];
    if (Array.isArray(splits)) {
      participantsArray = splits.map(split => {
        if (!split.user || !split.amount) {
          throw new Error('Invalid split data: user and amount required');
        }
        return {
          user: split.user,
          amount: Number(split.amount),
          settled: false
        };
      });
    } else if (Array.isArray(participants)) {
      participantsArray = participants.map(participant => {
        if (!participant.user) {
          throw new Error('Invalid participant data: user required');
        }
        return {
          user: participant.user,
          amount: Number(participant.amount) || 0,
          settled: false
        };
      });
    }

    // Validate total split amount matches expense amount
    const totalSplit = participantsArray.reduce((sum, p) => sum + p.amount, 0);
    if (Math.abs(totalSplit - Number(amount)) > 0.01) { // Allow small floating point differences
      console.log('Split amount mismatch:', { total: totalSplit, amount: Number(amount) });
      return res.status(400).json({
        success: false,
        message: 'Total split amount must equal expense amount'
      });
    }

    // Handle description/title
    const expenseDescription = description || title || 'Untitled Expense';

    // Validate that there are participants
    if (participantsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one participant is required'
      });
    }

    const expense = new Expense({
      description: expenseDescription,
      amount: Number(amount),
      group: group || null,
      paidBy,
      participants: participantsArray,
      date: date || Date.now(),
      category: category || 'other',
      notes: notes || '',
      createdBy: req.user.id
    });

    const savedExpense = await expense.save();

    // Update group if expense belongs to a group
    if (group) {
      const groupDoc = await Group.findById(group);
      if (groupDoc) {
        groupDoc.totalExpenses = (groupDoc.totalExpenses || 0) + Number(amount);
        groupDoc.lastActivity = Date.now();
        await groupDoc.save();
      }
    }

    // Populate user details
    await savedExpense.populate('paidBy', 'name email');
    await savedExpense.populate('participants.user', 'name email');

    console.log('Expense created successfully:', savedExpense._id);
    return res.status(201).json({
      success: true,
      data: {
        _id: savedExpense._id,
        title: savedExpense.description,
        amount: savedExpense.amount,
        date: savedExpense.date,
        paidBy: savedExpense.paidBy,
        participants: savedExpense.participants,
        category: savedExpense.category,
        notes: savedExpense.notes
      }
    });

  } catch (error) {
    console.error('Detailed error in expense creation:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create expense', 
      error: error.message 
    });
  }
};

// Mark expense as settled
exports.settleExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const isInvolved =
      expense.paidBy.toString() === req.user.id ||
      expense.participants.some(participant => participant.user.toString() === req.user.id);

    if (!isInvolved) {
      return res.status(403).json({ success: false, message: 'Not authorized to mark this expense as settled' });
    }

    expense.settled = true;
    expense.settledAt = Date.now();
    await expense.save();

    res.json({ success: true, data: expense });
  } catch (error) {
    console.error('Error settling expense:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get recent expenses of the logged-in user
exports.getRecentExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ 
      $or: [
        { paidBy: req.user.id },
        { 'participants.user': req.user.id }
      ]
    })
    .sort({ date: -1 })
    .limit(10)
    .populate('paidBy', 'name email')
    .populate('participants.user', 'name email');

    res.json({ success: true, data: expenses });
  } catch (error) {
    console.error('Error fetching recent expenses:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get expense splits for the logged-in user
exports.getExpenseSplits = async (req, res) => {
  try {
    const expenses = await Expense.find({
      'participants.user': req.user.id
    });

    let totalOwed = 0;
    let totalPaid = 0;

    for (const exp of expenses) {
      const share = exp.participants.find(p => p.user.toString() === req.user.id);
      if (share) {
        totalOwed += share.amount;
      }
      if (exp.paidBy.toString() === req.user.id) {
        totalPaid += exp.amount;
      }
    }

    res.json({
      success: true,
      data: {
        totalPaid,
        totalOwed,
        net: totalPaid - totalOwed
      }
    });
  } catch (error) {
    console.error('Error calculating splits:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get monthly spending summary for the logged-in user
exports.getMonthlySpending = async (req, res) => {
  try {
    const expenses = await Expense.find({
      $or: [
        { paidBy: req.user.id },
        { 'participants.user': req.user.id }
      ]
    });

    const monthly = {};

    expenses.forEach(exp => {
      const month = new Date(exp.date).toISOString().slice(0, 7); // "YYYY-MM"
      if (!monthly[month]) monthly[month] = 0;

      if (exp.paidBy.toString() === req.user.id) {
        monthly[month] += exp.amount;
      }
    });

    res.json({ success: true, data: monthly });
  } catch (error) {
    console.error('Error getting monthly spending:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Check if expense belongs to a group
    if (expense.group) {
      const group = await Group.findById(expense.group);
      if (group) {
        const isAdmin = group.members.some(member =>
          member.user.toString() === req.user.id && member.role === 'admin'
        );

        if (expense.createdBy.toString() !== req.user.id && !isAdmin) {
          return res.status(403).json({ success: false, message: 'Not authorized to delete this expense' });
        }

        group.totalExpenses -= expense.amount;
        if (group.totalExpenses < 0) group.totalExpenses = 0;
        await group.save();
      }
    } else {
      // For non-group expenses, only creator can delete
      if (expense.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this expense' });
      }
    }

    await Expense.findByIdAndDelete(expenseId);

    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
