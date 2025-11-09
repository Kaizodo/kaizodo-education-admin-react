import React from 'react';

interface AttendanceChartProps {
  data: any;
  title?: string;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data, title = "Weekly Attendance" }) => {
  const maxValue = Math.max(...data.map((d: any) => d.value));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      {/* Title and Legend */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="hidden sm:inline">Attendance Rate</span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3 lg:space-y-4">
        {data.map((item: any, index: number) => (
          <div key={index} className="flex items-center space-x-3 lg:space-x-4 min-w-0">
            <div className="w-12 flex-shrink-0 text-xs lg:text-sm font-medium text-gray-600 truncate">
              {item.name}
            </div>
            <div className="flex-1 min-w-0 bg-gray-200 rounded-full h-2 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="w-12 flex-shrink-0 text-xs lg:text-sm font-medium text-gray-900 text-right">
              {item.value > 0 ? `${item.value}%` : '0%'}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs lg:text-sm">
          <span className="text-gray-600">Average Attendance</span>
          <span className="font-semibold text-gray-900">94.2%</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
