import { ShoppingCartIcon, ArrowTrendingUpIcon, UserPlusIcon, UsersIcon } from '@heroicons/react/24/solid';
import StatsCard from '@/components/StatsCard';
import SalesChart from '@/components/SalesChart';
import DirectChat from '@/components/DirectChat';
import TodoList from '@/components/TodoList';
import VisitorsMap from '@/components/VisitorsMap';
import SalesGraph from '@/components/SalesGraph';
import Calendar from '@/components/Calendar';

export default function Dashboard() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">控制台</h1>
        <div className="flex items-center gap-2 text-sm text-[#6c757d] mt-1">
          <a href="#" className="hover:text-[#007bff]">首页</a>
          <span>/</span>
          <span>控制台</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="新订单"
          value={150}
          icon={<ShoppingCartIcon className="w-6 h-6 text-white" />}
          color="blue"
          trend={{ value: '较上周增长 17%', positive: true }}
        />
        <StatsCard
          title="跳出率"
          value="53%"
          icon={<ArrowTrendingUpIcon className="w-6 h-6 text-white" />}
          color="green"
          trend={{ value: '较上周增长 2%', positive: false }}
        />
        <StatsCard
          title="用户注册"
          value={44}
          icon={<UserPlusIcon className="w-6 h-6 text-white" />}
          color="yellow"
          trend={{ value: '较上月增长 69%', positive: true }}
        />
        <StatsCard
          title="独立访客"
          value={65}
          icon={<UsersIcon className="w-6 h-6 text-white" />}
          color="red"
          trend={{ value: '较上周下降 20%', positive: false }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <SalesChart />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DirectChat />
            <TodoList />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <VisitorsMap />
          <SalesGraph />
          <Calendar />
        </div>
      </div>
    </div>
  );
}
