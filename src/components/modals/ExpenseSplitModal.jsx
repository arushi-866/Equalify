import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function ExpenseSplitModal({ isOpen, onClose, onSubmit, currentUser }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [participants, setParticipants] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/friends', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setAvailableUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!title || !amount || !participants) {
      alert('Please fill all required fields');
      return;
    }

    if (!currentUser || !currentUser._id) {
      alert('User session invalid. Please login again.');
      return;
    }

    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      // Parse emails/usernames to find user IDs
      const participantEmails = participants.split(',').map(email => email.trim());
      let participantUsers = [];
      
      // Simple validation
      if (participantEmails.length === 0) {
        alert('Please enter at least one participant');
        setLoading(false);
        return;
      }

      // Find users by email/username
      for (const email of participantEmails) {
        // You might need a separate API endpoint to lookup users by email
        try {
          const userResponse = await axios.get(`http://localhost:5000/api/users/lookup?email=${email}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (userResponse.data) {
            participantUsers.push(userResponse.data);
          } else {
            alert(`User not found: ${email}`);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error(`Error looking up user ${email}:`, err);
          alert(`Could not find user with email: ${email}`);
          setLoading(false);
          return;
        }
      }

      // Calculate split amount
      const splitAmount = parseFloat(amount) / participantUsers.length;

      // Create expense payload
      const expensePayload = {
        description: title, // Using description as the backend expects it
        amount: parseFloat(amount),
        paidBy: currentUser._id,
        participants: participantUsers.map(user => ({
          user: user._id,
          amount: splitAmount,
          settled: false
        }))
      };

      // Submit expense
      const response = await axios.post(
        'http://localhost:5000/api/expenses',
        expensePayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        // Format for UI
        const createdExpense = {
          id: response.data._id || response.data.data._id,
          title: title,
          amount: parseFloat(amount),
          participants: participantUsers.map(user => user.name || user.email)
        };

        onSubmit(createdExpense);
        resetForm();
        onClose();
      }
    } catch (err) {
      console.error('Error creating expense:', err);
      alert('Failed to create expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setParticipants('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
          <Dialog.Title className="text-xl font-semibold mb-4">Split Expense</Dialog.Title>

          <input
            type="text"
            placeholder="Expense Title"
            className="w-full mb-3 p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            className="w-full mb-3 p-2 border rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Available Friends</label>
            <select 
              className="w-full mb-2 p-2 border rounded"
              onChange={(e) => {
                const email = e.target.value;
                if (email && !participants.includes(email)) {
                  setParticipants(prev => prev ? `${prev}, ${email}` : email);
                }
              }}
              value=""
            >
              <option value="">Select users to add</option>
              {availableUsers.map(user => (
                <option key={user._id} value={user.email}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Participants (comma-separated emails)"
            className="w-full mb-4 p-2 border rounded"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : 'Split'}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}