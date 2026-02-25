'use client';

import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red';
  trend?: {
    value: string;
    positive: boolean;
  };
}

const colorClasses = {
  blue: {
    bg: 'bg-[#17a2b8]',
    text: 'text-[#17a2b8]',
    iconBg: 'bg-[#17a2b8]',
  },
  green: {
    bg: 'bg-[#28a745]',
    text: 'text-[#28a745]',
    iconBg: 'bg-[#28a745]',
  },
  yellow: {
    bg: 'bg-[#ffc107]',
    text: 'text-[#ffc107]',
    iconBg: 'bg-[#ffc107]',
  },
  red: {
    bg: 'bg-[#dc3545]',
    text: 'text-[#dc3545]',
    iconBg: 'bg-[#dc3545]',
  },
};

export default function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded shadow-sm border border-[#dee2e6] p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#6c757d] font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend.positive ? 'text-[#28a745]' : 'text-[#dc3545]'}`}>
              {trend.positive ? (
                <ArrowUpIcon className="w-4 h-4" />
              ) : (
                <ArrowDownIcon className="w-4 h-4" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`${colors.iconBg} p-3 rounded`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
