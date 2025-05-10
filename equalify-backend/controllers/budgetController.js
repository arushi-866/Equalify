

const Budget = require('../models/Budget');
const Category = require('../models/Category');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all budget categories for a user
exports.getBudgetCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const categories = await Category.find({ user: userId });
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error getting budget categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// Create a new budget category
exports.createBudgetCategory = async (req, res) => {
  try {
    const { name, allocated } = req.body;
    const userId = req.user.id;
    
    if (!name || !allocated) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and allocated amount'
      });
    }
    
    const category = await Category.create({
      name,
      allocated,
      spent: 0,
      remaining: allocated,
      user: userId
    });
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error creating budget category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update a budget category
exports.updateBudgetCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, allocated } = req.body;
    const userId = req.user.id;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if the category belongs to the user
    if (category.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this category'
      });
    }
    
    // Calculate new remaining amount
    const remaining = allocated - category.spent;
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, allocated, remaining },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating budget category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete a budget category
exports.deleteBudgetCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if the category belongs to the user
    if (category.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this category'
      });
    }
    
    await category.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting budget category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Record expense to a budget category
exports.recordExpense = async (req, res) => {
  try {
    const { categoryId, amount, description, date } = req.body;
    const userId = req.user.id;
    
    if (!categoryId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category ID and amount'
      });
    }
    
    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if the category belongs to the user
    if (category.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to record expense to this category'
      });
    }
    
    // Create a new expense record
    const expense = await Budget.create({
      category: categoryId,
      amount,
      description: description || 'Expense',
      date: date || Date.now(),
      user: userId
    });
    
    // Update the category spent and remaining amounts
    const newSpent = category.spent + amount;
    const newRemaining = category.allocated - newSpent;
    
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { spent: newSpent, remaining: newRemaining },
      { new: true }
    );
    
    res.status(201).json({
      success: true,
      data: {
        expense,
        category: updatedCategory
      }
    });
  } catch (error) {
    console.error('Error recording expense:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get monthly spending summary
exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get the current year
    const currentYear = new Date().getFullYear();
    
    // Aggregate monthly spending
    const monthlySummary = await Budget.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$date" },
          amount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          amount: 1
        }
      },
      {
        $sort: { month: 1 }
      }
    ]);
    
    // Map month numbers to month names
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const formattedSummary = monthlySummary.map(item => ({
      month: monthNames[item.month - 1],
      amount: item.amount
    }));
    
    res.status(200).json({
      success: true,
      data: formattedSummary
    });
  } catch (error) {
    console.error('Error getting monthly summary:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};