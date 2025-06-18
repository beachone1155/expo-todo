import { useState, useEffect, useCallback, useMemo } from 'react';
import { TodoStorage } from '@/utils/storage';
import type { 
  Todo, 
  CreateTodoInput, 
  UpdateTodoInput, 
  TodoFilter, 
  TodoSort, 
  TodoStats,
  Priority 
} from '@/types/todo';

interface UseTodoReturn {
  // 状態
  todos: Todo[];
  loading: boolean;
  error: string | null;
  
  // アクション
  addTodo: (todoInput: CreateTodoInput) => Promise<void>;
  updateTodo: (id: string, updates: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  
  // フィルタリングとソート
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
  sort: TodoSort;
  setSort: (sort: TodoSort) => void;
  filteredAndSortedTodos: Todo[];
  
  // 統計
  stats: TodoStats;
  
  // ユーティリティ
  refreshTodos: () => Promise<void>;
  getTodosByStatus: (completed: boolean) => Todo[];
  getTodosByPriority: (priority: Priority) => Todo[];
  getTodosByTag: (tag: string) => Todo[];
}

export const useTodo = (): UseTodoReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>({ status: 'all' });
  const [sort, setSort] = useState<TodoSort>({ by: 'createdAt', order: 'desc' });

  // 初期データの読み込み
  useEffect(() => {
    loadTodos();
  }, []);

  // Todoの読み込み
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedTodos = await TodoStorage.getAllTodos();
      setTodos(loadedTodos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Todoの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // 新しいTodoを追加
  const addTodo = useCallback(async (todoInput: CreateTodoInput) => {
    try {
      setError(null);
      const newTodo = await TodoStorage.saveTodo(todoInput);
      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Todoの追加に失敗しました');
      throw err;
    }
  }, []);

  // Todoを更新
  const updateTodo = useCallback(async (id: string, updates: UpdateTodoInput) => {
    try {
      setError(null);
      const updatedTodo = await TodoStorage.updateTodo(id, updates);
      if (updatedTodo) {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? updatedTodo : todo
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Todoの更新に失敗しました');
      throw err;
    }
  }, []);

  // Todoを削除
  const deleteTodo = useCallback(async (id: string) => {
    try {
      setError(null);
      await TodoStorage.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Todoの削除に失敗しました');
      throw err;
    }
  }, []);

  // Todoの完了状態を切り替え
  const toggleTodo = useCallback(async (id: string) => {
    try {
      setError(null);
      const updatedTodo = await TodoStorage.toggleTodo(id);
      if (updatedTodo) {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? updatedTodo : todo
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Todoの状態変更に失敗しました');
      throw err;
    }
  }, []);

  // 完了済みTodoを削除
  const clearCompleted = useCallback(async () => {
    try {
      setError(null);
      await TodoStorage.deleteCompletedTodos();
      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (err) {
      setError(err instanceof Error ? err.message : '完了済みTodoの削除に失敗しました');
      throw err;
    }
  }, []);

  // フィルタリングとソートされたTodo
  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    // ステータスフィルター
    if (filter.status === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    } else if (filter.status === 'pending') {
      filtered = filtered.filter(todo => !todo.completed);
    }

    // 優先度フィルター
    if (filter.priority) {
      filtered = filtered.filter(todo => todo.priority === filter.priority);
    }

    // タグフィルター
    if (filter.tag) {
      filtered = filtered.filter(todo => 
        todo.tags?.some(tag => tag.toLowerCase().includes(filter.tag!.toLowerCase()))
      );
    }

    // 検索フィルター
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description?.toLowerCase().includes(searchLower)
      );
    }

    // ソート
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.by) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          aValue = Object.values(Priority).indexOf(a.priority);
          bValue = Object.values(Priority).indexOf(b.priority);
          break;
        case 'dueDate':
          aValue = a.dueDate?.getTime() || 0;
          bValue = b.dueDate?.getTime() || 0;
          break;
        case 'updatedAt':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        default: // createdAt
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
      }

      if (sort.order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [todos, filter, sort]);

  // 統計情報
  const stats = useMemo((): TodoStats => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    // 優先度別統計
    const byPriority = Object.values(Priority).reduce((acc, priority) => {
      acc[priority] = todos.filter(todo => todo.priority === priority).length;
      return acc;
    }, {} as Record<Priority, number>);

    // タグ別統計
    const byTag: Record<string, number> = {};
    todos.forEach(todo => {
      todo.tags?.forEach(tag => {
        byTag[tag] = (byTag[tag] || 0) + 1;
      });
    });

    return {
      total,
      completed,
      pending,
      completionRate,
      byPriority,
      byTag,
    };
  }, [todos]);

  // ユーティリティ関数
  const getTodosByStatus = useCallback((completed: boolean) => {
    return todos.filter(todo => todo.completed === completed);
  }, [todos]);

  const getTodosByPriority = useCallback((priority: Priority) => {
    return todos.filter(todo => todo.priority === priority);
  }, [todos]);

  const getTodosByTag = useCallback((tag: string) => {
    return todos.filter(todo => 
      todo.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }, [todos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    filter,
    setFilter,
    sort,
    setSort,
    filteredAndSortedTodos,
    stats,
    refreshTodos: loadTodos,
    getTodosByStatus,
    getTodosByPriority,
    getTodosByTag,
  };
}; 