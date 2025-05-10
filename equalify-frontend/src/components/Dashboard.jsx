import React, { useState, useEffect } from 'react';
import AddExpenseModal from './AddExpenseModal';
import ExpenseList from './ExpenseList';
import RecentActivity from './RecentActivity';
import axios from 'axios';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data.data);
      setRecentActivities(response.data.data); // Update recent activities with the same data
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddNewExpense = () => {
    setIsModalOpen(true);
  };

  const handleExpenseAdded = async (newExpense) => {
    await fetchExpenses(); // Refresh all data
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Dashboard</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
          >
            Add Expense
          </button>
          {/* Other buttons */}
        </div>
      </div>

      {/* Stats cards section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* ...existing stats cards... */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h3 className="text-xl mb-4">Your Groups</h3>
          {/* Groups content */}
        </div>
        <div className="col-span-1">
          <h3 className="text-xl mb-4">Friends</h3>
          {/* Friends content */}
        </div>
        <div className="col-span-1">
          <RecentActivity 
            activities={recentActivities} 
            onAddNewExpense={handleAddNewExpense}
          />
        </div>
      </div>

      <ExpenseList expenses={expenses} />

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExpenseAdded={handleExpenseAdded}
      />
    </div>
  );
};

export default Dashboard;
