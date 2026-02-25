'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const monthNames = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

const events = [
  { day: 5, title: '会议', color: 'bg-[#007bff]' },
  { day: 12, title: '截止日期', color: 'bg-[#dc3545]' },
  { day: 18, title: '大会', color: 'bg-[#28a745]' },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="bg-white rounded shadow-sm border border-[#dee2e6]">
      <div className="border-b border-[#dee2e6] p-4 flex items-center justify-between">
        <h3 className="font-semibold">日历</h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs text-[#6c757d] font-medium py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const event = events.find(e => e.day === day);
            const isToday = day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <div
                key={idx}
                className={`relative h-8 flex items-center justify-center text-sm ${
                  day === null ? '' : 'hover:bg-gray-50 cursor-pointer'
                } ${isToday ? 'bg-[#007bff] text-white rounded' : ''}`}
              >
                {day}
                {event && !isToday && (
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${event.color}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Events list */}
        <div className="mt-4 pt-4 border-t border-[#dee2e6] space-y-2">
          {events.map((event, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${event.color}`} />
              <span>{event.day}日: {event.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
