import React from 'react';
import { ChartData } from '../../../types/dashboard';

interface ClassWiseChartProps {
  data: ChartData[];
}

const ClassWiseChart: React.FC<ClassWiseChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Class-wise Student Count</h3>
        <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="hidden sm:inline">Students</span>
        </div>
      </div>
      
      <div className="h-48 lg:h-64 flex items-end justify-between space-x-1">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 group">
            <div className="relative w-full">
              <div
                className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-500 ease-out hover:from-purple-600 hover:to-purple-500 cursor-pointer"
                style={{ 
                  height: `${(item.value / maxValue) * 180}px`,
                  minHeight: '20px'
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {item.value} students
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs font-medium text-gray-600 transform -rotate-45 origin-center">
              {item.name}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs lg:text-sm">
          <span className="text-gray-600">Total Students</span>
          <span className="font-semibold text-purple-600">{data.reduce((sum, item) => sum + item.value, 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default ClassWiseChart;