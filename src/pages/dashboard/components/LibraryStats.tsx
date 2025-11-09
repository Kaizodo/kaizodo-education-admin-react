import React from 'react';
import { Book, BookOpen, RotateCcw, Plus } from 'lucide-react';

interface LibraryStatsProps {
  stats: {
    totalBooks: number;
    issuedBooks: number;
    returnedToday: number;
    newArrivals: number;
    popularBooks: Array<{
      title: string;
      issued: number;
    }>;
  };
}

const LibraryStats: React.FC<LibraryStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Library Statistics</h3>
        <Book className="w-5 h-5 text-blue-500" />
      </div>

      {/* Stats Grid */}
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <Book className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg lg:text-xl font-bold text-gray-900">{(stats.totalBooks ?? 0).toLocaleString()}</div>
          <div className="text-xs text-gray-600">Total Books</div>
        </div>

        <div className="text-center p-3 bg-green-50 rounded-lg">
          <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-lg lg:text-xl font-bold text-gray-900">{(stats.issuedBooks ?? 0).toLocaleString()}</div>
          <div className="text-xs text-gray-600">Issued</div>
        </div>

        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <RotateCcw className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-lg lg:text-xl font-bold text-gray-900">{stats.returnedToday ?? 0}</div>
          <div className="text-xs text-gray-600">Returned Today</div>
        </div>

        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Plus className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-lg lg:text-xl font-bold text-gray-900">{stats.newArrivals ?? 0}</div>
          <div className="text-xs text-gray-600">New Arrivals</div>
        </div>
      </div>


      {/* Popular Books */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Most Issued Books</h4>
        <div className="space-y-2">
          {stats.popularBooks.map((book, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-xs lg:text-sm text-gray-700 truncate flex-1 mr-2">{book.title}</span>
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {book.issued}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryStats;