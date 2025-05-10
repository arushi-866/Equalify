import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, ScaleIcon, CalendarIcon } from '@heroicons/react/24/outline';

const StatsSummary = ({ stats, isLoading }) => {
  const { totalOwed, totalOwe, netBalance, expenseThisMonth } = stats;
  
  // Animation variants for the stats cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Function to render a stat card with proper loading state
  const StatCard = ({ title, value, icon, textColor, bgColor, isLoading }) => (
    <motion.div 
      variants={cardVariants}
      className={`${bgColor} rounded-xl shadow-sm p-4 sm:p-6`}
    >
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
            <span className={`p-2 rounded-full ${bgColor}`}>
              {icon}
            </span>
          </div>
          <p className={`text-2xl font-bold ${textColor} mb-1`}>
            ₹{value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">
            {title === 'Net Balance' 
              ? value > 0 
                ? "You're owed money overall" 
                : value < 0 
                  ? "You owe money overall" 
                  : "All settled up!"
              : title === 'Total Expenses' 
                ? "For March 2025"
                : "View detailed breakdown"}
          </p>
        </>
      )}
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <StatCard
        title="People Owe You"
        value={totalOwed}
        icon={<ArrowDownIcon className="h-5 w-5 text-green-600" />}
        textColor="text-green-600"
        bgColor="bg-green-50"
        isLoading={isLoading}
      />
      
      <StatCard
        title="You Owe"
        value={totalOwe}
        icon={<ArrowUpIcon className="h-5 w-5 text-red-600" />}
        textColor="text-red-600"
        bgColor="bg-red-50"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Net Balance"
        value={netBalance}
        icon={<ScaleIcon className="h-5 w-5 text-indigo-600" />}
        textColor={netBalance >= 0 ? "text-green-600" : "text-red-600"}
        bgColor="bg-indigo-50"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Total Expenses"
        value={expenseThisMonth}
        icon={<CalendarIcon className="h-5 w-5 text-purple-600" />}
        textColor="text-purple-600"
        bgColor="bg-purple-50"
        isLoading={isLoading}
      />
    </motion.div>
  );
};

export default StatsSummary;