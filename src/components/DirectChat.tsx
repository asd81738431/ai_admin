'use client';

interface Message {
  id: number;
  name: string;
  avatar: string;
  message: string;
  time: string;
  isOwn: boolean;
}

const messages: Message[] = [
  {
    id: 1,
    name: 'Alexander Pierce',
    avatar: 'AP',
    message: 'Is this template really for free? It is mentioned that it is...',
    time: '11:30 AM',
    isOwn: false,
  },
  {
    id: 2,
    name: 'You',
    avatar: 'JS',
    message: 'For better usability and data protection...',
    time: '11:31 AM',
    isOwn: true,
  },
  {
    id: 3,
    name: 'Alexander Pierce',
    avatar: 'AP',
    message: 'Thank you! It is an awesome template!',
    time: '11:31 AM',
    isOwn: false,
  },
];

export default function DirectChat() {
  return (
    <div className="bg-white rounded shadow-sm border border-[#dee2e6]">
      <div className="border-b border-[#dee2e6] p-4">
        <h3 className="font-semibold">私信聊天</h3>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-8 h-8 rounded-full bg-[#007bff] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {msg.avatar}
              </div>
              <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'} max-w-[75%]`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">{msg.name}</span>
                  <span className="text-xs text-[#6c757d]">{msg.time}</span>
                </div>
                <div
                  className={`px-3 py-2 rounded ${
                    msg.isOwn ? 'bg-[#007bff] text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="输入消息..."
            className="flex-1 px-3 py-2 border border-[#dee2e6] rounded text-sm focus:outline-none focus:border-[#007bff]"
          />
          <button className="px-4 py-2 bg-[#007bff] text-white rounded text-sm hover:bg-[#0056b3]">
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
