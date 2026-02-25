'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'me';
  time: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 打开聊天时获取初始化欢迎消息
  useEffect(() => {
    if (isOpen && !isInitialized) {
      setIsInitialized(true);
      fetchWelcomeMessage();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // 获取 token 前10位作为 thread_id
  const getThreadId = (): string => {
    if (typeof window === 'undefined') return 'default';
    const token = localStorage.getItem('token') || '';
    return token.length >= 10 ? token.substring(0, 10) : (token || 'default');
  };

  // 获取欢迎消息
  const fetchWelcomeMessage = async () => {
    try {
      const threadId = getThreadId();
      const response = await fetch(`http://127.0.0.1:8000/chat/${threadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '你好' }),
      });

      if (!response.ok) return;

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      const welcomeMsg: Message = {
        id: 1,
        text: '',
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcomeMsg]);

      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            if (data) {
              fullText += data;
              setMessages(prev => prev.map(msg => ({ ...msg, text: fullText })));
            }
          }
        }
      }
    } catch (error) {
      console.error('获取欢迎消息失败:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    // 创建 AI 回复消息占位
    const aiMessageId = messages.length + 2;
    const aiMessage: Message = {
      id: aiMessageId,
      text: '',
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, aiMessage]);

    try {
      const threadId = getThreadId();
      const response = await fetch(`http://127.0.0.1:8000/chat/${threadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法读取响应');
      }

      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsLoading(false);
              return;
            }
            if (data) {
              fullText += data;
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessageId ? { ...msg, text: fullText } : msg
                )
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('聊天错误:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: '抱歉，连接失败，请稍后重试。' } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
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
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              placeholder="输入消息..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-[#dee2e6] rounded text-sm focus:outline-none focus:border-[#007bff] disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputText.trim()}
              className="p-2 bg-[#007bff] text-white rounded hover:bg-[#0056b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
