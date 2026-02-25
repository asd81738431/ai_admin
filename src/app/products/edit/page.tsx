'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ProductFormData {
  id?: number;
  name: string;
  category: string;
  amount: string;
  num: string;
  status: string;
}

export default function ProductEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    amount: '',
    num: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!productId);
  const [error, setError] = useState('');

  // 如果是编辑模式，获取产品信息
  useEffect(() => {
    if (productId) {
      fetch(`/api/product?id=${productId}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setFormData({
              name: data.name || '',
              category: data.category || '',
              amount: data.amount?.toString() || '',
              num: data.num?.toString() || '',
              status: data.status || 'active',
            });
          }
          setInitialLoading(false);
        })
        .catch(() => setInitialLoading(false));
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const method = productId ? 'PUT' : 'POST';
      const url = '/api/product';

      // 添加 id 到请求体
      const submitData = productId
        ? { ...formData, id: parseInt(productId) }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        router.push('/products');
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
        <h1 className="text-2xl font-bold">{productId ? '编辑产品' : '添加产品'}</h1>
        <div className="flex items-center gap-2 text-sm text-[#6c757d] mt-1">
          <a href="/" className="hover:text-[#007bff]">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-[#007bff]">产品列表</a>
          <span>/</span>
          <span>{productId ? '编辑产品' : '添加产品'}</span>
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
            {/* 产品名称 */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                产品名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
                placeholder="请输入产品名称"
              />
            </div>

            {/* 分类 */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                分类 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
                placeholder="请输入分类"
              />
            </div>

            {/* 价格 */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                价格 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
                placeholder="请输入价格"
              />
            </div>

            {/* 库存 */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                库存 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="num"
                value={formData.num}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
                placeholder="请输入库存数量"
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
                <option value="active">上架</option>
                <option value="inactive">下架</option>
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
              onClick={() => router.push('/products')}
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
