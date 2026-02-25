import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const orders = [
  { id: 'ORD-001', customer: 'John Smith', product: 'iPhone 15 Pro', amount: 999, status: 'Completed', date: '2024-05-15' },
  { id: 'ORD-002', customer: 'Sarah Johnson', product: 'MacBook Air M3', amount: 1299, status: 'Processing', date: '2024-05-16' },
  { id: 'ORD-003', customer: 'Mike Brown', product: 'iPad Pro 12.9', amount: 1099, status: 'Pending', date: '2024-05-17' },
  { id: 'ORD-004', customer: 'Emily Davis', product: 'AirPods Pro', amount: 249, status: 'Completed', date: '2024-05-18' },
  { id: 'ORD-005', customer: 'David Wilson', product: 'Apple Watch Ultra', amount: 799, status: 'Cancelled', date: '2024-05-19' },
];

export default function OrdersPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">订单列表</h1>
        <div className="flex items-center gap-2 text-sm text-[#6c757d] mt-1">
          <a href="/" className="hover:text-[#007bff]">Home</a>
          <span>/</span>
          <span>订单列表</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded shadow-sm border border-[#dee2e6]">
        <div className="border-b border-[#dee2e6] p-4 flex items-center justify-between">
          <h3 className="font-semibold">订单管理</h3>
          <button className="px-4 py-2 bg-[#007bff] text-white rounded text-sm hover:bg-[#0056b3]">
            创建订单
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">订单号</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">客户</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">产品</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">金额</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">状态</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">日期</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[#dee2e6] hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                  <td className="px-4 py-3 text-sm">{order.customer}</td>
                  <td className="px-4 py-3 text-sm text-[#6c757d]">{order.product}</td>
                  <td className="px-4 py-3 text-sm">${order.amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6c757d]">{order.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 text-[#6c757d] hover:bg-gray-100 rounded">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-[#007bff] hover:bg-blue-50 rounded">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-[#dc3545] hover:bg-red-50 rounded">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
