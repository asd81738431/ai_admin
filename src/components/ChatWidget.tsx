'use client';

import { useState } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'me';
  time: string;
}

const initialMessages: Message[] = [
  { id: 1, text: '你好！有什么可以帮助你的吗？', sender: 'me', time: '10:00' },
  { id: 2, text: '嗨，我有一个关于订单的问题。', sender: 'user', time: '10:02' },
  { id: 3, text: '当然！你想知道什么？', sender: 'me', time: '10:03' },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Auto reply after 1 second
    setTimeout(() => {
      const replyMessage: Message = {
        id: messages.length + 2,
        text: '感谢您的留言。我们团队会尽快回复您！',
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed top-1/2 -translate-y-1/2 bg-[#007bff] text-white p-3 rounded-lg shadow-lg hover:bg-[#0056b3] transition-all duration-300 ease-in-out z-50"
        style={{
          right: isOpen ? '320px' : '0px',
        }}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        )}
      </button>

      {/* Chat Panel */}
      <div
        className="fixed right-0 top-[57px] bottom-[57px] w-80 bg-white shadow-2xl border-l border-[#dee2e6] z-40 flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className="bg-[#007bff] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm">AI</span>
            </div>
            <div>
              <p className="font-semibold text-sm">AI助手</p>
              {/* <p className="text-xs text-white/80">Online</p> */}
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-[#007bff] text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-[#6c757d]'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#dee2e6]">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="输入消息..."
              className="flex-1 px-3 py-2 border border-[#dee2e6] rounded text-sm focus:outline-none focus:border-[#007bff]"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-[#007bff] text-white rounded hover:bg-[#0056b3] transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
