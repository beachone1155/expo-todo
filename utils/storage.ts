import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo';

// ストレージキー
const STORAGE_KEYS = {
  TODOS: 'todos',
  USER_SETTINGS: 'user_settings',
  THEME: 'theme',
} as const;

// Todoストレージクラス
export class TodoStorage {
  private static readonly TODOS_KEY = STORAGE_KEYS.TODOS;

  /**
   * 全Todoを取得
   */
  static async getAllTodos(): Promise<Todo[]> {
    try {
      const todosJson = await AsyncStorage.getItem(this.TODOS_KEY);
      if (!todosJson) return [];
      
      const todos = JSON.parse(todosJson);
      // Date型に変換
      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }));
    } catch (error) {
      console.error('Failed to get todos:', error);
      return [];
    }
  }

  /**
   * 新しいTodoを保存
   */
  static async saveTodo(todoInput: CreateTodoInput): Promise<Todo> {
    try {
      const todos = await this.getAllTodos();
      const newTodo: Todo = {
        ...todoInput,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const updatedTodos = [...todos, newTodo];
      await AsyncStorage.setItem(this.TODOS_KEY, JSON.stringify(updatedTodos));
      
      return newTodo;
    } catch (error) {
      console.error('Failed to save todo:', error);
      throw new Error('Todoの保存に失敗しました');
    }
  }

  /**
   * Todoを更新
   */
  static async updateTodo(id: string, updates: UpdateTodoInput): Promise<Todo | null> {
    try {
      const todos = await this.getAllTodos();
      const todoIndex = todos.findIndex(todo => todo.id === id);
      
      if (todoIndex === -1) {
        throw new Error('Todoが見つかりません');
      }
      
      const updatedTodo: Todo = {
        ...todos[todoIndex],
        ...updates,
        updatedAt: new Date(),
      };
      
      todos[todoIndex] = updatedTodo;
      await AsyncStorage.setItem(this.TODOS_KEY, JSON.stringify(todos));
      
      return updatedTodo;
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw new Error('Todoの更新に失敗しました');
    }
  }

  /**
   * Todoを削除
   */
  static async deleteTodo(id: string): Promise<void> {
    try {
      const todos = await this.getAllTodos();
      const filteredTodos = todos.filter(todo => todo.id !== id);
      await AsyncStorage.setItem(this.TODOS_KEY, JSON.stringify(filteredTodos));
    } catch (error) {
      console.error('Failed to delete todo:', error);
      throw new Error('Todoの削除に失敗しました');
    }
  }

  /**
   * 完了済みTodoを削除
   */
  static async deleteCompletedTodos(): Promise<void> {
    try {
      const todos = await this.getAllTodos();
      const pendingTodos = todos.filter(todo => !todo.completed);
      await AsyncStorage.setItem(this.TODOS_KEY, JSON.stringify(pendingTodos));
    } catch (error) {
      console.error('Failed to delete completed todos:', error);
      throw new Error('完了済みTodoの削除に失敗しました');
    }
  }

  /**
   * Todoを一括保存
   */
  static async saveAllTodos(todos: Todo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.TODOS_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save all todos:', error);
      throw new Error('Todoの一括保存に失敗しました');
    }
  }

  /**
   * Todoの完了状態を切り替え
   */
  static async toggleTodo(id: string): Promise<Todo | null> {
    try {
      const todos = await this.getAllTodos();
      const todoIndex = todos.findIndex(todo => todo.id === id);
      
      if (todoIndex === -1) {
        throw new Error('Todoが見つかりません');
      }
      
      const updatedTodo: Todo = {
        ...todos[todoIndex],
        completed: !todos[todoIndex].completed,
        updatedAt: new Date(),
      };
      
      todos[todoIndex] = updatedTodo;
      await AsyncStorage.setItem(this.TODOS_KEY, JSON.stringify(todos));
      
      return updatedTodo;
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      throw new Error('Todoの状態変更に失敗しました');
    }
  }

  /**
   * ストレージをクリア
   */
  static async clearAllTodos(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.TODOS_KEY);
    } catch (error) {
      console.error('Failed to clear todos:', error);
      throw new Error('Todoのクリアに失敗しました');
    }
  }

  /**
   * ストレージの使用量を取得
   */
  static async getStorageSize(): Promise<number> {
    try {
      const todosJson = await AsyncStorage.getItem(this.TODOS_KEY);
      return todosJson ? todosJson.length : 0;
    } catch (error) {
      console.error('Failed to get storage size:', error);
      return 0;
    }
  }
} 