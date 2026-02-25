"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ProductModel {
  id: number;
  name: string;
  category: string;
  amount: number;
  num: number;
  status: string;
  createdAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载产品数据
  async function loadProducts() {
    setLoading(true);
    const res = await fetch('/api/product');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  // 页面加载时获取产品
  useEffect(() => {
    loadProducts();
  }, []);

  // 删除产品
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该产品吗？')) return;

    const res = await fetch('/api/product', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setProducts(products.filter(product => product.id !== id));
    } else {
      alert('删除失败');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">产品列表</h1>
        <div className="flex items-center gap-2 text-sm text-[#6c757d] mt-1">
          <a href="/" className="hover:text-[#007bff]">Home</a>
          <span>/</span>
          <span>产品列表</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded shadow-sm border border-[#dee2e6]">
        <div className="border-b border-[#dee2e6] p-4 flex items-center justify-between">
          <h3 className="font-semibold">产品管理</h3>
          <button
            onClick={() => router.push('/products/edit')}
            className="px-4 py-2 bg-[#007bff] text-white rounded text-sm hover:bg-[#0056b3] flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" />
            添加产品
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">产品名称</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">分类</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">价格</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">库存</th>
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#6c757d]">
                    暂无数据
                  </td>
                </tr>
              ) : (
                products.map((product: ProductModel) => (
                  <tr key={product.id} className="border-t border-[#dee2e6] hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{product.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-[#6c757d]">{product.category}</td>
                    <td className="px-4 py-3 text-sm">¥{product.amount}</td>
                    <td className="px-4 py-3 text-sm">{product.num}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? '上架' : '下架'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6c757d]">{product.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/products/edit?id=${product.id}`)}
                          className="p-1 text-[#007bff] hover:bg-blue-50 rounded"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
