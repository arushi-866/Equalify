import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function AddFriendModal({ isOpen, onClose, onAddFriend }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addedFriends, setAddedFriends] = useState([]);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:5000/api/auth/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter out users who are already added as friends
      const filteredUsers = response.data.users.filter(
        user => !addedFriends.some(friend => friend._id === user._id)
      );
      
      setUsers(filteredUsers);
    } catch (err) {
      setError('Failed to search users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, addedFriends]);

  const handleAddFriend = (user) => {
    // Add to local state
    setAddedFriends([...addedFriends, user]);
    
    // Call parent component function
    onAddFriend(user.email);
    
    // Clear search results but keep the search term
    setUsers([]);
  };

  const handleRemoveFriend = (userId) => {
    setAddedFriends(addedFriends.filter(friend => friend._id !== userId));
  };

  const handleDone = () => {
    // Close the modal and reset state
    setSearchTerm('');
    setUsers([]);
    setAddedFriends([]);
    onClose();
  };

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
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Friends</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDone}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            </div>

            <div className="space-y-4">
              {/* Search input */}
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <MagnifyingGlassIcon className="h-5 w-5 ml-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Search for registered users..."
                  />
                </div>
              </div>

              {/* Added friends section */}
              {addedFriends.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Friends:</h3>
                  <div className="flex flex-wrap gap-2">
                    {addedFriends.map((friend) => (
                      <motion.div
                        key={friend._id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span className="mr-1">{friend.name}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveFriend(friend._id)}
                          className="ml-1 text-primary-600 hover:text-primary-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search results */}
              <div className="mt-4 max-h-60 overflow-y-auto">
                {loading && <p className="text-center text-gray-500">Searching...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && users.length === 0 && searchTerm && (
                  <p className="text-center text-gray-500">No users found</p>
                )}
                {users.map((user) => (
                  <motion.div
                    key={user._id}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    className="p-3 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddFriend(user)}
                        className="px-3 py-1 text-sm bg-primary-600 text-white rounded-full hover:bg-primary-700"
                      >
                        Add
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Done button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDone}
              className="w-full mt-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center justify-center"
            >
              {addedFriends.length > 0 ? (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Done Adding ({addedFriends.length})
                </>
              ) : (
                'Close'
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}