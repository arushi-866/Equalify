import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  UserGroupIcon,
  UserPlusIcon,
  BellIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CurrencyRupeeIcon,
  ChartPieIcon,
  CalculatorIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ScaleIcon,
  ClipboardDocumentCheckIcon,
  ChartBarSquareIcon,
  SparklesIcon,
  // Add missing icon imports
  LightBulbIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  // RefreshIcon (commented out but referenced)
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import ViewFriendsModal from './modals/ViewFriendsModal';
import ViewGroupsModal from './modals/ViewGroupsModal';
import CreateGroupModal from './modals/CreateGroupModal';
import AddExpenseModal from './modals/AddExpenseModal';
import AddFriendModal from './modals/AddFriendModal';
import GroupDetailsModal from './modals/GroupDetailsModal';
import { Button } from './ui/button';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  // State variables
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [showViewFriendsModal, setShowViewFriendsModal] = useState(false);
  const [showViewGroupsModal, setShowViewGroupsModal] = useState(false);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]); 
  const [recentActivities, setRecentActivities] = useState([]);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [expenseSplits, setExpenseSplits] = useState([]);
  const [monthlySpending, setMonthlySpending] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalBalance = monthlySpending.reduce((sum, item) => sum + (item.total || 0), 0);
  
  const filteredFriends = friends.filter(friend =>
    (friend?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getFilteredFriends = () => {
    if (!Array.isArray(friends)) return [];
    return friends.filter(friend => friend.name && friend.name.trim() !== '');
  };

  const getAuthToken = () => localStorage.getItem('authToken');

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setShowGroupDetails(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBudgetTrackingClick = () => {
    console.log("🔍 Budget Tracking clicked");
    navigate("/budget-tracking");
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Separate friends request for better error handling
        const friendsResponse = await axios.get(`${API_URL}/friends`, config);
        console.log('Friends response:', friendsResponse.data); // Debug log
        
        if (friendsResponse.data.success) {
          // Properly handle the friends data structure
          const friendsData = friendsResponse.data.data || [];
          const fetchedFriends = friendsData.map(friend => ({
            _id: friend._id,
            name: friend.friendUser ? friend.friendUser.name : friend.name,
            email: friend.friendUser ? friend.friendUser.email : friend.email,
            owes: friend.owes || 0,
            isOwed: friend.isOwed || 0
          }));
          setFriends(fetchedFriends);
        }

        // Rest of your existing data fetching
        const [
          profileResponse,
          groupsResponse,
          expensesResponse,
          budgetsResponse,
          splitsResponse,
          spendingResponse
        ] = await Promise.all([
          axios.get(`${API_URL}/auth/profile`, config),
          axios.get(`${API_URL}/groups`, config),
          axios.get(`${API_URL}/expenses/recent`, config),
          axios.get(`${API_URL}/budgets`, config),
          axios.get(`${API_URL}/expenses/splits`, config),
          axios.get(`${API_URL}/expenses/monthly`, config)
        ]);

        setUserProfile(profileResponse.data);
        
        if (groupsResponse.data) {
          // Handle groups data safely
          const groupsData = Array.isArray(groupsResponse.data) ? groupsResponse.data : 
                           (groupsResponse.data.data || []);
                           
          setGroups(groupsData.map(group => ({
            ...group,
            id: group._id || group.id, // Ensure id is consistent
            lastActivity: new Date(group.lastActivity || group.updatedAt || group.createdAt)
          })));
        }

        // Handle expenses data
        if (expensesResponse.data) {
          setRecentActivities(Array.isArray(expensesResponse.data) ? 
            expensesResponse.data : (expensesResponse.data.data || []));
        }

        // Handle budgets data
        if (budgetsResponse.data) {
          setBudgetCategories(Array.isArray(budgetsResponse.data) ? 
            budgetsResponse.data : (budgetsResponse.data.data || []));
        }

        // Handle splits data
        if (splitsResponse.data) {
          setExpenseSplits(Array.isArray(splitsResponse.data) ? 
            splitsResponse.data : (splitsResponse.data.data || []));
        }

        // Handle monthly spending data
        if (spendingResponse.data) {
          setMonthlySpending(Array.isArray(spendingResponse.data) ? 
            spendingResponse.data : (spendingResponse.data.data || []));
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');

        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [logout]);
  
  useEffect(() => {
    console.log('Current friends:', friends);
  }, [friends]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        const response = await axios.get('http://localhost:5000/api/groups', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Groups API response:', response.data); // Debug log

        if (response.data) {
          const responseData = response.data.data || response.data;
          const fetchedGroups = Array.isArray(responseData) ? responseData.map(group => ({
            id: group._id || group.id,
            name: group.name,
            description: group.description,
            members: group.members || [],
            totalExpenses: group.totalExpenses || 0,
            lastActivity: new Date(group.lastActivity || group.updatedAt || group.createdAt)
          })) : [];
          
          setGroups(fetchedGroups);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError('Failed to load groups');
      }
    };

    if (user) {
      fetchGroups();
    }
  }, [user]);

  const handleCreateExpense = async (expenseData) => {
    try {
      const token = getAuthToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.post(`${API_URL}/expenses`, expenseData, config);

      // Update recent activities
      setRecentActivities((prev) => [
        { ...response.data, date: new Date(response.data.createdAt) },
        ...prev,
      ]);

      // Update expense splits
      const newExpenseSplit = {
        id: response.data._id,
        title: response.data.title,
        amount: response.data.amount,
        paidBy: response.data.paidBy.name || 'Unknown',
        splitters: response.data.participants.map((p) => p.name),
        status: 'Pending', // Default status
      };

      setExpenseSplits((prevSplits) => [newExpenseSplit, ...prevSplits]);

      setShowExpenseModal(false);
    } catch (error) {
      console.error('❌ Error creating expense:', error);
      // alert('Failed to create expense. Please try again.');
    }
  };

 

  const handleCreateGroup = async (groupData) => {
    try {
      const token = getAuthToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Assuming the API returns the created group
      const response = await axios.post(`${API_URL}/groups`, groupData, config);
      
      // Add the new group to state
      if (response.data) {
        const newGroup = response.data.data || response.data;
        setGroups(prevGroups => [...prevGroups, {
          id: newGroup._id || newGroup.id,
          name: newGroup.name,
          description: newGroup.description,
          members: newGroup.members || [],
          totalExpenses: 0,
          lastActivity: new Date()
        }]);
      }
      
      setShowGroupModal(false);
      // alert('Group created successfully!');
    } catch (error) {
      console.error('Error handling group creation:', error);
      // alert(error.message || 'Failed to create group');
    }
  };
  
  const handleAddFriend = async (email) => {
    try {
      const token = getAuthToken();
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      };
  
      const response = await axios.post(
        `${API_URL}/friends`, 
        { email },
        config
      );
  
      if (response.data.success) {
        // Make sure we're adding the friend data in the correct format
        const newFriend = response.data.data;
        setFriends(prevFriends => [...prevFriends, {
          _id: newFriend._id,
          name: newFriend.name,
          email: newFriend.email,
          owes: newFriend.owes || 0,
          isOwed: newFriend.isOwed || 0
        }]);
        setShowFriendModal(false);
        // alert('Friend added successfully!');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      // alert(error.response?.data?.message || 'Failed to add friend. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Dashboard Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">
            {userProfile ? `Welcome back, ${userProfile.name}!` : 'Welcome back!'} Here's an overview of your expenses
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            onClick={() => setShowExpenseModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Expense</span>
          </Button>
          
          <Button 
            onClick={() => setShowGroupModal(true)}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <UserGroupIcon className="h-5 w-5" />
            <span>New Group</span>
          </Button>
          
          <Button 
            onClick={() => setShowFriendModal(true)}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <UserPlusIcon className="h-5 w-5" />
            <span>Add Friend</span>
          </Button>
          
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Balance</p>
              <h2 className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{Math.abs(totalBalance)}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {totalBalance >= 0 ? 'You are owed' : 'You owe'}
              </p>
            </div>
            <div className="p-3 bg-primary-50 rounded-full">
              <CalculatorIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Groups</p>
              <h2 className="text-2xl font-bold text-gray-800">{groups.length}</h2>
              <p className="text-xs text-gray-500 mt-1">Active expense groups</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Monthly Spending</p>
              <h2 className="text-2xl font-bold text-gray-800">₹{recentActivities.reduce((sum, act) => sum + (act.amount || 0), 0)}</h2>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Groups Section */}
        <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700">Your Groups</h3>
              <span className="text-xs text-gray-500">
                {groups.length} {groups.length === 1 ? 'group' : 'groups'}
              </span>
            </div>
          </div>
          
          <div className="p-8 flex flex-col items-center justify-center space-y-3">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">View and manage your expense groups</p>
            <Button
              onClick={() => setShowViewGroupsModal(true)}
              variant="outline"
              className="w-full max-w-xs"
            >
              View All Groups
            </Button>
            <Button
              onClick={() => setShowGroupModal(true)}
              variant="outline"
              className="w-full max-w-xs"
            >
              Create New Group
            </Button>
          </div>
        </div>
        
        {/* Friends Section */}
        <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h3 className="font-medium text-gray-700">Friends</h3>
          </div>
          <div className="p-8 flex flex-col items-center justify-center">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">View and manage your friends</p>
            <Button
              onClick={() => setShowViewFriendsModal(true)}
              variant="outline"
              className="w-full max-w-xs"
            >
              View Friends
            </Button>
          </div>
        </div>
        
        {/* Recent Activities Section */}
        <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h3 className="font-medium text-gray-700">Recent Activities</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No recent activities</div>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={activity.id || index} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-800">{activity.title || 'Untitled Expense'}</h4>
                      <p className="text-xs text-gray-500">
                        {activity.group || 'Personal'} • {format(activity.date || new Date(), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">₹{activity.amount || 0}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-100">
            <Button
              onClick={() => setShowExpenseModal(true)}
              variant="outline"
              className="w-full text-sm"
            >
              <PlusIcon className="h-4 w-4 mr-2" /> Add New Expense
            </Button>
          </div>
        </div>
      </div>


      
      {/* Expense Splitting */}
      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
  {expenseSplits.length === 0 ? (
    <div className="p-4 text-center text-gray-500">
      No expense splits available
    </div>
  ) : (
    expenseSplits.map((split, index) => (
      <div key={split.id || index} className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-gray-800">{split.title || 'Untitled Split'}</h4>
            <p className="text-xs text-gray-500">
              Paid by {split.paidBy || 'Unknown'} • Split with{' '}
              {split.splitters.join(', ')}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-800">₹{split.amount || 0}</p>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                split.status === 'Settled'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {split.status || 'Pending'}
            </span>
          </div>
        </div>
      </div>
    ))
  )}
</div>

      
      {/* Budget Tracking */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ChartPieIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Budget Tracking</h2>
          </div>
          <Button
            onClick={handleBudgetTrackingClick}
            variant="outline"
            className="text-sm"
          >
            <ArrowTrendingUpIcon className="h-4 w-4 mr-2" /> View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="font-medium text-gray-700">Budget Categories</h3>
            </div>
            <div className="p-4">
              {!Array.isArray(budgetCategories) || budgetCategories.length === 0 ? (
                <div className="text-center text-gray-500">No budget categories found</div>
              ) : (
                <div className="space-y-4">
                  {budgetCategories.map((category, index) => (
                    <div key={category.id || index}>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium text-gray-800">{category.name || 'Unnamed Category'}</h4>
                        <div className="text-sm">
                          <span className="text-gray-600">₹{category.spent || 0}</span>
                          <span className="text-gray-400"> / ₹{category.allocated || 0}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            (category.allocated && (category.spent / category.allocated) > 0.9) ? 'bg-red-600' : 
                            (category.allocated && (category.spent / category.allocated) > 0.7) ? 'bg-yellow-600' : 'bg-green-600'
                          }`}
                          style={{ width: `${Math.min(100, category.allocated ? (category.spent / category.allocated) * 100 : 0)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        ₹{category.remaining || (category.allocated - category.spent) || 0} remaining
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Monthly Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="font-medium text-gray-700">Monthly Spending Overview</h3>
            </div>
            <div className="p-4 h-64">
              {!Array.isArray(monthlySpending) || monthlySpending.length === 0 ? (
                <div className="text-center text-gray-500 h-full flex items-center justify-center">
                  No spending data available
                </div>
              ) : (
                <div className="h-full flex items-end justify-between">
                  {monthlySpending.map((item, index) => {
                    const maxAmount = Math.max(...monthlySpending.map(i => i.amount || 0));
                    const height = maxAmount > 0 ? `${((item.amount || 0) / maxAmount) * 80}%` : '0%';
                    
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className="flex-1 w-12 flex items-end">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="w-full bg-primary-500 rounded-t"
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{item.month || 'N/A'}</p>
                        <p className="text-xs font-medium">₹{item.amount || 0}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <SparklesIcon className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="font-medium text-gray-700">AI Budget Analysis</h3>
        </div>
        {/* <Button variant="ghost" size="sm" className="text-xs">
          <RefreshIcon className="h-3 w-3 mr-1" /> Refresh Analysis
        </Button> */}
      </div>
    </div>
    <div className="p-5">
      {!budgetCategories.length ? (
        <div className="text-center text-gray-500 py-6">
          Add budget categories to receive AI-powered insights
        </div>
      ) : (
        <div className="space-y-5">
          {/* AI Insights */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start">
              <LightBulbIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-700 mb-1">Key Insights</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  {(() => {
                    // Calculate overspent categories
                    const overspentCategories = budgetCategories.filter(c => c.spent > c.allocated);
                    
                    // Calculate nearly depleted categories (>80% spent)
                    const nearlyDepletedCategories = budgetCategories.filter(
                      c => (c.spent / c.allocated) > 0.8 && (c.spent / c.allocated) <= 1
                    );
                    
                    // Calculate underspent categories (<30% spent)
                    const underspentCategories = budgetCategories.filter(
                      c => (c.spent / c.allocated) < 0.3
                    );
                    
                    // Generate insights based on spending patterns
                    const insights = [];
                    
                    if (overspentCategories.length > 0) {
                      insights.push(
                        <li key="overspent">
                          You've exceeded your budget in {overspentCategories.length} {overspentCategories.length === 1 ? 'category' : 'categories'}: {' '}
                          <span className="font-medium">{overspentCategories.map(c => c.name).join(', ')}</span>.
                        </li>
                      );
                    }
                    
                    if (nearlyDepletedCategories.length > 0) {
                      insights.push(
                        <li key="depleted">
                          Nearly depleted budget for: <span className="font-medium">{nearlyDepletedCategories.map(c => c.name).join(', ')}</span>.
                        </li>
                      );
                    }
                    
                    if (underspentCategories.length > 0) {
                      insights.push(
                        <li key="underspent">
                          You're well under budget in: <span className="font-medium">{underspentCategories.map(c => c.name).join(', ')}</span>.
                        </li>
                      );
                    }
                    
                    // Calculate highest spending category
                    if (budgetCategories.length > 0) {
                      const highestSpendingCategory = [...budgetCategories].sort((a, b) => b.spent - a.spent)[0];
                      insights.push(
                        <li key="highest">
                          Your highest expense is <span className="font-medium">{highestSpendingCategory.name}</span> at ₹{highestSpendingCategory.spent}.
                        </li>
                      );
                    }
                    
                    return insights.length > 0 ? insights : <li>Add more budget data to receive personalized insights.</li>;
                  })()}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Recommendations */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">AI Recommendations</h4>
            <div className="space-y-3">
              {(() => {
                // Calculate total budget and spending
                const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
                const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
                const spendingRate = totalAllocated > 0 ? (totalSpent / totalAllocated) : 0;
                
                // Generate recommendations based on spending patterns
                const recommendations = [];
                
                // Overall spending recommendation
                if (spendingRate > 0.9) {
                  recommendations.push(
                    <div key="overall" className="flex items-start p-3 bg-red-50 rounded-lg border border-red-100">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-red-700">
                          You've used {Math.round(spendingRate * 100)}% of your total budget. Consider reviewing your expenses to avoid overspending.
                        </p>
                      </div>
                    </div>
                  );
                } else if (spendingRate < 0.5) {
                  recommendations.push(
                    <div key="overall" className="flex items-start p-3 bg-green-50 rounded-lg border border-green-100">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-green-700">
                          You're only at {Math.round(spendingRate * 100)}% of your total budget. You're doing well with managing your finances!
                        </p>
                      </div>
                    </div>
                  );
                }
                
                // Find categories that need reallocation
                const overspentCategories = budgetCategories.filter(c => c.spent > c.allocated);
                const underspentCategories = budgetCategories.filter(c => (c.spent / c.allocated) < 0.3);
                
                if (overspentCategories.length > 0 && underspentCategories.length > 0) {
                  recommendations.push(
                    <div key="reallocation" className="flex items-start p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <AdjustmentsHorizontalIcon className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-amber-700">
                          Consider reallocating funds from {underspentCategories.map(c => c.name).join(', ')} to cover {overspentCategories.map(c => c.name).join(', ')}.
                        </p>
                      </div>
                    </div>
                  );
                }
                
                // Monthly trend analysis
                if (monthlySpending.length >= 3) {
                  const lastThreeMonths = monthlySpending.slice(-3);
                  const isIncreasing = lastThreeMonths[0].amount < lastThreeMonths[1].amount && 
                                      lastThreeMonths[1].amount < lastThreeMonths[2].amount;
                  
                  if (isIncreasing) {
                    recommendations.push(
                      <div key="trend" className="flex items-start p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <ChartBarIcon className="h-5 w-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-purple-700">
                            Your spending has increased for 3 consecutive months. Review your recurring expenses to identify potential savings.
                          </p>
                        </div>
                      </div>
                    );
                  }
                }
                
                return recommendations.length > 0 ? recommendations : (
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <InformationCircleIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">
                        Add more budget data to receive personalized recommendations.
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
          
          {/* Budget Forecast */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Budget Forecast</h4>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              {(() => {
                // Calculate spending rate
                const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
                const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
                const spendingRate = totalAllocated > 0 ? (totalSpent / totalAllocated) : 0;
                
                // Calculate days left in month (assuming we're tracking monthly budgets)
                const today = new Date();
                const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                const daysRemaining = lastDayOfMonth - today.getDate();
                const monthProgress = (today.getDate() / lastDayOfMonth);
                
                if (budgetCategories.length === 0) {
                  return (
                    <div className="text-center text-gray-500 py-2">
                      Add budget categories to see your forecast
                    </div>
                  );
                }
                
                // Generate forecast message
                let forecastMessage = "";
                let statusColor = "";
                
                if (spendingRate > monthProgress * 1.2) {
                  forecastMessage = `At your current spending rate, you'll exhaust your budget ${Math.round((spendingRate / monthProgress - 1) * 30)} days before month-end.`;
                  statusColor = "text-red-600";
                } else if (spendingRate < monthProgress * 0.8) {
                  forecastMessage = `At your current rate, you'll have approximately ₹${Math.round((totalAllocated - totalSpent) * (1 - spendingRate / monthProgress))} remaining at month-end.`;
                  statusColor = "text-green-600";
                } else {
                  forecastMessage = "You're on track with your monthly budget.";
                  statusColor = "text-blue-600";
                }
                
                return (
                  <div className="flex flex-col items-center">
                    <div className="mb-4 w-full max-w-xs">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Month Progress</span>
                        <span>{Math.round(monthProgress * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${monthProgress * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mb-4 w-full max-w-xs">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Budget Utilization</span>
                        <span>{Math.round(spendingRate * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            spendingRate > 0.9 ? 'bg-red-500' : 
                            spendingRate > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(spendingRate * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <p className={`text-sm font-medium ${statusColor} mt-2`}>
                      {forecastMessage}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {daysRemaining} days remaining in this month
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>


      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <ClipboardDocumentCheckIcon className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
            onClick={() => setShowExpenseModal(true)}
          >
            <div className="p-2 bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <PlusIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-medium text-gray-800">Add Expense</h3>
            <p className="text-sm text-gray-500">Record a new expense</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
            onClick={() => setShowGroupModal(true)}
          >
            <div className="p-2 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-800">Create Group</h3>
            <p className="text-sm text-gray-500">Start a new expense group</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
            onClick={handleBudgetTrackingClick}
          >
            <div className="p-2 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <ChartBarSquareIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-800">Budget Tracking</h3>
            <p className="text-sm text-gray-500">Check your budgets</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
            onClick={() => setShowFriendModal(true)}
          >
            <div className="p-2 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <UserPlusIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800">Add Friend</h3>
            <p className="text-sm text-gray-500">Connect with friends</p>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-200 pt-4 mt-8">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ExpenseSplit. All rights reserved.
        </p>
      </div>
      
      {/* Modals */}
      <AnimatePresence>
        {showExpenseModal && (
          <AddExpenseModal 
            isOpen={showExpenseModal} 
            onClose={() => setShowExpenseModal(false)} 
            groups={groups}
            friends={friends}
            onAddExpense={handleCreateExpense} // Pass the function here
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showGroupModal && (
          <CreateGroupModal 
            isOpen={showGroupModal} 
            onClose={() => setShowGroupModal(false)} 
            friends={friends}
            onCreateGroup={handleCreateGroup}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showFriendModal && (
          <AddFriendModal 
            isOpen={showFriendModal} 
            onClose={() => setShowFriendModal(false)} 
            onAddFriend={handleAddFriend}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showGroupDetails && selectedGroup && (
          <GroupDetailsModal 
            isOpen={showGroupDetails} 
            onClose={() => setShowGroupDetails(false)} 
            group={selectedGroup}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showViewFriendsModal && (
          <ViewFriendsModal
            isOpen={showViewFriendsModal}
            onClose={() => setShowViewFriendsModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showViewGroupsModal && (
          <ViewGroupsModal
            isOpen={showViewGroupsModal}
            onClose={() => setShowViewGroupsModal(false)}
            groups={groups}
            onGroupClick={(group) => {
              setSelectedGroup(group);
              setShowGroupDetails(true);
              setShowViewGroupsModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}