import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

interface UpcomingEventsProps {
  events: any;
}

const getEventColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'cultural': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'academic': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'sports': return 'bg-green-100 text-green-800 border-green-200';
    case 'holiday': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {

  const navigate = useNavigate();


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Upcoming Events</h3>
        <Calendar className="w-5 h-5 text-blue-500" />
      </div>

      <div className="space-y-3">
        {events?.map((event: any) => (
          <div key={event.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {event.name}
                </p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventColor(event.type)}`}>
                  {event.type}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {moment(event.start_date).format("DD MMM YYYY")} to {moment(event.end_date).format("DD MMM YYYY")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2"   onClick={() => navigate('/events')}>
          View All Events
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;