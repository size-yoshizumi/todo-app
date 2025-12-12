'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  createdAt: Date;
  completed: boolean;
}

type Filter = 'all' | 'active' | 'completed';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);

  const handleAddTodo = () => {
    const trimmedText = inputText.trim();
    if (trimmedText === '') {
      return;
    }

    const newTodo: Todo = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: trimmedText,
      createdAt: new Date(),
      completed: false,
    };

    setNewlyAddedId(newTodo.id);
    setTodos([newTodo, ...todos]);
    setInputText('');
  };

  useEffect(() => {
    if (newlyAddedId) {
      const timer = setTimeout(() => {
        setNewlyAddedId(null);
      }, 600); // アニメーション時間に合わせて調整
      return () => clearTimeout(timer);
    }
  }, [newlyAddedId]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleDeleteTodo = (id: string) => {
    if (window.confirm('このTODOを削除してもよろしいですか？')) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', id);
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const draggedTodoId = e.dataTransfer.getData('text/html');
    
    if (draggedTodoId === targetId) {
      return;
    }

    const draggedIndex = todos.findIndex((todo) => todo.id === draggedTodoId);
    const targetIndex = todos.findIndex((todo) => todo.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    const newTodos = [...todos];
    const [removed] = newTodos.splice(draggedIndex, 1);
    newTodos.splice(targetIndex, 0, removed);

    setTodos(newTodos);
    setDraggedId(null);
  };

  const handleToggleComplete = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updatedTodos = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );

    // "全て"フィルター選択時、完了にしたら一番上に移動
    if (filter === 'all' && !todo.completed) {
      const completedTodo = updatedTodos.find((t) => t.id === id);
      const otherTodos = updatedTodos.filter((t) => t.id !== id);
      setTodos([completedTodo!, ...otherTodos]);
    } else {
      setTodos(updatedTodos);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">TODOアプリ</h1>
        
        {/* 入力フォーム */}
        <div className="mb-8 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="新しいTODOを入力..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            追加
          </button>
        </div>

        {/* フィルターボタン */}
        <div className="mb-6 flex gap-2 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            全て
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              filter === 'active'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            未完了
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              filter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            完了
          </button>
        </div>

        {/* TODO一覧 */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {filter === 'all'
                ? 'TODOがありません。新しいTODOを追加してください。'
                : filter === 'active'
                ? '未完了のTODOがありません。'
                : '完了したTODOがありません。'}
            </div>
          ) : (
            filteredTodos.map((todo, index) => {
              const isNewlyAdded = newlyAddedId === todo.id && filter === 'all';
              const shouldSlideDown = newlyAddedId && !isNewlyAdded && filter === 'all' && index > 0;
              
              return (
                <div
                  key={todo.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, todo.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, todo.id)}
                  className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex items-start justify-between gap-4 cursor-move ${
                    draggedId === todo.id ? 'opacity-50' : ''
                  } ${
                    todo.completed
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-white dark:bg-gray-800'
                  } ${
                    isNewlyAdded ? 'todo-slide-in' : ''
                  } ${
                    shouldSlideDown ? 'todo-slide-down' : ''
                  }`}
                >
                {/* ドラッグハンドル */}
                <div className="flex items-center justify-center w-6 h-6 mr-2 cursor-grab active:cursor-grabbing flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                  </svg>
                </div>
                {/* チェックボックス */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                  className="w-5 h-5 mt-1 cursor-pointer flex-shrink-0"
                  aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
                />
                <div className="flex-1">
                  <p className={`text-lg ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.text}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {todo.createdAt.toLocaleString('ja-JP')}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex-shrink-0"
                  aria-label="削除"
                >
                  削除
                </button>
              </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

