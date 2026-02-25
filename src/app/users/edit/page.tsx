'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface UserFormData {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export default function UserEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!userId);
  const [error, setError] = useState('');

  // 如果是编辑模式，获取用户信息
  useEffect(() => {
    if (userId) {
      fetch(`/api/user?id=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setFormData({
              name: data.name || '',
              email: data.email || '',
              password: '', // 不显示密码
              role: data.role || 'user',
              status: data.status || 'active',
            });
          }
          setInitialLoading(false);
        })
        .catch(() => setInitialLoading(false));
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const method = userId ? 'PUT' : 'POST';
      const url = '/api/user';

      // 添加 id 到请求体
      const submitData = userId
        ? { ...formData, id: parseInt(userId) }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        router.push('/users');
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
        <h1 className="text-2xl font-bold">{userId ? '编辑用户' : '添加用户'}</h1>
        <div className="flex items-center gap-2 text-sm text-[#6c757d] mt-1">
          <a href="/" className="hover:text-[#007bff]">Home</a>
          <span>/</span>
          <a href="/users" className="hover:text-[#007bff]">用户列表</a>
          <span>/</span>
          <span>{userId ? '编辑用户' : '添加用户'}</span>
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
            {/* 姓名 */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
                placeholder="请输入姓名"
              />
            </div>

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
                placeholder="请输入邮箱"
              />
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                密码 {userId ? '' : <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!userId}
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
                placeholder={userId ? '留空表示不修改密码' : '请输入密码'}
              />
            </div>

            {/* 角色 */}
            <div>
              <label className="block text-sm font-medium text-[#6c757d] mb-1">
                角色 <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
              >
                <option value="user">普通用户</option>
                <option value="admin">管理员</option>
                <option value="editor">编辑</option>
              </select>
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
                <option value="active">启用</option>
                <option value="inactive">禁用</option>
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
              onClick={() => router.push('/users')}
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
