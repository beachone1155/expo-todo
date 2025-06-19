import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import { useCatContext } from '@/hooks/CatContext';
import { useTodo } from '@/hooks/useTodo';
import type { CreateTodoInput, Todo } from '@/types/todo';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TodoScreen() {
  const {
    filteredAndSortedTodos,
    loading,
    error,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    refreshTodos,
    stats,
  } = useTodo();
  const cat = useCatContext();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleAddTodo = async (todoInput: CreateTodoInput) => {
    try {
      setFormLoading(true);
      await addTodo(todoInput);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditTodo = (id: string) => {
    const todo = filteredAndSortedTodos.find(t => t.id === id);
    if (todo) {
      setEditingTodo(todo);
      setShowEditModal(true);
    }
  };

  const handleUpdateTodo = async (todoInput: CreateTodoInput) => {
    if (!editingTodo) return;
    
    try {
      setFormLoading(true);
      await updateTodo(editingTodo.id, todoInput);
      setShowEditModal(false);
      setEditingTodo(null);
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      await toggleTodo(id);
      const todo = filteredAndSortedTodos.find(t => t.id === id);
      if (todo && !todo.completed) {
        cat.addXp(5);
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>Todo</Text>
      </View>

      {/* 統計情報 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>総数</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>完了</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>未完了</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Math.round(stats.completionRate)}%</Text>
          <Text style={styles.statLabel}>完了率</Text>
        </View>
      </View>

      {/* エラーメッセージ */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Todoリスト */}
      <TodoList
        todos={filteredAndSortedTodos}
        loading={loading}
        onToggle={handleToggleTodo}
        onEdit={handleEditTodo}
        onDelete={handleDeleteTodo}
        onRefresh={refreshTodos}
        refreshing={loading}
        emptyMessage="新しいTodoを追加してみましょう！"
      />

      {/* 右下の追加ボタン */}
      <TouchableOpacity
        style={[
          styles.fab,
          Platform.OS === 'ios'
            ? { bottom: 32 + insets.bottom + tabBarHeight }
            : { bottom: 32 + insets.bottom }
        ]}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* 追加モーダル */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>新しいTodo</Text>
            <TouchableOpacity
              onPress={() => setShowAddModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <TodoForm
            onSubmit={handleAddTodo}
            onCancel={() => setShowAddModal(false)}
            mode="create"
            loading={formLoading}
          />
        </SafeAreaView>
      </Modal>

      {/* 編集モーダル */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Todoを編集</Text>
            <TouchableOpacity
              onPress={() => {
                setShowEditModal(false);
                setEditingTodo(null);
              }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {editingTodo && (
            <TodoForm
              onSubmit={handleUpdateTodo}
              onCancel={() => {
                setShowEditModal(false);
                setEditingTodo(null);
              }}
              mode="edit"
              initialData={editingTodo}
              loading={formLoading}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
