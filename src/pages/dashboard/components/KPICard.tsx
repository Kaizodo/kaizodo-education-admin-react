import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import * as Icons from 'lucide-react';
import { KPIData } from '../../types/dashboard';

interface KPICardProps {
  data: KPIData;
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200'
};

const KPICard: React.FC<KPICardProps> = ({ data }) => {
  const IconComponent = (Icons as any)[data.icon];
  
  const formatValue = (value: number | string) => {
    if (typeof value === 'number' && value >= 100000) {
      return (value / 100000).toFixed(1) + 'L';
    } else if (typeof value === 'number' && value >= 1000) {
      return (value / 1000).toFixed(0) + 'K';
    }
    return value.toString();
  };

  const getTrendIcon = () => {
    if (data.changeType === 'increase') return TrendingUp;
    if (data.changeType === 'decrease') return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (data.changeType === 'increase') return 'text-green-600';
    if (data.changeType === 'decrease') return 'text-red-600';
    return 'text-gray-600';
  };

  const TrendIcon = getTrendIcon();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 lg:p-3 rounded-lg border ${colorClasses[data.color]}`}>
          <IconComponent className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          <TrendIcon className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="text-xs lg:text-sm font-medium">{Math.abs(data.change)}%</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-gray-600 text-xs lg:text-sm font-medium">{data.title}</h3>
        <div className="flex items-baseline space-x-1">
          <span className="text-xl lg:text-2xl font-bold text-gray-900">
            {(data.title === 'Fee Collection' || data.title === 'Pending Fees') ? '₹' : ''}
            {formatValue(data.value)}
          </span>
          {data.suffix && (
            <span className="text-sm lg:text-lg text-gray-600">{data.suffix}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard;