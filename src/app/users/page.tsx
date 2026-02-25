import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { GetUsers } from "../../../api/web_api/api/user";
import { UserModel } from "../../../api/web_api/model/user";

export default async function UsersPage() {
  const res = await GetUsers();
  const users = await res.json();

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
          <button className="px-4 py-2 bg-[#007bff] text-white rounded text-sm hover:bg-[#0056b3]">
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
              {users.map((user: UserModel) => (
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
