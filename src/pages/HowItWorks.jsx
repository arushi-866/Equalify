import React from 'react';

export default function HowItWorks() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 lg:px-12 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-center mb-6">How It Works</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-8">
        Equalify makes expense sharing easy and fair. Follow these simple steps to get started.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-3">1. Sign Up</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Create an account in minutes and set up your profile. Start adding your friends and family to begin tracking expenses together.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Expenses
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Record expenses as they happen. Assign payments to friends and family seamlessly.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Settle Up
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Settle debts with friends easily using various payment methods, and never worry about uneven expenses again.
          </p>
        </div>
      </div>
    </div>
  );
} 
