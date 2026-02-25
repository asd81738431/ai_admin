'use client';

export default function VisitorsMap() {
  const countries = [
    { name: '美国', visitors: 2348, percentage: 40 },
    { name: '印度', visitors: 1245, percentage: 21 },
    { name: '中国', visitors: 856, percentage: 15 },
    { name: '德国', visitors: 520, percentage: 9 },
    { name: '巴西', visitors: 312, percentage: 5 },
  ];

  return (
    <div className="bg-white rounded shadow-sm border border-[#dee2e6]">
      <div className="border-b border-[#dee2e6] p-4">
        <h3 className="font-semibold">访客统计</h3>
      </div>
      <div className="p-4">
        {/* Simple world map representation */}
        <div className="relative h-40 mb-4 bg-gray-50 rounded overflow-hidden">
          <svg viewBox="0 0 800 400" className="w-full h-full">
            {/* Simplified world map outline */}
            <path
              d="M150,120 Q200,80 250,100 T350,90 Q400,70 450,100 T550,80 Q600,100 650,90 Q700,110 750,100 L750,250 Q700,280 650,260 T550,280 Q500,300 450,270 T350,290 Q300,270 250,280 T150,260 Q100,240 100,200 T150,120 Z"
              fill="#e9ecef"
              stroke="#dee2e6"
              strokeWidth="2"
            />
            {/* Dots representing visitors */}
            <circle cx="180" cy="150" r="8" fill="#007bff" opacity="0.8" />
            <circle cx="550" cy="140" r="6" fill="#007bff" opacity="0.6" />
            <circle cx="650" cy="180" r="5" fill="#007bff" opacity="0.5" />
            <circle cx="450" cy="200" r="7" fill="#007bff" opacity="0.7" />
            <circle cx="280" cy="180" r="4" fill="#007bff" opacity="0.4" />
          </svg>
          <div className="absolute top-2 right-2 text-xs text-[#6c757d]">
            实时
          </div>
        </div>

        {/* Country list */}
        <div className="space-y-3">
          {countries.map((country) => (
            <div key={country.name} className="flex items-center gap-3">
              <span className="text-sm w-16">{country.name}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#007bff] rounded-full"
                  style={{ width: `${country.percentage}%` }}
                />
              </div>
              <span className="text-sm text-[#6c757d] w-16 text-right">
                {country.visitors.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
