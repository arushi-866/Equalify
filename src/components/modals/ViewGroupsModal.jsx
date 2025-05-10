import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function ViewGroupsModal({ isOpen, onClose, groups, onGroupClick }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Groups</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[60vh]">
              {groups.length === 0 ? (
                <div className="text-center py-8">
                  <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No groups created yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {groups.map(group => (
                    <motion.div
                      key={group.id}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="p-4 cursor-pointer"
                      onClick={() => onGroupClick(group)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-800">{group.name}</h4>
                          <p className="text-sm text-gray-500">
                            {group.members?.length || 0} members
                          </p>
                          {group.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {group.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">
                            ₹{group.totalExpenses || 0}
                          </p>
                          <p className="text-xs text-gray-500">
                          {groups.map((group) => (
  <div key={group._id}>
    <p>
      {group.createdAt
        ? new Date(group.createdAt).toLocaleString()
        : 'Date not available'}
    </p>
  </div>
))}

                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}