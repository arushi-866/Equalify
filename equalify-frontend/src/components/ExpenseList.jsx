import React from 'react';

const ExpenseList = ({ expenses }) => {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-3">Recent Expenses</h3>
      <div className="space-y-2">
        {expenses.map((expense) => (
          <div key={expense._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{expense.description}</h4>
                <p className="text-sm text-gray-600">
                  Paid by: {expense.paidBy.name || 'Unknown'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">₹{expense.amount}</p>
                <p className="text-sm text-gray-500">
                  {new Date(expense.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
