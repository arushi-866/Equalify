import React from 'react';

const RecentActivity = ({ activities, onAddNewExpense }) => {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-medium text-gray-700 mb-3">Recent Activities</h3>
      <div className="bg-white rounded-lg p-4">
        {activities && activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity._id} className="flex justify-between items-center py-3 border-b last:border-0">
              <div>
                <p className="font-medium text-gray-800">{activity.description}</p>
                <p className="text-sm text-gray-500">
                  {activity.date ? new Date(activity.date).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
              </div>
              <span className="font-semibold text-lg">₹{activity.amount}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>No recent activities</p>
            <button 
              onClick={onAddNewExpense} 
              className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
            >
              Add New Expense
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
