import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, UserGroupIcon, MagnifyingGlassIcon, WalletIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function AddExpenseModal({ isOpen, onClose }) {
  const [expenseData, setExpenseData] = useState({
    title: '',
    amount: '',
    paidBy: '',
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
  const [showPaidBySelector, setShowPaidBySelector] = useState(false);

  const currencies = [
    { code: 'INR', symbol: '₹' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' },
  ];

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'];

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
      fetchCurrentUser();
    }
  }, [isOpen]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setCurrentUser(response.data);
      // Set current user as default paidBy
      setExpenseData(prev => ({
        ...prev,
        paidBy: response.data._id
      }));
    } catch (err) {
      console.error('Error fetching current user:', err);
      setCurrentUser({ name: 'You', email: '', _id: 'current-user' });
      setExpenseData(prev => ({
        ...prev,
        paidBy: 'current-user'
      }));
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
  
    if (!expenseData.title || !expenseData.amount || expenseData.participants.length === 0 || !expenseData.paidBy) {
      alert('Please fill all required fields (title, amount, who paid, and participants)');
      return;
    }
  
    try {
      setLoading(true);
  
      const totalAmount = Number(expenseData.amount);
      const splitAmount = totalAmount / expenseData.participants.length;
  
      const participantsSplits = expenseData.participants.map(p => ({
        user: p._id,
        amount: splitAmount,
        settled: false
      }));
  
      const expensePayload = {
        title: expenseData.title,
        description: expenseData.notes || expenseData.title,
        amount: totalAmount,
        paidBy: expenseData.paidBy,
        participants: participantsSplits,
        date: expenseData.date,
        category: expenseData.category.toLowerCase(),
        notes: expenseData.notes,
        currency: expenseData.currency  // <-- Add currency here
      };
  
      console.log('Sending Expense:', expensePayload);
  
      const token = localStorage.getItem('token');
  
      const response = await axios.post('http://localhost:5000/api/expenses', expensePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data && response.data.success) {
        console.log('Expense added successfully:', response.data);
        resetForm();
        onClose();
      }
  
    } catch (err) {
      console.error('Error adding expense:', err.response?.data || err.message);
  
      alert(`Failed to add expense: ${err.response?.data?.message || err.response?.data?.error || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };
  
  
  const resetForm = () => {
    setExpenseData({
      title: '',
      amount: '',
      paidBy: currentUser?._id || '',
      category: 'Other',
      participants: [],
      notes: '',
      currency: 'INR',
      date: new Date().toISOString().split('T')[0],
    });
    setSearchQuery('');
    setShowFriendSelector(false);
    setShowPaidBySelector(false);
  };

  const toggleParticipant = (friend) => {
    // Make sure we have all the required fields for a participant
    const participantToAdd = {
      _id: friend._id,
      user: friend._id, // Add the user field explicitly
      name: friend.name || 'Unknown',
      email: friend.email || ''
    };
    
    setExpenseData(prev => {
      // Check if this participant is already selected
      const isSelected = prev.participants.some(p => p._id === friend._id);
      
      // If already selected, remove them, otherwise add them
      if (isSelected) {
        return {
          ...prev,
          participants: prev.participants.filter(p => p._id !== friend._id)
        };
      } else {
        return {
          ...prev,
          participants: [...prev.participants, participantToAdd]
        };
      }
    });
  };

  const setPaidBy = (user) => {
    setExpenseData(prev => ({
      ...prev,
      paidBy: user._id
    }));
    setShowPaidBySelector(false);
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

  // Get the name of who paid
  const getPaidByName = () => {
    if (!expenseData.paidBy) return 'Select who paid';
    if (currentUser && expenseData.paidBy === currentUser._id) return currentUser.name || 'You';
    
    const payer = friends.find(f => f._id === expenseData.paidBy);
    return payer ? payer.name : 'Select who paid';
  };

  // Get available payers (current user + all friends)
  const getAvailablePayers = () => {
    const allPayers = currentUser ? [currentUser, ...friends] : [...friends];
    // Remove duplicates by ID
    return allPayers.filter((payer, index, self) => 
      index === self.findIndex(p => p._id === payer._id)
    );
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

              {/* Who paid section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who Paid?*
                </label>
                <button
                  type="button"
                  onClick={() => setShowPaidBySelector(!showPaidBySelector)}
                  className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg w-full hover:bg-gray-200"
                >
                  <WalletIcon className="h-5 w-5 text-gray-600" />
                  <span>{getPaidByName()}</span>
                </button>

                {showPaidBySelector && (
                  <div className="mt-4 max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                    {getAvailablePayers().map(user => (
                      <div 
                        key={user._id} 
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${expenseData.paidBy === user._id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                        onClick={() => setPaidBy(user)}
                      >
                        <div>
                          <p className="font-medium">{user.name || 'You'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        {expenseData.paidBy === user._id && (
                          <span className="text-blue-600 text-sm font-medium">Selected</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Participants section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participants* ({expenseData.participants.length} selected)
                </label>

                <button
                  type="button"
                  onClick={() => setShowFriendSelector(!showFriendSelector)}
                  className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg w-full hover:bg-gray-200"
                >
                  <UserGroupIcon className="h-5 w-5 text-gray-600" />
                  <span>Select Friends</span>
                </button>

                {showFriendSelector && (
                  <div className="mt-4 space-y-4">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-primary w-full pl-10 p-3 border border-gray-300 rounded-lg"
                        placeholder="Search friends..."
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filteredFriends.map(friend => (
                        <div key={friend._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{friend.name}</p>
                            <p className="text-sm text-gray-500">{friend.email}</p>
                          </div>
                          <motion.button
                            type="button" // Ensure it's a button of type "button" to prevent form submission
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleParticipant(friend)}
                            className="text-blue-500 hover:underline"
                          >
                            {expenseData.participants.some(p => p._id === friend._id) ? 'Remove' : 'Add'}
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Also add current user as potential participant */}
                {showFriendSelector && currentUser && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{currentUser.name || 'You'}</p>
                        <p className="text-sm text-gray-500">{currentUser.email}</p>
                      </div>
                      <motion.button
                        type="button" // Ensure it's a button of type "button" to prevent form submission
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleParticipant(currentUser)}
                        className="text-blue-500 hover:underline"
                      >
                        {expenseData.participants.some(p => p._id === currentUser._id) ? 'Remove' : 'Add'}
                      </motion.button>
                    </div>
                  </div>
                )}

                {expenseData.participants.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Selected Participants:</h4>
                    <div className="flex flex-wrap gap-2">
                      {expenseData.participants.map(friend => (
                        <div key={friend._id} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2">
                          <span>{friend.name}</span>
                          <motion.button
                            type="button" // Ensure it's a button of type "button" to prevent form submission
                            whileTap={{ scale: 0.8 }}
                            onClick={() => removeFriend(friend._id)}
                            className="text-red-500 text-sm"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Add Expense'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}