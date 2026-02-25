'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface OrderFormData {
  id?: number;
  order_num: string;
  user_id: string;
  user_name: string;
  amount: string;
  status: string;
}

export default function OrderEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const [formData, setFormData] = useState<OrderFormData>({
    order_num: '',
    user_id: '',
    user_name: '',
    amount: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!orderId);
  const [error, setError] = useState('');

  // 如果是编辑模式，获取订单信息
  useEffect(() => {
    if (orderId) {
      fetch(`/api/order?id=${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setFormData({
              order_num: data.order_num || '',
              user_id: data.user_id?.toString() || '',
              user_name: data.user_name || '',
              amount: data.amount || '',
              status: data.status || 'active',
            });
          }
          setInitialLoading(false);
        })
        .catch(() => setInitialLoading(false));
    }
  }, [orderId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const method = orderId ? 'PUT' : 'POST';
      const url = '/api/order';

      // 添加 id 到请求体
      const submitData = orderId
        ? { ...formData, id: parseInt(orderId) }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        router.push('/orders');
      } else {
        const data = await res.json();
        setError(data.error || '保存失败');
      }
    } catch {
      setError('请求失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9]">
        <div className="text-[#007bff]">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{orderId ? '编辑订单' : '创建订单'}</h1>
        <div className="flex items-center gap-2 text-sm text-[#6c757d] mt-1">
          <a href="/" className="hover:text-[#007bff]">Home</a>
          <span>/</span>
          <a href="/orders" className="hover:text-[#007bff]">订单列表</a>
          <span>/</span>
          <span>{orderId ? '编辑订单' : '创建订单'}</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded shadow-sm border border-[#dee2e6] p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 订单号 */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                订单号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="order_num"
                value={formData.order_num}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
                placeholder="请输入订单号"
              />
            </div>

            {/* 用户ID */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                用户ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
                placeholder="请输入用户ID"
              />
            </div>

            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                用户名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
                placeholder="请输入用户名"
              />
            </div>

            {/* 金额 */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                金额 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
                placeholder="请输入金额"
              />
            </div>

            {/* 状态 */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                状态 <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
              >
                <option value="active">进行中</option>
                <option value="pending">待处理</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#007bff] text-white rounded font-medium hover:bg-[#0056b3] transition-colors disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/orders')}
              className="px-6 py-2 border border-[#dee2e6] text-[#6c757d] rounded font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              返回
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
