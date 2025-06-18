import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { TodoItem } from './TodoItem';
import type { Todo } from '@/types/todo';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
  onPressTodo?: (todo: Todo) => void;
  showPriority?: boolean;
  showDueDate?: boolean;
  showTags?: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  onToggle,
  onEdit,
  onDelete,
  onRefresh,
  refreshing = false,
  emptyMessage = 'Todoがありません',
  onPressTodo,
  showPriority = true,
  showDueDate = true,
  showTags = true,
}) => {
  const renderItem = useCallback(({ item }: { item: Todo }) => (
    <TodoItem
      todo={item}
      onToggle={onToggle}
      onEdit={onEdit}
      onDelete={onDelete}
      onPress={onPressTodo}
      showPriority={showPriority}
      showDueDate={showDueDate}
      showTags={showTags}
    />
  ), [onToggle, onEdit, onDelete, onPressTodo, showPriority, showDueDate, showTags]);

  const keyExtractor = useCallback((item: Todo) => item.id, []);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>Todoがありません</Text>
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        </>
      )}
    </View>
  );

  const renderHeader = () => {
    if (todos.length === 0) return null;
    
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {todos.length}件のTodo
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={todos}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={renderHeader}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        ) : undefined
      }
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 