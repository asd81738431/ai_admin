"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface OrderModel {
  id: number;
  order_num: string;
  user_id: number;
  user_name: string;
  amount: string;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载订单数据
  async function loadOrders() {
    setLoading(true);
    const res = await fetch('/api/order');
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }

  // 页面加载时获取订单
  useEffect(() => {
    loadOrders();
  }, []);

  // 删除订单
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该订单吗？')) return;

    const res = await fetch('/api/order', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setOrders(orders.filter(order => order.id !== id));
    } else {
      alert('删除失败');
    }
  };

  // 状态显示映射
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      active: '进行中',
      completed: '已完成',
      cancelled: '已取消',
      pending: '待处理',
    };
    return statusMap[status] || status;
  };

  // 状态样式映射
  const getStatusClass = (status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

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
          <button
            onClick={() => router.push('/orders/edit')}
            className="px-4 py-2 bg-[#007bff] text-white rounded text-sm hover:bg-[#0056b3] flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" />
            创建订单
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">订单号</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">用户ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">用户名</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">金额</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">状态</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">创建时间</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#6c757d]">
                    加载中...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#6c757d]">
                    暂无数据
                  </td>
                </tr>
              ) : (
                orders.map((order: OrderModel) => (
                  <tr key={order.id} className="border-t border-[#dee2e6] hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{order.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{order.order_num}</td>
                    <td className="px-4 py-3 text-sm">{order.user_id}</td>
                    <td className="px-4 py-3 text-sm text-[#6c757d]">{order.user_name}</td>
                    <td className="px-4 py-3 text-sm">¥{order.amount}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusClass(order.status)}`}>
                        {getStatusDisplay(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6c757d]">{order.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/orders/edit?id=${order.id}`)}
                          className="p-1 text-[#007bff] hover:bg-blue-50 rounded"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1 text-[#dc3545] hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
