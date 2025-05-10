// SetBudgetModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@/components/ui/button';

export default function SetBudgetModal({ isOpen, onClose, onSubmit }) {
  const [budget, setBudget] = useState('');

  const handleSubmit = () => {
    if (budget && !isNaN(budget)) {
      onSubmit(parseFloat(budget));
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />

        <Dialog.Panel className="relative bg-white p-6 rounded-2xl shadow-lg w-full max-w-md z-10">
          <Dialog.Title className="text-2xl font-bold mb-4 text-center text-gray-800">
            Set Monthly Budget
          </Dialog.Title>

          <input
            type="number"
            placeholder="Enter your budget in ₹"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Set Budget
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
