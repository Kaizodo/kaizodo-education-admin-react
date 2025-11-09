import React from 'react';
import { ChartData } from '../../../types/dashboard';

interface SubjectPerformanceProps {
  data: ChartData[];
}

const SubjectPerformance: React.FC<SubjectPerformanceProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Subject-wise Performance</h3>
        <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
          <span className="hidden sm:inline">Average %</span>
        </div>
      </div>
      
      <div className="space-y-3 lg:space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 lg:space-x-4">
            <div className="w-20 lg:w-24 text-xs lg:text-sm font-medium text-gray-600 truncate">{item.name}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="w-10 lg:w-12 text-xs lg:text-sm font-medium text-gray-900 text-right">
              {item.value}%
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs lg:text-sm">
          <span className="text-gray-600">Overall Average</span>
          <span className="font-semibold text-indigo-600">
            {(data.reduce((sum, item) => sum + item.value, 0) / data.length).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubjectPerformance;