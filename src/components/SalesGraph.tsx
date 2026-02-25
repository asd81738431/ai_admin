'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: '周一', sales: 4500 },
  { day: '周二', sales: 3200 },
  { day: '周三', sales: 5800 },
  { day: '周四', sales: 4100 },
  { day: '周五', sales: 6700 },
  { day: '周六', sales: 3200 },
  { day: '周日', sales: 2800 },
];

export default function SalesGraph() {
  return (
    <div className="bg-white rounded shadow-sm border border-[#dee2e6]">
      <div className="border-b border-[#dee2e6] p-4">
        <h3 className="font-semibold">销售图表</h3>
      </div>
      <div className="p-4" style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
            <XAxis dataKey="day" stroke="#6c757d" fontSize={12} />
            <YAxis stroke="#6c757d" fontSize={12} />
            <Tooltip />
            <Bar dataKey="sales" fill="#007bff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
