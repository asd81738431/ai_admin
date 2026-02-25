'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  UserIcon,
  ShoppingCartIcon,
  CubeIcon,
  ArrowRightOnRectangleIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: '主导航',
    items: [
      { name: '首页', href: '/', icon: ChartPieIcon },
    ],
  },
  {
    title: '系统管理',
    items: [
      { name: '用户列表', href: '/users', icon: UserIcon },
      { name: '订单列表', href: '/orders', icon: ShoppingCartIcon },
      { name: '产品列表', href: '/products', icon: CubeIcon },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  return (
    <aside className="sidebar fixed left-0 top-0 bg-[#1a1a1a] text-white h-screen overflow-y-auto z-50">
      {/* Logo */}
      <div className="h-[57px] flex items-center justify-center border-b border-[#2d2d2d]">
        <Link href="/" className="text-xl font-bold tracking-wide">
          ADMIN<span className="text-[#007bff]">LTE</span>
        </Link>
      </div>

      {/* User Panel */}
      <div className="p-4 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#007bff] rounded-full flex items-center justify-center">
            <span className="font-bold">JS</span>
          </div>
          <div>
            <p className="font-semibold text-sm">管理员</p>
            <p className="text-xs text-[#6c757d]">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="pb-4">
        {navSections.map((section, idx) => (
          <div key={section.title} className={idx > 0 ? 'mt-4' : ''}>
            <p className="px-4 py-2 text-xs text-[#6c757d] uppercase tracking-wider font-semibold">
              {section.title}
            </p>
            <ul>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 hover:bg-[#2d2d2d] transition-colors ${
                        isActive ? 'border-l-4 border-[#007bff] bg-[#2d2d2d]' : ''
                      }`}
                    >
                      <item.icon className="w-5 h-5 text-[#6c757d]" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2d2d2d]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 w-full text-sm text-[#6c757d] hover:text-white hover:bg-[#2d2d2d] rounded"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          退出登录
        </button>
      </div>
    </aside>
  );
}
