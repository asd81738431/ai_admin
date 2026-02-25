'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!loggedIn && pathname !== '/login') {
        router.push('/login');
      } else if (loggedIn && pathname === '/login') {
        router.push('/');
      }
    }
  }, [isClient, pathname, router]);

  // 如果不在客户端，直接返回空（避免闪烁）
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9]">
        <div className="text-[#007bff]">加载中...</div>
      </div>
    );
  }

  // 检查登录状态
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';

  // 登录页不需要布局
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // 未登录不显示内容
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9]">
        <div className="text-[#007bff]">正在跳转到登录...</div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <Navbar />
      <main className="ml-[250px] pt-[57px] pb-[57px] min-h-screen p-6 pr-12">
        {children}
      </main>
      <ChatWidget />
      <Footer />
    </>
  );
}
