import React, { useState } from 'react';
import AddExpenseModal from './modals/AddExpenseModal';

export default function ParentComponent() {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddExpenseSplit = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary-600 text-white px-4 py-2 rounded"
      >
        Add Expense
      </button>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddExpenseSplit={handleAddExpenseSplit}
      />

      <div className="mt-6">
        <h2 className="text-xl font-bold">Expenses</h2>
        <ul className="mt-4 space-y-2">
          {expenses.map((expense) => (
            <li key={expense.id} className="p-4 border rounded-lg">
              <p className="font-medium">{expense.title}</p>
              <p className="text-sm text-gray-600">
                Amount: {expense.amount} | Paid By: {expense.paidBy}
              </p>
              <p className="text-sm text-gray-600">Date: {expense.date}</p>
              <p className="text-sm text-gray-600">
                Participants: {expense.splitters.join(', ')}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}