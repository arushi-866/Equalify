import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  BellIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

export default function Settings() {
  // Core settings
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('INR');
  const [defaultSplitMethod, setDefaultSplitMethod] = useState('equal');
  const [expenseCategories, setExpenseCategories] = useState(['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping']);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');

  // Notification settings
  const notificationTypes = [
    { id: 'deadline', label: 'Payment Deadline Reminders', enabled: true },
    { id: 'summary', label: 'Weekly Expense Summary', enabled: true },
    { id: 'friend', label: 'Friend Connection Requests', enabled: true },
    { id: 'group', label: 'Group Invitations', enabled: true },
    { id: 'payment', label: 'Payment Status Updates', enabled: true },
    { id: 'expense', label: 'New Group Expenses', enabled: true },
    { id: 'settlement', label: 'Settlement Suggestions', enabled: true },
    { id: 'budget', label: 'Budget Alerts', enabled: false },
  ];

  // Privacy settings
  const privacySettings = [
    { id: 'profile_visibility', label: 'Profile Visibility', value: 'friends' },
    { id: 'activity_history', label: 'Activity History', value: 'private' },
    { id: 'expense_details', label: 'Expense Details', value: 'group_members' },
  ];

  // Sync & Backup settings
  const syncSettings = [
    { id: 'auto_sync', label: 'Auto-sync Data', enabled: true },
    { id: 'backup_frequency', label: 'Backup Frequency', value: 'weekly' },
    { id: 'cloud_storage', label: 'Cloud Storage Service', value: 'default' },
  ];

  const [notificationSettings, setNotificationSettings] = useState(notificationTypes);
  const [privacyOptions, setPrivacyOptions] = useState(privacySettings);
  const [syncOptions, setSyncOptions] = useState(syncSettings);
  const [newCategory, setNewCategory] = useState('');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Handlers
  const handleNotificationToggle = (id) => {
    setNotificationSettings(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
    setHasUnsavedChanges(true);
  };

  const handlePrivacyChange = (id, value) => {
    setPrivacyOptions(prev =>
      prev.map(option =>
        option.id === id
          ? { ...option, value }
          : option
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleSyncOptionToggle = (id) => {
    setSyncOptions(prev =>
      prev.map(option =>
        option.id === id
          ? { ...option, enabled: !option.enabled }
          : option
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleSyncOptionChange = (id, value) => {
    setSyncOptions(prev =>
      prev.map(option =>
        option.id === id
          ? { ...option, value }
          : option
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setHasUnsavedChanges(true);
  };

  const handleAddCategory = () => {
    if (newCategory && !expenseCategories.includes(newCategory)) {
      setExpenseCategories([...expenseCategories, newCategory]);
      setNewCategory('');
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveCategory = (category) => {
    setExpenseCategories(expenseCategories.filter(c => c !== category));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    // Save changes logic here
    // In a real app, this would persist settings to backend or localStorage
    setHasUnsavedChanges(false);
    
    // Show success message
    alert("Settings saved successfully!");
  };

  // Navigation tabs for settings sections
  const tabs = [
    { id: 'appearance', icon: <SunIcon className="h-5 w-5" />, label: 'Appearance' },
    { id: 'preferences', icon: <ChartPieIcon className="h-5 w-5" />, label: 'Preferences' },
    { id: 'notifications', icon: <BellIcon className="h-5 w-5" />, label: 'Notifications' },
    { id: 'privacy', icon: <ShieldCheckIcon className="h-5 w-5" />, label: 'Privacy' },
    { id: 'sync', icon: <ArrowPathIcon className="h-5 w-5" />, label: 'Sync & Backup' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Equalify Settings</h1>
        {hasUnsavedChanges && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveChanges}
            className="btn-primary shadow-md px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
          >
            <DocumentTextIcon className="h-5 w-5" />
            Save Changes
          </motion.button>
        )}
      </motion.div>

      {/* Settings Navigation */}
      <div className="mb-8 border-b dark:border-gray-700">
        <nav className="flex space-x-4 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 flex items-center space-x-2 whitespace-nowrap rounded-t-lg transition ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-600 border-b-2 border-primary-600 dark:bg-gray-700 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content Area */}
      <motion.div
        key={activeTab}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <>
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6 dark:bg-gray-800"
            >
              <div className="flex items-center space-x-2 mb-4">
                {theme === 'light' ? (
                  <SunIcon className="h-6 w-6 text-primary-600" />
                ) : (
                  <MoonIcon className="h-6 w-6 text-primary-600" />
                )}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Theme</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleThemeChange('light')}
                  className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
                    theme === 'light'
                      ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <SunIcon className="h-5 w-5" />
                  Light Mode
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleThemeChange('dark')}
                  className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500 dark:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <MoonIcon className="h-5 w-5" />
                  Dark Mode
                </motion.button>
                {/* <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleThemeChange('system')}
                  className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
                    theme === 'system'
                      ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  System Default
                </motion.button> */}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6 dark:bg-gray-800"
            >
              <div className="flex items-center space-x-2 mb-4">
                <GlobeAltIcon className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Language</h2>
              </div>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
                <option value="ar">Arabic</option>
                <option value="ru">Russian</option>
                <option value="pt">Portuguese</option>
                <option value="it">Italian</option>
              </select>
            </motion.div>
          </>
        )}

        {/* Preferences Settings */}
        {activeTab === 'preferences' && (
          <>
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6 dark:bg-gray-800"
            >
              <div className="flex items-center space-x-2 mb-4">
                <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Currency</h2>
              </div>
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="JPY">Japanese Yen (¥)</option>
                <option value="AUD">Australian Dollar (A$)</option>
                <option value="CAD">Canadian Dollar (C$)</option>
                <option value="CHF">Swiss Franc (Fr)</option>
                <option value="CNY">Chinese Yuan (¥)</option>
                <option value="SGD">Singapore Dollar (S$)</option>
                <option value="MXN">Mexican Peso (MX$)</option>
                <option value="BRL">Brazilian Real (R$)</option>
                <option value="ZAR">South African Rand (R)</option>
              </select>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6 dark:bg-gray-800"
            >
              <div className="flex items-center space-x-2 mb-4">
                <UserGroupIcon className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Split Preferences</h2>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Split Method
                </label>
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setDefaultSplitMethod('equal');
                      setHasUnsavedChanges(true);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      defaultSplitMethod === 'equal'
                        ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Equal Split
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setDefaultSplitMethod('percentage');
                      setHasUnsavedChanges(true);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      defaultSplitMethod === 'percentage'
                        ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Percentage
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setDefaultSplitMethod('shares');
                      setHasUnsavedChanges(true);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      defaultSplitMethod === 'shares'
                        ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    By Shares
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setDefaultSplitMethod('custom');
                      setHasUnsavedChanges(true);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      defaultSplitMethod === 'custom'
                        ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Custom Amounts
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6 dark:bg-gray-800"
            >
              <div className="flex items-center space-x-2 mb-4">
                <ChartPieIcon className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Expense Categories</h2>
              </div>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {expenseCategories.map((category) => (
                    <div 
                      key={category}
                      className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 flex items-center gap-2"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                      <button 
                        onClick={() => handleRemoveCategory(category)}
                        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add new category"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                  >
                    Add
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6 dark:bg-gray-800"
          >
            <div className="flex items-center space-x-2 mb-6">
              <BellIcon className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              {notificationSettings.map((notification) => (
                <motion.div
                  key={notification.id}
                  className="flex items-center justify-between py-2 border-b dark:border-gray-700"
                  whileHover={{ scale: 1.01 }}
                >
                  <span className="text-gray-700 dark:text-gray-300">{notification.label}</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNotificationToggle(notification.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notification.enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <motion.span
                      layout
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                        notification.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6 dark:bg-gray-800"
          >
            <div className="flex items-center space-x-2 mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy Controls</h2>
            </div>
            <div className="space-y-6">
              {privacyOptions.map((option) => (
                <div key={option.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {option.label}
                  </label>
                  <select
                    value={option.value}
                    onChange={(e) => handlePrivacyChange(option.id, e.target.value)}
                    className="w-full md:w-64 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="group_members">Group Members Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              ))}
              <div className="pt-4 border-t dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-2"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  Download My Data
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sync & Backup Settings */}
        {activeTab === 'sync' && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6 dark:bg-gray-800"
          >
            <div className="flex items-center space-x-2 mb-6">
              <ArrowPathIcon className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sync & Backup</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Auto-sync Data</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSyncOptionToggle('auto_sync')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    syncOptions.find(opt => opt.id === 'auto_sync').enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <motion.span
                    layout
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                      syncOptions.find(opt => opt.id === 'auto_sync').enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Backup Frequency
                </label>
                <select
                  value={syncOptions.find(opt => opt.id === 'backup_frequency').value}
                  onChange={(e) => handleSyncOptionChange('backup_frequency', e.target.value)}
                  className="w-full md:w-64 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="never">Never</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cloud Storage Service
                </label>
                <select
                  value={syncOptions.find(opt => opt.id === 'cloud_storage').value}
                  onChange={(e) => handleSyncOptionChange('cloud_storage', e.target.value)}
                  className="w-full md:w-64 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="default">Equalify Cloud (Default)</option>
                  <option value="gdrive">Google Drive</option>
                  <option value="dropbox">Dropbox</option>
                  <option value="onedrive">OneDrive</option>
                </select>
              </div>
              
              <div className="pt-4 border-t dark:border-gray-700 flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  Sync Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg flex items-center gap-2"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  Create Backup
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Save Changes Floating Button (Mobile) */}
      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 md:hidden"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveChanges}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg flex items-center gap-2"
          >
            <DocumentTextIcon className="h-5 w-5" />
            Save Changes
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}