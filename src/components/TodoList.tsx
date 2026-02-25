'use client';

import { useState } from 'react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const initialTodos: Todo[] = [
  { id: 1, text: '设计一个美观的主题', completed: true },
  { id: 2, text: '一些任务', completed: false },
  { id: 3, text: '开发应用程序', completed: false },
  { id: 4, text: '修复导航问题', completed: false },
  { id: 5, text: '创建管理面板', completed: false },
  { id: 6, text: '编写文档', completed: false },
];

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="bg-white rounded shadow-sm border border-[#dee2e6]">
      <div className="border-b border-[#dee2e6] p-4 flex items-center justify-between">
        <h3 className="font-semibold">待办事项</h3>
        <button className="text-[#007bff] hover:text-[#0056b3]">
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3 group">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4 rounded border-[#dee2e6] text-[#007bff] focus:ring-[#007bff]"
              />
              <span
                className={`flex-1 text-sm ${
                  todo.completed ? 'line-through text-[#6c757d]' : ''
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-[#dc3545] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-[#dee2e6]">
          <input
            type="text"
            placeholder="添加新任务..."
            className="w-full px-3 py-2 border border-[#dee2e6] rounded text-sm focus:outline-none focus:border-[#007bff]"
          />
        </div>
      </div>
    </div>
  );
}
