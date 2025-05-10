import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function ViewFriendsModal({ isOpen, onClose }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5000/api/friends', config);
      
      if (response.data.success) {
        const fetchedFriends = response.data.data.map(friend => ({
          _id: friend._id,
          name: friend.friendUser ? friend.friendUser.name : friend.name,
          email: friend.friendUser ? friend.friendUser.email : friend.email,
          owes: friend.owes || 0,
          isOwed: friend.isOwed || 0
        }));
        setFriends(fetchedFriends);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         friend.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'owes') return friend.owes > 0 && matchesSearch;
    if (activeTab === 'owed') return friend.isOwed > 0 && matchesSearch;
    return matchesSearch;
  });

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
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Friends</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <div className="relative flex-1 mr-4">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Search friends..."
                  />
                </div>
                <div className="flex text-xs">
                  <button
                    className={`px-3 py-1 rounded-l-md ${activeTab === 'all' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-1 ${activeTab === 'owes' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`}
                    onClick={() => setActiveTab('owes')}
                  >
                    They Owe
                  </button>
                  <button
                    className={`px-3 py-1 rounded-r-md ${activeTab === 'owed' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`}
                    onClick={() => setActiveTab('owed')}
                  >
                    You Owe
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 p-4">{error}</div>
            ) : (
              <div className="overflow-y-auto max-h-[60vh]">
                <div className="divide-y divide-gray-100">
                  {filteredFriends.map(friend => (
                    <motion.div
                      key={friend._id}
                      className="p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-800">{friend.name}</h4>
                          <p className="text-sm text-gray-500">{friend.email}</p>
                        </div>
                        <div className="text-right">
                          {friend.isOwed > 0 && (
                            <p className="font-medium text-green-600">gets ₹{friend.isOwed}</p>
                          )}
                          {friend.owes > 0 && (
                            <p className="font-medium text-red-600">owes ₹{friend.owes}</p>
                          )}
                          {(!friend.isOwed && !friend.owes) && (
                            <p className="font-medium text-gray-600">settled up</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}