// Todoアイテムの型定義
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

// 優先度の列挙型
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// 優先度の表示名
export const PriorityLabels: Record<Priority, string> = {
  [Priority.LOW]: '低',
  [Priority.MEDIUM]: '中',
  [Priority.HIGH]: '高',
  [Priority.URGENT]: '緊急'
};

// 優先度の色
export const PriorityColors: Record<Priority, string> = {
  [Priority.LOW]: '#4CAF50',
  [Priority.MEDIUM]: '#FF9800',
  [Priority.HIGH]: '#F44336',
  [Priority.URGENT]: '#9C27B0'
};

// Todo作成時の型（ID、作成日時、更新日時は除外）
export type CreateTodoInput = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

// Todo更新時の型（一部のフィールドのみ更新可能）
export type UpdateTodoInput = Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>;

// Todoフィルターの型
export interface TodoFilter {
  status?: 'all' | 'completed' | 'pending';
  priority?: Priority;
  tag?: string;
  search?: string;
}

// Todoソートの型
export type TodoSortBy = 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
export type TodoSortOrder = 'asc' | 'desc';

// Todoソート設定の型
export interface TodoSort {
  by: TodoSortBy;
  order: TodoSortOrder;
}

// Todo統計情報の型
export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byPriority: Record<Priority, number>;
  byTag: Record<string, number>;
} 