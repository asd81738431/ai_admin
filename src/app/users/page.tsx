"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface UserModel {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载用户数据
  async function loadUsers() {
    setLoading(true);
    const res = await fetch('/api/user');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  // 页面加载时获取用户
  useEffect(() => {
    loadUsers();
  }, []);

  // 删除用户
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该用户吗？')) return;

    const res = await fetch('/api/user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setUsers(users.filter(user => user.id !== id));
    } else {
      alert('删除失败');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">用户列表</h1>
        <div className="flex items-center gap-2 text-sm text-[#6c757d] mt-1">
          <a href="/" className="hover:text-[#007bff]">Home</a>
          <span>/</span>
          <span>用户列表</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded shadow-sm border border-[#dee2e6]">
        <div className="border-b border-[#dee2e6] p-4 flex items-center justify-between">
          <h3 className="font-semibold">用户管理</h3>
          <button
            onClick={() => router.push('/users/edit')}
            className="px-4 py-2 bg-[#007bff] text-white rounded text-sm hover:bg-[#0056b3]"
          >
            添加用户
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">姓名</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">邮箱</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">角色</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">状态</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">创建时间</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#6c757d]">
                    加载中...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#6c757d]">
                    暂无数据
                  </td>
                </tr>
              ) : (
                users.map((user: UserModel) => (
                <tr key={user.id} className="border-t border-[#dee2e6] hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{user.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-[#6c757d]">{user.email}</td>
                  <td className="px-4 py-3 text-sm">{user.role}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6c757d]">{user.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/users/edit?id=${user.id}`)}
                        className="p-1 text-[#007bff] hover:bg-blue-50 rounded"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1 text-[#dc3545] hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
