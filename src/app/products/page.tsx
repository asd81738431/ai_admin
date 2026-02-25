import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const products = [
  { id: 1, name: 'iPhone 15 Pro', category: 'Phone', price: 999, stock: 45, status: 'In Stock', image: '📱' },
  { id: 2, name: 'MacBook Air M3', category: 'Laptop', price: 1299, stock: 20, status: 'In Stock', image: '💻' },
  { id: 3, name: 'iPad Pro 12.9', category: 'Tablet', price: 1099, stock: 0, status: 'Out of Stock', image: '📲' },
  { id: 4, name: 'AirPods Pro', category: 'Audio', price: 249, stock: 120, status: 'In Stock', image: '🎧' },
  { id: 5, name: 'Apple Watch Ultra', category: 'Watch', price: 799, stock: 35, status: 'In Stock', image: '⌚' },
];

export default function ProductsPage() {
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
          <button className="px-4 py-2 bg-[#007bff] text-white rounded text-sm hover:bg-[#0056b3] flex items-center gap-1">
            <PlusIcon className="w-4 h-4" />
            添加产品
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">产品</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">分类</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">价格</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">库存</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">状态</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#6c757d]">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-[#dee2e6] hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{product.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{product.image}</span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6c757d]">{product.category}</td>
                  <td className="px-4 py-3 text-sm">${product.price}</td>
                  <td className="px-4 py-3 text-sm">{product.stock}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
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
