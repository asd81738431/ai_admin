'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtVerify } from 'jose';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key-change-in-production'
);

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      if (!isClient) return;

      const token = localStorage.getItem('token');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      // 没有 token 或未登录，跳转登录页
      if (!token || !isLoggedIn) {
        if (pathname !== '/login') {
          router.push('/login');
        }
        setIsVerified(false);
        return;
      }

      // 验证 token
      const valid = await verifyToken(token);
      if (!valid) {
        // token 无效，清除并跳转登录
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        if (pathname !== '/login') {
          router.push('/login');
        }
        setIsVerified(false);
        return;
      }

      // token 有效
      if (pathname === '/login') {
        router.push('/');
      }
      setIsVerified(true);
    }

    checkAuth();
  }, [isClient, pathname, router]);

  // 如果不在客户端或未验证完成，直接返回空（避免闪烁）
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9]">
        <div className="text-[#007bff]">加载中...</div>
      </div>
    );
  }

  // 登录页不需要布局
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // token 验证未通过不显示内容
  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9]">
        <div className="text-[#007bff]">正在验证...</div>
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
