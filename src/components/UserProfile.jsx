import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircleIcon, 
  CameraIcon, 
  KeyIcon, 
  ShieldCheckIcon, 
  TrashIcon, 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  BellIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

// Create API service with axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

// Utility function to get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Function to check if the JWT token is expired
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const expirationTime = decodedToken.exp * 1000; // Convert exp from seconds to ms
    return Date.now() > expirationTime;
  } catch (error) {
    return true; // If token is malformed, treat as expired
  }
};

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    country: 'IN',
    defaultCurrency: 'INR'
  });
  const [error, setError] = useState(null);

  // Fetch user profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);

      const token = getAuthToken();

      // Check if the token is missing or expired
      if (!token || isTokenExpired(token)) {
        setError('Token expired or missing');
        setIsLoading(false);
        showNotification('Authentication token expired or missing', 'error');
        return;
      }

      const response = await API.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        setUserData({
          name: response.data.name || '',
          email: response.data.email || '',
          phoneNumber: response.data.phone || '',
          country: response.data.country || 'IN',
          defaultCurrency: response.data.defaultCurrency || 'INR'
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile data. Please try again later.');
      showNotification('Failed to load profile data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Show notification to the user
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle input changes for profile fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save changes to the profile
  const handleSave = async () => {
    try {
      setIsLoading(true);

      const token = getAuthToken(); // Get the token from localStorage

      if (!token) {
        showNotification('Authentication token missing', 'error');
        setIsLoading(false);
        return;
      }

      const response = await API.put(
        '/auth/profile',
        {
          name: userData.name,
          phoneNumber: userData.phoneNumber,
          country: userData.country,
          defaultCurrency: userData.defaultCurrency,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setEditMode(false);
        showNotification('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      showNotification('Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      if (!token) {
        showNotification('Authentication token missing', 'error');
        setIsLoading(false);
        return;
      }

      await API.delete('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowDeleteConfirm(false);
      showNotification('Account deleted successfully', 'success');

      // Redirect to login page or home page after successful deletion
      setTimeout(() => {
        window.location.href = '/login'; // Adjust based on your routing
      }, 2000);
    } catch (err) {
      console.error('Error deleting account:', err);
      setShowDeleteConfirm(false);
      showNotification('Failed to delete account', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      if (!token) {
        showNotification('Authentication token missing', 'error');
        setIsLoading(false);
        return;
      }

      await API.post('/auth/change-password', {
        currentPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showNotification('Password changed successfully!');
    } catch (err) {
      console.error('Error changing password:', err);
      showNotification(err?.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const tabVariants = {
    active: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    inactive: { opacity: 0, y: 20, transition: { duration: 0.5 } }
  };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'}`}>
        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
                notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <XMarkIcon className="h-5 w-5" />
              )}
              <span>{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
              <ArrowPathIcon className="h-6 w-6 animate-spin text-primary-600" />
              <span>Loading...</span>
            </div>
          </div>
        )}
  
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Profile Header Card */}
            <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Cover Photo */}
              <div className="h-48 w-full bg-gradient-to-r from-primary-500 to-primary-700 relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-4 right-4 p-2 bg-white text-primary-600 rounded-full shadow-lg"
                >
                  <CameraIcon className="h-5 w-5" />
                </motion.button>
              </div>
              
              <div className="px-6 pb-6">
                {/* Profile Image */}
                <div className="relative -mt-16 mb-6 flex justify-between items-end">
                  <div className="relative">
                    <motion.div
                      whileHover={{ boxShadow: "0 0 0 4px rgba(79, 70, 229, 0.6)" }}
                      className="h-32 w-32 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden"
                    >
                      <UserCircleIcon className={`h-28 w-28 ${darkMode ? 'text-gray-300' : 'text-gray-400'}`} />
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg"
                    >
                      <CameraIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDarkMode(!darkMode)}
                      className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
                      aria-label="Toggle dark mode"
                    >
                      {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                    </motion.button>
  
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditMode(!editMode)}
                      className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                        editMode 
                          ? 'bg-red-100 text-red-600' 
                          : `${darkMode ? 'bg-primary-600' : 'bg-primary-600'} text-white`
                      }`}
                    >
                      {editMode ? (
                        <>
                          <XMarkIcon className="h-5 w-5" />
                          <span>Cancel</span>
                        </>
                      ) : (
                        <>
                          <PencilIcon className="h-5 w-5" />
                          <span>Edit Profile</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
                
                <div className="text-center sm:text-left">
                  <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {userData.name} 
                  </h1>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{userData.email}</p>
                </div>
              </div>
            </div>
  
            {/* Tabs Navigation */}
            <div className={`flex flex-wrap border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setActiveTab('profile')}
                className={`mr-4 py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'profile'
                    ? `border-primary-600 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`
                    : `border-transparent ${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 hover:border-gray-300`
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`mr-4 py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'security'
                    ? `border-primary-600 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`
                    : `border-transparent ${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 hover:border-gray-300`
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`mr-4 py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'preferences'
                    ? `border-primary-600 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`
                    : `border-transparent ${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 hover:border-gray-300`
                }`}
              >
                Preferences
              </button>
            </div>
  
            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
                <button 
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setError(null)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            )}
  
            {/* Profile Information Tab */}
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial="inactive"
                  animate="active"
                  exit="inactive"
                  variants={tabVariants}
                  className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Profile Information
                    </h2>
                    {editMode && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-primary-600 text-white flex items-center space-x-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        ) : (
                          <CheckIcon className="h-5 w-5" />
                        )}
                        <span>Save Changes</span>
                      </motion.button>
                    )}
                  </div>
  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          disabled={!editMode}
                          value={userData.name}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                          } ${!editMode && 'opacity-75'}`}
                        />
                      </div>
                      {/* <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          disabled={!editMode}
                          value={userData.lastName}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                          } ${!editMode && 'opacity-75'}`}
                        />
                      </div> */}
                    </div>
  
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <div className="mt-1 flex rounded-lg shadow-sm">
                        <input
                          type="email"
                          name="email"
                          disabled={!editMode}
                          value={userData.email}
                          onChange={handleInputChange}
                          className={`block w-full rounded-l-lg ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                          } ${!editMode && 'opacity-75'}`}
                        />
                        {/* {editMode && (
                          <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            Verify
                          </span>
                        )} */}
                      </div>
                    </div>
  
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        disabled={!editMode}
                        value={userData.phoneNumber}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-lg shadow-sm ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                        } ${!editMode && 'opacity-75'}`}
                      />
                    </div>
  
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Country
                        </label>
                        <select
                          name="country"
                          disabled={!editMode}
                          value={userData.country}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                          } ${!editMode && 'opacity-75'}`}
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="IN">India</option>
                          <option value="AU">Australia</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Default Currency
                        </label>
                        <select
                          name="defaultCurrency"
                          disabled={!editMode}
                          value={userData.defaultCurrency}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                          } ${!editMode && 'opacity-75'}`}
                        >
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                          <option value="GBP">British Pound (£)</option>
                          <option value="INR">Indian Rupee (₹)</option>
                          <option value="AUD">Australian Dollar (A$)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
  
              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial="inactive"
                  animate="active"
                  exit="inactive"
                  variants={tabVariants}
                  className={`rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="p-6 space-y-6">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Security Settings
                    </h2>
  
                    {/* Password Change */}
                    <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-6`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Password
                          </h3>
                          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Last changed 3 months ago
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            // Open a modal for password change
                            // For simplicity, we're just showing a notification here
                            // You would implement a proper password change form
                            handleChangePassword('oldPassword', 'newPassword');
                          }}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                            darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                          } hover:bg-gray-200`}
                        >
                          <KeyIcon className="h-5 w-5" />
                          <span>Change Password</span>
                        </motion.button>
                      </div>
                    </div>
  
                    {/* Two-Factor Authentication */}
                    <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-6`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Two-Factor Authentication
                          </h3>
                          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className={`mr-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Disabled
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              // You would implement 2FA setup logic here
                              showNotification('2FA setup would open here');
                            }}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                              darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                            } hover:bg-gray-200`}
                          >
                            <ShieldCheckIcon className="h-5 w-5" />
                            <span>Enable</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
  
                    {/* Session Management */}
                    <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-6`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Active Sessions
                          </h3>
                          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Manage your active sessions across devices
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={async () => {
                            try {
                              await API.get('/auth/sessions');
                              showNotification('Sessions retrieved');
                            } catch (err) {
                              showNotification('Failed to retrieve sessions', 'error');
                            }
                          }}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                            darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                          } hover:bg-gray-200`}
                        >
                          <span>Manage Sessions</span>
                        </motion.button>
                      </div>
                    </div>
  
                    {/* Delete Account */}
                    <div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className={`text-lg font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                            Delete Account
                          </h3>
                          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Permanently delete your account and all associated data
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <TrashIcon className="h-5 w-5" />
                          <span>Delete Account</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
  
                  {/* Delete Confirmation Dialog */}
                  <AnimatePresence>
                    {showDeleteConfirm && (
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
                          className={`rounded-lg shadow-xl max-w-md w-full p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                        >
                          <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Delete Account
                          </h3>
                          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
                          </p>
                          <div className="flex justify-end space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowDeleteConfirm(false)}
                              className={`px-4 py-2 rounded-lg ${
                                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              Cancel
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleDeleteAccount}
                              className="px-4 py-2 rounded-lg bg-red-600 text-white"
                              disabled={isLoading}
                            >
                              {isLoading ? 'Deleting...' : 'Delete Permanently'}
                            </motion.button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
  

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial="inactive"
                animate="active"
                exit="inactive"
                variants={tabVariants}
                className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Preferences
                </h2>

                <div className="space-y-6">
                  {/* Theme Preference */}
                  <div className={`flex justify-between items-center pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div>
                      <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Theme
                      </h3>
                      <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Choose your preferred theme
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDarkMode(false)}
                        className={`p-2 rounded-lg ${!darkMode ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <SunIcon className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDarkMode(true)}
                        className={`p-2 rounded-lg ${darkMode ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <MoonIcon className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Language Preference */}
                  <div className={`pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Language
                        </h3>
                        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Set your preferred language
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GlobeAltIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <select
                          className={`block rounded-lg shadow-sm ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                          }`}
                          defaultValue="en"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="ja">日本語</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div className={`pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Notifications</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Receive updates and alerts via email
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Push Notifications</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Receive notifications on your device
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Marketing Emails</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Receive promotional content and offers
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Data Privacy */}
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Data Privacy
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Data Sharing</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Allow us to share your usage data with partners
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Usage Analytics</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Allow us to collect anonymous usage data
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => showNotification('Preferences saved successfully!')}
                      className="px-4 py-2 rounded-lg bg-primary-600 text-white flex items-center space-x-2"
                    >
                      <CheckIcon className="h-5 w-5" />
                      <span>Save Preferences</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Activity and Stats Section */}
          
        </motion.div>
      </div>
    </div>
  );
}