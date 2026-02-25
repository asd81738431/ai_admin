'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const areaData = [
  { name: '1月', sales: 4000, orders: 2400 },
  { name: '2月', sales: 3000, orders: 1398 },
  { name: '3月', sales: 2000, orders: 9800 },
  { name: '4月', sales: 2780, orders: 3908 },
  { name: '5月', sales: 1890, orders: 4800 },
  { name: '6月', sales: 2390, orders: 3800 },
  { name: '7月', sales: 3490, orders: 4300 },
];

const pieData = [
  { name: '桌面端', value: 60 },
  { name: '平板', value: 25 },
  { name: '移动端', value: 15 },
];

const COLORS = ['#007bff', '#28a745', '#dc3545'];

export default function SalesChart() {
  const [chartType, setChartType] = useState<'area' | 'donut'>('area');

  return (
    <div className="bg-white rounded shadow-sm border border-[#dee2e6]">
      <div className="border-b border-[#dee2e6] p-4 flex items-center justify-between">
        <h3 className="font-semibold">销售统计</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'area' ? 'bg-[#007bff] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            趋势图
          </button>
          <button
            onClick={() => setChartType('donut')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'donut' ? 'bg-[#007bff] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            饼图
          </button>
        </div>
      </div>
      <div className="p-4" style={{ height: '300px' }}>
        {chartType === 'area' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
              <XAxis dataKey="name" stroke="#6c757d" fontSize={12} />
              <YAxis stroke="#6c757d" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="sales" stroke="#007bff" fill="#007bff" fillOpacity={0.3} />
              <Area type="monotone" dataKey="orders" stroke="#28a745" fill="#28a745" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
