import React from 'react';
import { ChartData } from '../../../types/dashboard';

interface GradeDistributionProps {
  data: ChartData[];
}

const gradeColors = [
  '#10B981', // Green for A+
  '#3B82F6', // Blue for A
  '#F59E0B', // Yellow for B+
  '#F97316', // Orange for B
  '#EF4444', // Red for C+
  '#DC2626'  // Dark red for C
];

const GradeDistribution: React.FC<GradeDistributionProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Grade Distribution</h3>
        <span className="text-xs lg:text-sm text-gray-600">Total: {total} students</span>
      </div>
      
      {/* Donut Chart */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32 lg:w-40 lg:h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = data
                .slice(0, index)
                .reduce((offset, prevItem) => offset - (prevItem.value / total) * 100, 0);
              
              return (
                <circle
                  key={index}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke={gradeColors[index]}
                  strokeWidth="2"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-xs lg:text-sm text-gray-600">Students</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: gradeColors[index] }}
            ></div>
            <span className="text-xs lg:text-sm text-gray-600 flex-1">{item.name}</span>
            <span className="text-xs lg:text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradeDistribution;