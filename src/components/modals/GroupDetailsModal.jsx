import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function GroupDetailsModal({ isOpen, onClose, groupId }) {
  const [group, setGroup] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch group details when modal opens
  useEffect(() => {
    if (isOpen && groupId) {
      fetchGroupDetails();
    }
  }, [isOpen, groupId]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get group details from backend
      const response = await axios.get(`/api/groups/${groupId}`, {
        headers: {
          'Content-Type': 'application/json',
          // Assuming you store auth token in localStorage
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setGroup(response.data);
      
      // You would also need to fetch transactions (expenses) for this group
      const expensesResponse = await axios.get(`/api/expenses/group/${groupId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Transform expenses data to match the transactions format
      const formattedTransactions = expensesResponse.data.map(expense => ({
        id: expense._id,
        description: expense.description,
        amount: expense.amount,
        paidBy: expense.paidBy.name, // Assuming expense.paidBy is populated with user data
        date: new Date(expense.date).toISOString().split('T')[0],
        status: expense.settled ? 'settled' : 'pending'
      }));
      
      setTransactions(formattedTransactions);
      
    } catch (err) {
      console.error('Error fetching group details:', err);
      setError('Failed to load group details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : group?.name}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <span className="text-gray-500">Loading group details...</span>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-48">
                <span className="text-red-500">{error}</span>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Group Info */}
                {group.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <div className="text-gray-700">{group.description}</div>
                  </div>
                )}

                {/* Group Members */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Members</h3>
                  <div className="flex flex-wrap gap-4">
                    {group.members.map((member, index) => (
                      <motion.div
                        key={member.user._id || index}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2"
                      >
                        <UserCircleIcon className="h-6 w-6 text-gray-600" />
                        <span className="text-sm text-gray-700">
                          {member.user.name || `Member ${index + 1}`}
                          {member.role === 'admin' && (
                            <span className="ml-1 text-xs text-blue-600">(Admin)</span>
                          )}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Transactions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions</h3>
                  {transactions.length === 0 ? (
                    <div className="text-gray-500 italic">No transactions yet</div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{transaction.description}</h4>
                              <div className="text-sm text-gray-600">Paid by {transaction.paidBy}</div>
                              <div className="text-sm text-gray-600">{transaction.date}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">₹{transaction.amount}</div>
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  transaction.status === 'settled'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}