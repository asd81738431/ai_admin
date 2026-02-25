'use client';

import { HomeIcon, EnvelopeIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon, BellIcon, FlagIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  return (
    <nav className="navbar bg-white border-b border-[#dee2e6] flex items-center justify-between px-4 fixed top-0 right-0 left-[250px] z-40">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded">
          <Bars3Icon className="w-5 h-5 text-[#6c757d]" />
        </button>
        <a href="#" className="flex items-center gap-1 text-[#007bff] hover:text-[#0056b3]">
          <HomeIcon className="w-4 h-4" />
          <span>首页</span>
        </a>
        <a href="#" className="flex items-center gap-1 text-[#6c757d] hover:text-[#007bff]">
          <EnvelopeIcon className="w-4 h-4" />
          <span>联系</span>
        </a>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="搜索..."
            className="pl-8 pr-4 py-1.5 border border-[#dee2e6] rounded text-sm w-48 focus:outline-none focus:border-[#007bff]"
          />
          <MagnifyingGlassIcon className="w-4 h-4 text-[#6c757d] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Messages */}
        <button className="relative p-2 hover:bg-gray-100 rounded">
          <ChatBubbleLeftIcon className="w-5 h-5 text-[#6c757d]" />
          <span className="absolute -top-1 -right-1 bg-[#007bff] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded">
          <BellIcon className="w-5 h-5 text-[#6c757d]" />
          <span className="absolute -top-1 -right-1 bg-[#dc3545] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">15</span>
        </button>

        {/* Flag */}
        <button className="p-2 hover:bg-gray-100 rounded">
          <FlagIcon className="w-5 h-5 text-[#6c757d]" />
        </button>
      </div>
    </nav>
  );
}
