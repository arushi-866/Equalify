import React, { useState } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Button } from "@/components/ui/button";
import FlashcardModal from "../components/FlashcardModal";  // If BudgetTracking.jsx is in src/pages/

const BudgetTrackingPage = () => {
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [responses, setResponses] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [userPreferences, setUserPreferences] = useState({});
  const [totalBudgetInput, setTotalBudgetInput] = useState("");
  const [showBudgetInputForm, setShowBudgetInputForm] = useState(false);

  const flashcardData = [
    { 
      question: "What is your income level?", 
      options: ["Low", "Medium", "High"],
      multiSelect: false,
      tip: "Your income level helps tailor budget categories to your financial situation."
    },
    { 
      question: "What is your occupation type?", 
      options: ["Student", "Employee", "Freelancer", "Business Owner"],
      multiSelect: false,
      tip: "Different occupations have different expense patterns and income stability."
    },
    { 
      question: "What are your hobbies?", 
      options: ["Gym", "Gaming", "Traveling", "Dining Out", "Reading", "None"],
      multiSelect: true,
      tip: "Knowing your hobbies helps allocate appropriate budget for leisure activities."
    },
    { 
      question: "Any fixed monthly expenses?", 
      options: ["Rent", "Subscriptions", "Loans", "Utilities", "Other"],
      multiSelect: true,
      tip: "Fixed expenses form the foundation of your monthly budget."
    },
  ];

  const openModal = () => {
    setCurrentCard(0); // Reset to first card when opening
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCard(0); // Reset when closing
  };

  const handleNext = (selectedOption) => {
    setUserPreferences((prev) => {
      const updatedPreferences = {
        ...prev,
        [flashcardData[currentCard].question]: selectedOption,
      };
      
      console.log("Selection saved:", updatedPreferences);

      // If last question, close modal AFTER updating state
      if (currentCard === flashcardData.length - 1) {
        setTimeout(() => {
          console.log("All preferences collected:", updatedPreferences);
          closeModal();
          // Show budget input form after completing preferences
          setShowBudgetInputForm(true);
        }, 100); // Slight delay ensures state updates before closing
      } else {
        setCurrentCard((prevCard) => prevCard + 1);
      }

      return updatedPreferences;
    });
  };

  // Start with empty expenses list
  const [expenses, setExpenses] = useState([]);
  
  // Define budget categories without spent values yet
  const [budgets, setBudgets] = useState([
    { category: "Groceries", limit: 5000, spent: 0 },
    { category: "Dining", limit: 3000, spent: 0 },
    { category: "Transportation", limit: 2000, spent: 0 },
    { category: "Entertainment", limit: 1500, spent: 0 },
    { category: "Gym", limit: 1200, spent: 0 },
    { category: "Installments", limit: 4000, spent: 0 },
    { category: "Dance Classes", limit: 2000, spent: 0 }
  ]);
  
  const [newExpense, setNewExpense] = useState({
    category: "Groceries",
    amount: "",
    date: new Date().toISOString().slice(0, 10)
  });
  
  const [newCategory, setNewCategory] = useState({
    category: "",
    limit: ""
  });
  
  const [editingExpense, setEditingExpense] = useState(null);
  const [showCategoryBudgets, setShowCategoryBudgets] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("April 2025");
  
  // Calculate total budget from budgets array
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  
  // Handle total budget submission
  const handleTotalBudgetSubmit = (e) => {
    e.preventDefault();
    
    if (totalBudgetInput && !isNaN(parseFloat(totalBudgetInput))) {
      const newTotalBudget = parseFloat(totalBudgetInput);
      
      // Calculate proportion for each category
      const scaleFactor = newTotalBudget / totalBudget;
      
      // Update each category's limit proportionally
      const updatedBudgets = budgets.map(budget => ({
        ...budget,
        limit: Math.round(budget.limit * scaleFactor)
      }));
      
      setBudgets(updatedBudgets);
      setShowBudgetInputForm(false);
      setTotalBudgetInput("");
    }
  };
  
  // Function to add a new expense
  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    
    if (editingExpense) {
      // Update existing expense
      const updatedExpenses = expenses.map(expense => 
        expense.id === editingExpense.id 
          ? { 
              ...expense, 
              category: newExpense.category, 
              amount: parseFloat(newExpense.amount), 
              date: newExpense.date 
            } 
          : expense
      );
      
      setExpenses(updatedExpenses);
      setEditingExpense(null);
    } else {
      // Add new expense
      const newId = expenses.length > 0 ? Math.max(...expenses.map(expense => expense.id)) + 1 : 1;
      const expenseToAdd = {
        id: newId,
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date
      };
      
      setExpenses([expenseToAdd, ...expenses]);
      
      // Update category budget spent amount
      const updatedBudgets = budgets.map(budget => 
        budget.category === newExpense.category 
          ? { ...budget, spent: budget.spent + parseFloat(newExpense.amount) } 
          : budget
      );
      
      setBudgets(updatedBudgets);
    }
    
    // Reset form
    setNewExpense({
      category: "Groceries",
      amount: "",
      date: new Date().toISOString().slice(0, 10)
    });
  };
  
  // Function to edit an expense
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setNewExpense({
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date
    });
    
    // Scroll to expense form
    document.getElementById('expense-form').scrollIntoView({ behavior: 'smooth' });
  };
  
  // Function to delete an expense
  const handleDeleteExpense = (expenseId) => {
    const expenseToDelete = expenses.find(expense => expense.id === expenseId);
    
    // Update category budget spent amount
    const updatedBudgets = budgets.map(budget => 
      budget.category === expenseToDelete.category 
        ? { ...budget, spent: Math.max(0, budget.spent - expenseToDelete.amount) } 
        : budget
    );
    
    setBudgets(updatedBudgets);
    
    // Remove expense
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
  };
  
  // Function to add a new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    
    if (newCategory.category && newCategory.limit) {
      const categoryToAdd = {
        category: newCategory.category,
        limit: parseFloat(newCategory.limit),
        spent: 0
      };
      
      setBudgets([...budgets, categoryToAdd]);
      setShowAddCategoryForm(false);
      setNewCategory({ category: "", limit: "" });
    }
  };
  
  // Toggle functions
  const toggleCategoryBudgets = () => {
    setShowCategoryBudgets(!showCategoryBudgets);
    setShowReports(false);
  };
  
  const toggleReports = () => {
    setShowReports(!showReports);
    setShowCategoryBudgets(false);
  };
  
  const toggleAddCategoryForm = () => {
    setShowAddCategoryForm(!showAddCategoryForm);
  };
  
  const calculatePercentage = (spent, limit) => {
    return Math.min(Math.round((spent / limit) * 100), 100);
  };
  
  // Get current month name
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  // For charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  
  // Prepare data for charts
  const categoryData = budgets.map((budget, index) => ({
    name: budget.category,
    value: budget.spent,
    color: COLORS[index % COLORS.length]
  }));
  
  // Daily spending data for line chart
  const getDailyData = () => {
    const days = {};
    expenses.forEach(expense => {
      const date = expense.date;
      days[date] = (days[date] || 0) + expense.amount;
    });
    
    return Object.keys(days).sort().map(date => ({
      date,
      amount: days[date]
    }));
  };
  
  // Weekly spending for bar chart
  const getWeeklyData = () => {
    const weeks = {
      "Week 1": 0,
      "Week 2": 0,
      "Week 3": 0,
      "Week 4": 0
    };
    
    expenses.forEach(expense => {
      const day = parseInt(expense.date.split('-')[2]);
      if (day <= 7) weeks["Week 1"] += expense.amount;
      else if (day <= 14) weeks["Week 2"] += expense.amount;
      else if (day <= 21) weeks["Week 3"] += expense.amount;
      else weeks["Week 4"] += expense.amount;
    });
    
    return Object.keys(weeks).map(week => ({
      name: week,
      amount: weeks[week]
    }));
  };
  
  // Category comparison data
  const getCategoryComparisonData = () => {
    return budgets.map(budget => ({
      name: budget.category,
      limit: budget.limit,
      spent: budget.spent
    }));
  };
  
  // Check if there are any expenses
  const hasExpenses = expenses.length > 0;
  
  return (
    <div className="bg-green-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 shadow-md py-7 mb-5 gap-x-10">
        {/* Left Side: Welcome Text */}
        <div>
          <h1 className="text-2xl font-bold text-green-800">Welcome back!</h1>
          <p className="text-green-600">Let's track your spending today</p>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex space-x-4">
          <Button onClick={() => setShowBudgetInputForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            Set Total Budget
          </Button>
          <Button onClick={() => openModal()} className="bg-green-600 text-white px-4 py-2 rounded">
            Analyze your budget
          </Button>
        </div>
        
        <FlashcardModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          flashcardData={flashcardData}
          currentCard={currentCard}
          handleNext={handleNext}
        />
      </div>

      {/* Budget Input Form Modal */}
      {showBudgetInputForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-medium text-green-800 mb-4">Set Your Total Monthly Budget</h2>
            
            <form onSubmit={handleTotalBudgetSubmit}>
              <div className="mb-4">
                <label className="block text-green-600 mb-2">Total Budget Amount (₹)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="Enter your total monthly budget"
                  value={totalBudgetInput}
                  onChange={(e) => setTotalBudgetInput(e.target.value)}
                  required
                  min="1"
                  step="1"
                />
                <p className="text-sm text-green-600 mt-2">
                  Current total budget: ₹{totalBudget.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Note: Individual category budgets will be adjusted proportionally.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowBudgetInputForm(false)}
                  className="px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Set Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - quick actions */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div 
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center cursor-pointer hover:bg-green-50 transition-colors"
              onClick={() => document.getElementById('expense-form').scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="bg-green-100 p-3 rounded-full mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-center text-green-800 font-medium">Add Expense</h3>
              <p className="text-center text-green-600 text-sm">Record your spending</p>
            </div>
            
            <div 
              className={`bg-white rounded-lg shadow-sm p-4 flex flex-col items-center cursor-pointer hover:bg-green-50 transition-colors ${!hasExpenses && 'opacity-70'}`}
              onClick={() => {
                if (hasExpenses) toggleCategoryBudgets();
                else alert("Please add some expenses first to view budgets.");
              }}
            >
              <div className="bg-green-100 p-3 rounded-full mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-center text-green-800 font-medium">Monthly Budgets</h3>
              <p className="text-center text-green-600 text-sm">View spending by category</p>
            </div>
            
            <div 
              className={`bg-white rounded-lg shadow-sm p-4 flex flex-col items-center cursor-pointer hover:bg-green-50 transition-colors ${!hasExpenses && 'opacity-70'}`}
              onClick={() => {
                if (hasExpenses) toggleReports();
                else alert("Please add some expenses first to view reports.");
              }}
            >
              <div className="bg-green-100 p-3 rounded-full mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-center text-green-800 font-medium">View Reports</h3>
              <p className="text-center text-green-600 text-sm">Analyze your spending</p>
            </div>
          </div>
          
          {/* No expenses message */}
          {!hasExpenses && !showReports && !showCategoryBudgets && (
            <div className="bg-white rounded-lg shadow-sm p-10 mb-6 text-center">
              <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-green-800 mb-2">No Expenses Added Yet</h2>
              <p className="text-green-600 mb-6">Start by adding your expenses to track your spending and view analytics.</p>
              <button 
                className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors"
                onClick={() => document.getElementById('expense-form').scrollIntoView({ behavior: 'smooth' })}
              >
                Add Your First Expense
              </button>
            </div>
          )}
          
          {/* Charts & Reports - conditionally displayed */}
          {hasExpenses && showReports && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-green-800">Spending Reports & Analytics</h2>
                <div className="text-green-500 text-sm flex items-center">
                  <select 
                    className="p-1 border border-green-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option>April 2025</option>
                    <option>March 2025</option>
                    <option>February 2025</option>
                  </select>
                </div>
              </div>
              
              {/* Charts grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pie chart - Category breakdown */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-green-800 font-medium mb-2">Spending by Category</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Line chart - Daily spending */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-green-800 font-medium mb-2">Daily Spending Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getDailyData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${value}`} />
                        <Line type="monotone" dataKey="amount" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Bar chart - Weekly spending */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-green-800 font-medium mb-2">Weekly Spending</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getWeeklyData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                        <Bar dataKey="amount" fill="#4CAF50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Bar chart - Budget vs Actual */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-green-800 font-medium mb-2">Budget vs Actual</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getCategoryComparisonData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                        <Legend />
                        <Bar dataKey="limit" name="Budget" fill="#8884d8" />
                        <Bar dataKey="spent" name="Actual" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Area chart - Spending trend */}
                <div className="bg-green-50 p-4 rounded-lg md:col-span-2">
                  <h3 className="text-green-800 font-medium mb-2">Spending Trend Analysis</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getDailyData()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                        <Area type="monotone" dataKey="amount" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Monthly Budget Details - conditionally displayed */}
          {hasExpenses && showCategoryBudgets && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-green-800">{currentMonth} Budget Overview</h2>
                <div className="text-green-500 text-sm flex items-center">
                  <span className="mr-2">Month</span>
                  <select 
                    className="p-1 border border-green-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option>April 2025</option>
                    <option>March 2025</option>
                    <option>February 2025</option>
                  </select>
                </div>
              </div>
              
              {/* Current Month Expenses Section */}
              <div className="mb-6">
                <h3 className="text-green-800 font-medium mb-3">Current Month Expenses</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-green-100">
                        <th className="text-left py-2 text-green-600 font-medium">Category</th>
                        <th className="text-left py-2 text-green-600 font-medium">Amount</th>
                        <th className="text-left py-2 text-green-600 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses
                        .filter(expense => {
                          // Filter for current month
                          const expenseMonth = new Date(expense.date).getMonth();
                          const currentMonthIndex = new Date().getMonth();
                          return expenseMonth === currentMonthIndex;
                        })
                        .map((expense) => (
                          <tr key={expense.id} className="border-b border-green-50">
                            <td className="py-3 text-green-800">{expense.category}</td>
                            <td className="py-3 text-green-800">₹{expense.amount.toFixed(2)}</td>
                            <td className="py-3 text-green-800">{expense.date}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Month total visualization */}
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-green-800 font-medium">Total Monthly Budget</span>
                  <span className="text-green-800">₹{totalSpent.toFixed(2)} / ₹{totalBudget.toFixed(2)}</span>
                </div>
                
                <div className="w-full bg-green-100 rounded-full h-4 mb-2">
                  <div 
                    className="bg-green-500 h-4 rounded-full" 
                    style={{ width: `${calculatePercentage(totalSpent, totalBudget)}%` }}
                  ></div>
                </div>
                
                <div className="text-sm text-green-600">
                  ₹{Math.max(totalBudget - totalSpent, 0).toFixed(2)} remaining this month
                </div>
              </div>
              
              {/* Category breakdowns */}
              <h3 className="text-green-800 font-medium mb-3">Category Breakdown</h3>
              
              {budgets.map((budget, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-1">
                  <span className="text-green-800">{budget.category}</span>
                    <span className="text-green-800">₹{budget.spent.toFixed(2)} / ₹{budget.limit.toFixed(2)}</span>
                  </div>
                  
                  <div className="w-full bg-green-100 rounded-full h-3 mb-1">
                    <div 
                      className={`h-3 rounded-full ${budget.spent > budget.limit ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${calculatePercentage(budget.spent, budget.limit)}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-green-600">
                    {budget.spent > budget.limit 
                      ? `Over budget by ₹${(budget.spent - budget.limit).toFixed(2)}` 
                      : `₹${(budget.limit - budget.spent).toFixed(2)} remaining`}
                  </div>
                </div>
              ))}
              
              {/* Add Category Button */}
              <div className="text-center mt-6">
                <button 
                  className="bg-green-100 text-green-700 py-2 px-4 rounded-md inline-flex items-center hover:bg-green-200 transition-colors"
                  onClick={toggleAddCategoryForm}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Category
                </button>
              </div>
              
              {/* Add Category Form */}
              {showAddCategoryForm && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="text-green-800 font-medium mb-3">Add New Budget Category</h4>
                  <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-green-600 text-sm mb-1">Category Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-green-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300"
                        value={newCategory.category}
                        onChange={(e) => setNewCategory({...newCategory, category: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-green-600 text-sm mb-1">Monthly Budget Limit (₹)</label>
                      <input 
                        type="number" 
                        className="w-full p-2 border border-green-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300"
                        value={newCategory.limit}
                        onChange={(e) => setNewCategory({...newCategory, limit: e.target.value})}
                        required
                        min="1"
                      />
                    </div>
                    
                    <div className="md:col-span-2 flex justify-end space-x-2">
                      <button 
                        type="button"
                        onClick={toggleAddCategoryForm}
                        className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Add Category
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
          
          {/* Expense Form */}
          <div id="expense-form" className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-medium text-green-800 mb-4">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            
            <form onSubmit={handleExpenseSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-green-600 text-sm mb-1">Category</label>
                <select 
                  className="w-full p-2 border border-green-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  required
                >
                  {budgets.map((budget, index) => (
                    <option key={index} value={budget.category}>{budget.category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-green-600 text-sm mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border border-green-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  placeholder="0.00"
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-green-600 text-sm mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border border-green-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="md:col-span-3 flex justify-end space-x-2">
                {editingExpense && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingExpense(null);
                      setNewExpense({
                        category: "Groceries",
                        amount: "",
                        date: new Date().toISOString().slice(0, 10)
                      });
                    }}
                    className="px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-50"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Right column - expenses list */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-green-800">Recent Expenses</h2>
              <span className="text-green-500 text-sm">{expenses.length} entries</span>
            </div>
            
            {/* Expenses list */}
            {expenses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-green-600">No expenses recorded yet.</p>
                <p className="text-green-500 text-sm">Add your first expense to get started!</p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-96">
                {expenses.map((expense) => (
                  <div key={expense.id} className="p-3 border-b border-green-100 hover:bg-green-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-green-800">{expense.category}</div>
                        <div className="text-sm text-green-600">{expense.date}</div>
                      </div>
                      <div className="font-medium text-green-800">₹{expense.amount.toFixed(2)}</div>
                    </div>
                    
                    <div className="flex justify-end mt-2 gap-2">
                      <button 
                        onClick={() => handleEditExpense(expense)}
                        className="text-blue-500 text-sm hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Monthly Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-medium text-green-800 mb-4">Budget Status</h2>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-green-800">Total Expenses</span>
                <span className="font-medium text-green-800">₹{totalSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-green-800">Monthly Budget</span>
                <span className="font-medium text-green-800">₹{totalBudget.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-green-800">Remaining</span>
                <span className={`font-medium ${totalBudget - totalSpent < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{(totalBudget - totalSpent).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="pt-3 border-t border-green-100">
              <div className="flex justify-between mb-1">
                <span className="text-green-800 font-medium">Budget Used</span>
                <span className="text-green-800">{calculatePercentage(totalSpent, totalBudget)}%</span>
              </div>
              <div className="w-full bg-green-100 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${totalSpent > totalBudget ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${calculatePercentage(totalSpent, totalBudget)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Budget Tips */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-medium text-green-800 mb-3">Budget Tips</h2>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-green-700">Try the 50/30/20 rule - spend 50% on needs, 30% on wants, and save 20%.</p>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-green-700">Look for categories where you're consistently over budget and find ways to reduce spending.</p>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-green-700">Record expenses daily instead of weekly to maintain better awareness of your spending.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTrackingPage;