import React from 'react';
import { Bus, Route, Users, Wrench } from 'lucide-react';

interface TransportInfoProps {
  data: {
    totalBuses: number;
    activeRoutes: number;
    studentsUsingTransport: number;
    maintenanceScheduled: number;
  };
}

const TransportInfo: React.FC<TransportInfoProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Transport Management</h3>
        <Bus className="w-5 h-5 text-yellow-500" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <Bus className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-xl lg:text-2xl font-bold text-gray-900">{data.totalBuses}</div>
          <div className="text-xs text-gray-600">Total Buses</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Route className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-xl lg:text-2xl font-bold text-gray-900">{data.activeRoutes}</div>
          <div className="text-xs text-gray-600">Active Routes</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-xl lg:text-2xl font-bold text-gray-900">{data.studentsUsingTransport}</div>
          <div className="text-xs text-gray-600">Students</div>
        </div>
        
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <Wrench className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <div className="text-xl lg:text-2xl font-bold text-gray-900">{data.maintenanceScheduled}</div>
          <div className="text-xs text-gray-600">Maintenance</div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs lg:text-sm">
          <span className="text-gray-600">Transport Utilization</span>
          <span className="font-semibold text-yellow-600">
            {Math.round((data.studentsUsingTransport / 1284) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransportInfo;