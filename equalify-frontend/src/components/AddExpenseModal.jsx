import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function AddExpenseModal({ isOpen, onClose, onAddExpenseSplit }) {
  const [expenseData, setExpenseData] = useState({
    title: '',
    amount: '',
    paidBy: 'single',
    category: 'Other',
    participants: [],
    notes: '',
    currency: 'INR',
    date: new Date().toISOString().split('T')[0],
  });

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFriendSelector, setShowFriendSelector] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const currencies = [
    { code: 'INR', symbol: '₹' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' },
  ];

  const categories = [
    'Food', 
    'Transport', 
    'Entertainment', 
    'Utilities', 
    'Other'
  ];

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
      fetchCurrentUser();
    }
  }, [isOpen]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/friends', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        const fetchedFriends = response.data.data.map(friend => ({
          _id: friend._id,
          name: friend.friendUser?.name || friend.name,
          email: friend.friendUser?.email || friend.email,
        }));
        setFriends(fetchedFriends);
      }
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!expenseData.title || !expenseData.amount || expenseData.participants.length === 0) {
      alert('Please fill all required fields and select at least one participant');
      return;
    }
    
    try {
      setLoading(true);
      
      // Calculate equal split amounts
      const splitAmount = parseFloat(expenseData.amount) / (expenseData.participants.length + 1); // +1 for current user
      
      // Create the API request payload according to your backend structure
      const expensePayload = {
        title: expenseData.title,
        amount: parseFloat(expenseData.amount),
        category: expenseData.category,
        date: new Date(expenseData.date),
        notes: expenseData.notes,
        // paidBy is the current user
        paidBy: currentUser._id,
        // Create splits array based on participants
        splits: expenseData.participants.map(participant => ({
          user: participant._id,
          amount: splitAmount,
          status: 'pending'
        }))
      };
      
      // Add the current group ID if in a group context
      if (expenseData.groupId) {
        expensePayload.group = expenseData.groupId;
      }
      
      // Send the request to your backend
      const response = await axios.post('http://localhost:5000/api/expenses', expensePayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data) {
        // Format the response for the UI
        const uiExpense = {
          id: response.data._id,
          title: response.data.title,
          amount: response.data.amount,
          paidBy: currentUser.name || 'You',
          splitters: expenseData.participants.map(p => p.name),
          status: 'Pending',
          date: response.data.date
        };
        
        // Pass to parent component to update the UI
        onAddExpenseSplit(uiExpense);
        
        // Reset the form
        resetForm();
      }
      
    } catch (err) {
      console.error('Error adding expense:', err);
      alert('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
      // Close the modal in the finally block to ensure it always executes
      onClose();
    }
  };
  const resetForm = () => {
    setExpenseData({
      title: '',
      amount: '',
      paidBy: 'single',
      category: 'Other',
      participants: [],
      notes: '',
      currency: 'INR',
      date: new Date().toISOString().split('T')[0],
    });
    setSearchQuery('');
    setShowFriendSelector(false);
  };

  const toggleParticipant = (friend) => {
    setExpenseData(prev => {
      const isSelected = prev.participants.some(p => p._id === friend._id);
      
      return {
        ...prev,
        participants: isSelected 
          ? prev.participants.filter(p => p._id !== friend._id)
          : [...prev.participants, friend]
      };
    });
  };

  const filteredFriends = friends?.filter(
    (friend) => friend?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFriend = (friendId) => {
    setExpenseData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p._id !== friendId)
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Expense</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expense Title*
                  </label>
                  <input
                    type="text"
                    value={expenseData.title}
                    onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
                    className="input-primary w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter expense title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount*
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={expenseData.currency}
                      onChange={(e) => setExpenseData({ ...expenseData, currency: e.target.value })}
                      className="input-primary w-24 p-3 border border-gray-300 rounded-lg"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={expenseData.amount}
                      onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                      className="input-primary flex-1 p-3 border border-gray-300 rounded-lg"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={expenseData.category}
                    onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
                    className="input-primary w-full p-3 border border-gray-300 rounded-lg"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={expenseData.date}
                    onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
                    className="input-primary w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={expenseData.notes}
                    onChange={(e) => setExpenseData({ ...expenseData, notes: e.target.value })}
                    className="input-primary w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Any additional details..."
                    rows="2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participants* ({expenseData.participants.length} selected)
                </label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {expenseData.participants.map(friend => (
                    <div 
                      key={friend._id}
                      className="bg-primary-100 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <span className="text-primary-700">{friend.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeFriend(friend._id)}
                        className="text-primary-700 hover:text-primary-900"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFriendSelector(!showFriendSelector)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700"
                  >
                    <UserGroupIcon className="h-5 w-5" />
                    <span>{showFriendSelector ? "Hide" : "Select Participants"}</span>
                  </motion.button>
                </div>
                
                {showFriendSelector && (
                  <div className="mb-4 border border-gray-200 rounded-lg p-3">
                    <div className="relative mb-2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Search friends..."
                      />
                    </div>

                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                      </div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
                        {filteredFriends.length === 0 ? (
                          <div className="p-3 text-center text-gray-500">
                            {searchQuery ? 'No friends found' : 'No friends available'}
                          </div>
                        ) : (
                          filteredFriends.map((friend) => (
                            <div
                              key={friend._id}
                              onClick={() => toggleParticipant(friend)}
                              className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                                expenseData.participants.some(p => p._id === friend._id) ? 'bg-primary-50' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={expenseData.participants.some(p => p._id === friend._id)}
                                  onChange={() => toggleParticipant(friend)}
                                  className="h-4 w-4 text-primary-600 rounded"
                                />
                                <div>
                                  <p className="font-medium text-gray-800">{friend.name}</p>
                                  <p className="text-sm text-gray-500">{friend.email}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                disabled={loading || !expenseData.title || !expenseData.amount || expenseData.participants.length === 0}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                    Adding...
                  </div>
                ) : (
                  'Add Expense'
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}