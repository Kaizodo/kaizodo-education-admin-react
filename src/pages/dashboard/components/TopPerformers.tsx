import React from 'react';
import { Award, TrendingUp } from 'lucide-react';
import { Student } from '../../types/dashboard';

interface TopPerformersProps {
  students: Student[];
}

const TopPerformers: React.FC<TopPerformersProps> = ({ students }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Top Performers</h3>
        <Award className="w-5 h-5 text-yellow-500" />
      </div>
      
      <div className="space-y-3 lg:space-y-4">
        {students.map((student, index) => (
          <div key={student.id} className="flex items-center space-x-3 lg:space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                index === 0 ? 'bg-yellow-500' : 
                index === 1 ? 'bg-gray-400' : 
                index === 2 ? 'bg-amber-600' : 'bg-blue-500'
              }`}>
                {index + 1}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {student.name}
                </p>
                <div className="flex items-center space-x-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.grade === 'A+' ? 'bg-green-100 text-green-800' :
                    student.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.grade}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">Class {student.class}</p>
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>{student.attendance}% attendance</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-xs lg:text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
          View All Students
        </button>
      </div>
    </div>
  );
};

export default TopPerformers;