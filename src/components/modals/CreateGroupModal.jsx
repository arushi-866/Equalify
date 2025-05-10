import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function CreateGroupModal({ isOpen, onClose, onCreateGroup }) {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    if (isOpen) fetchFriends();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setGroupName('');
      setSelectedFriends([]);
      setDescription('');
      setSearchTerm('');
      setError(null);
      setFormError('');
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/friends');
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
    setFormError('');

    if (!groupName.trim()) return setFormError('Please enter a group name');
    if (selectedFriends.length === 0) return setFormError('Please select at least one friend');

    const groupData = {
      name: groupName.trim(),
      description: description.trim(),
      members: selectedFriends.map(friendId => ({ user: friendId, role: 'member' }))
    };

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/groups', groupData, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.success) {
        onCreateGroup(response.data.data);
        onClose();
      } else {
        setFormError('Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setFormError(error.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const toggleFriend = (friendId) => {
    setSelectedFriends(prev =>
      prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]
    );
  };

  const filteredFriends = friends?.filter(
    (friend) =>
      friend?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const handleClose = () => {
    if (groupName || description || selectedFriends.length > 0) {
      if (window.confirm('Are you sure you want to close? Any unsaved changes will be lost.')) onClose();
    } else onClose();
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
            className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Group</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Group Name*</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className={`w-full p-3 border ${formError && !groupName.trim() ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="Enter group name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter group description"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Members ({selectedFriends.length} selected)
                </label>
                <div className="relative mb-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                        {searchTerm ? 'No friends found' : 'No friends available'}
                      </div>
                    ) : (
                      filteredFriends.map((friend) => (
                        <div
                          key={friend._id}
                          onClick={() => toggleFriend(friend._id)}
                          className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${selectedFriends.includes(friend._id) ? 'bg-primary-50' : ''}`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedFriends.includes(friend._id)}
                              onChange={() => toggleFriend(friend._id)}
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

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                disabled={loading || selectedFriends.length === 0 || !groupName.trim()}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                    Creating...
                  </div>
                ) : (
                  'Create Group'
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
