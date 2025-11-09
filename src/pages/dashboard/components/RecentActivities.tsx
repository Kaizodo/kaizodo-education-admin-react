import React from 'react';
import { Users, CreditCard, GraduationCap, Calendar, Bell } from 'lucide-react';
import { Activity } from '../../types/dashboard';

interface RecentActivitiesProps {
  activities: Activity[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'student': return Users;
    case 'fee': return CreditCard;
    case 'teacher': return GraduationCap;
    case 'event': return Calendar;
    case 'announcement': return Bell;
    default: return Bell;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'student': return 'bg-blue-100 text-blue-600';
    case 'fee': return 'bg-green-100 text-green-600';
    case 'teacher': return 'bg-purple-100 text-purple-600';
    case 'event': return 'bg-orange-100 text-orange-600';
    case 'announcement': return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getStatusBadge = (status?: string) => {
  if (!status) return null;
  
  const statusStyles = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Recent Activities</h3>
        <button className="text-xs lg:text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-3 lg:space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const IconComponent = getActivityIcon(activity.type);
          
          return (
            <div key={activity.id} className="flex items-start space-x-3 lg:space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)} flex-shrink-0`}>
                <IconComponent className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-xs lg:text-sm text-gray-600 mb-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-xs lg:text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
          Load More Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivities;