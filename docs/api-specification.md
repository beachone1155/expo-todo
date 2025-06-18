# API仕様書

## 概要

このドキュメントでは、Expo TodoアプリケーションのAPI仕様を定義します。

## データモデル

### Todo

```typescript
interface Todo {
  id: string;           // 一意のID
  title: string;        // タスクのタイトル
  description?: string; // タスクの説明（オプション）
  completed: boolean;   // 完了状態
  priority: Priority;   // 優先度
  dueDate?: Date;       // 期限（オプション）
  createdAt: Date;      // 作成日時
  updatedAt: Date;      // 更新日時
  tags?: string[];      // タグ（オプション）
}

enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}
```

### User

```typescript
interface User {
  id: string;           // ユーザーID
  email: string;        // メールアドレス
  name: string;         // 表示名
  avatar?: string;      // アバター画像URL
  createdAt: Date;      // 作成日時
  updatedAt: Date;      // 更新日時
}
```

## ローカルストレージAPI

### AsyncStorage

```typescript
// ストレージキー
const STORAGE_KEYS = {
  TODOS: 'todos',
  USER_SETTINGS: 'user_settings',
  THEME: 'theme',
} as const;

// Todo関連の操作
interface TodoStorageAPI {
  // 全Todoを取得
  getAllTodos(): Promise<Todo[]>;
  
  // Todoを保存
  saveTodo(todo: Todo): Promise<void>;
  
  // Todoを更新
  updateTodo(id: string, updates: Partial<Todo>): Promise<void>;
  
  // Todoを削除
  deleteTodo(id: string): Promise<void>;
  
  // 完了済みTodoを削除
  deleteCompletedTodos(): Promise<void>;
  
  // Todoを一括保存
  saveAllTodos(todos: Todo[]): Promise<void>;
}
```

### 実装例

```typescript
// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Todo } from '@/types/todo';

export class TodoStorage {
  private static readonly TODOS_KEY = 'todos';

  static async getAllTodos(): Promise<Todo[]> {
    try {
      const todosJson = await AsyncStorage.getItem(this.TODOS_KEY);
      return todosJson ? JSON.parse(todosJson) : [];
    } catch (error) {
      console.error('Failed to get todos:', error);
      return [];
    }
  }

  static async saveTodo(todo: Todo): Promise<void> {
    try {
      const todos = await this.getAllTodos();
      const updatedTodos = [...todos, todo];
      await AsyncStorage.setItem(this.TODOS_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Failed to save todo:', error);
      throw error;
    }
  }

  static async updateTodo(id: string, updates: Partial<Todo>): Promise<void> {
    try {
      const todos = await this.getAllTodos();
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
      );
      await AsyncStorage.setItem(this.TODOS_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw error;
    }
  }

  static async deleteTodo(id: string): Promise<void> {
    try {
      const todos = await this.getAllTodos();
      const filteredTodos = todos.filter(todo => todo.id !== id);
      await AsyncStorage.setItem(this.TODOS_KEY, JSON.stringify(filteredTodos));
    } catch (error) {
      console.error('Failed to delete todo:', error);
      throw error;
    }
  }
}
```

## カスタムフックAPI

### useTodo

```typescript
// hooks/useTodo.ts
interface UseTodoReturn {
  // 状態
  todos: Todo[];
  loading: boolean;
  error: string | null;
  
  // アクション
  addTodo: (title: string, description?: string) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  
  // フィルタリング
  getTodosByStatus: (completed: boolean) => Todo[];
  getTodosByPriority: (priority: Priority) => Todo[];
  getTodosByTag: (tag: string) => Todo[];
  
  // 統計
  getStats: () => {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  };
}
```

### useTheme

```typescript
// hooks/useTheme.ts
interface UseThemeReturn {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}
```

## コンポーネントAPI

### TodoItem

```typescript
// components/TodoItem.tsx
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPress?: (todo: Todo) => void;
  showPriority?: boolean;
  showDueDate?: boolean;
  showTags?: boolean;
}

interface TodoItemRef {
  focus: () => void;
  blur: () => void;
}
```

### TodoList

```typescript
// components/TodoList.tsx
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
  filter?: {
    status?: 'all' | 'completed' | 'pending';
    priority?: Priority;
    tag?: string;
  };
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}
```

### TodoForm

```typescript
// components/TodoForm.tsx
interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  initialValues?: Partial<Todo>;
  mode?: 'create' | 'edit';
}

interface TodoFormData {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: Date;
  tags?: string[];
}
```

## ナビゲーションAPI

### ルート定義

```typescript
// types/navigation.ts
export type RootStackParamList = {
  // タブナビゲーション
  '(tabs)': undefined;
  
  // メイン画面
  'index': undefined;
  'explore': undefined;
  
  // Todo関連
  'todo/new': undefined;
  'todo/[id]': { id: string };
  'todo/[id]/edit': { id: string };
  
  // 設定
  'settings': undefined;
  'settings/theme': undefined;
  'settings/notifications': undefined;
  
  // その他
  'not-found': undefined;
};
```

### ナビゲーション関数

```typescript
// utils/navigation.ts
export const navigation = {
  // Todo関連
  goToTodoDetail: (id: string) => router.push(`/todo/${id}`),
  goToNewTodo: () => router.push('/todo/new'),
  goToEditTodo: (id: string) => router.push(`/todo/${id}/edit`),
  
  // 設定
  goToSettings: () => router.push('/settings'),
  goToThemeSettings: () => router.push('/settings/theme'),
  
  // 戻る
  goBack: () => router.back(),
  goToHome: () => router.push('/'),
};
```

## エラーハンドリング

### エラー型定義

```typescript
// types/error.ts
interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

enum ErrorCodes {
  // ストレージエラー
  STORAGE_READ_ERROR = 'STORAGE_READ_ERROR',
  STORAGE_WRITE_ERROR = 'STORAGE_WRITE_ERROR',
  STORAGE_DELETE_ERROR = 'STORAGE_DELETE_ERROR',
  
  // バリデーションエラー
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // ネットワークエラー
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // その他
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
```

### エラーハンドリング関数

```typescript
// utils/errorHandler.ts
export class ErrorHandler {
  static handle(error: unknown): AppError {
    if (error instanceof Error) {
      return {
        code: ErrorCodes.UNKNOWN_ERROR,
        message: error.message,
        timestamp: new Date(),
      };
    }
    
    return {
      code: ErrorCodes.UNKNOWN_ERROR,
      message: 'An unknown error occurred',
      timestamp: new Date(),
    };
  }

  static isStorageError(error: AppError): boolean {
    return error.code.startsWith('STORAGE_');
  }

  static isValidationError(error: AppError): boolean {
    return error.code.startsWith('VALIDATION_');
  }
}
```

## バリデーション

### Todoバリデーション

```typescript
// utils/validation.ts
interface TodoValidationRules {
  title: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  description: {
    maxLength: number;
  };
  dueDate: {
    futureOnly: boolean;
  };
}

export const todoValidation = {
  validateTitle: (title: string): string | null => {
    if (!title.trim()) {
      return 'タイトルは必須です';
    }
    if (title.length < 1) {
      return 'タイトルは1文字以上で入力してください';
    }
    if (title.length > 100) {
      return 'タイトルは100文字以内で入力してください';
    }
    return null;
  },

  validateDescription: (description?: string): string | null => {
    if (description && description.length > 500) {
      return '説明は500文字以内で入力してください';
    }
    return null;
  },

  validateDueDate: (dueDate?: Date): string | null => {
    if (dueDate && dueDate < new Date()) {
      return '期限は未来の日付を設定してください';
    }
    return null;
  },

  validateTodo: (todo: Partial<Todo>): AppError[] => {
    const errors: AppError[] = [];
    
    const titleError = this.validateTitle(todo.title || '');
    if (titleError) {
      errors.push({
        code: ErrorCodes.VALIDATION_ERROR,
        message: titleError,
        timestamp: new Date(),
      });
    }
    
    const descriptionError = this.validateDescription(todo.description);
    if (descriptionError) {
      errors.push({
        code: ErrorCodes.VALIDATION_ERROR,
        message: descriptionError,
        timestamp: new Date(),
      });
    }
    
    const dueDateError = this.validateDueDate(todo.dueDate);
    if (dueDateError) {
      errors.push({
        code: ErrorCodes.VALIDATION_ERROR,
        message: dueDateError,
        timestamp: new Date(),
      });
    }
    
    return errors;
  },
};
```

## パフォーマンス最適化

### キャッシュ戦略

```typescript
// utils/cache.ts
interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
}

export class TodoCache {
  private cache = new Map<string, { data: Todo; timestamp: number }>();
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  set(key: string, data: Todo): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    
    // キャッシュサイズ制限
    if (this.cache.size > this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  get(key: string): Todo | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // TTLチェック
    if (Date.now() - item.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}
```

## セキュリティ

### データサニタイゼーション

```typescript
// utils/sanitization.ts
export const sanitization = {
  sanitizeTitle: (title: string): string => {
    return title.trim().replace(/[<>]/g, '');
  },

  sanitizeDescription: (description: string): string => {
    return description.trim().replace(/[<>]/g, '');
  },

  sanitizeTags: (tags: string[]): string[] => {
    return tags
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0 && tag.length <= 20)
      .slice(0, 10); // 最大10個まで
  },
};
``` 