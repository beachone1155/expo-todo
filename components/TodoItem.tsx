import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Todo } from '@/types/todo';
import { PriorityLabels, PriorityColors } from '@/types/todo';

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

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onEdit,
  onDelete,
  onPress,
  showPriority = true,
  showDueDate = true,
  showTags = true,
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Todoを削除',
      'このTodoを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '削除', style: 'destructive', onPress: () => onDelete(todo.id) },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = todo.dueDate && new Date() > todo.dueDate && !todo.completed;

  return (
    <TouchableOpacity
      style={[styles.container, todo.completed && styles.completed]}
      onPress={() => onPress?.(todo)}
      activeOpacity={0.7}
    >
      {/* チェックボックス */}
      <TouchableOpacity
        style={[styles.checkbox, todo.completed && styles.checkboxCompleted]}
        onPress={() => onToggle(todo.id)}
      >
        {todo.completed && (
          <Ionicons name="checkmark" size={16} color="#fff" />
        )}
      </TouchableOpacity>

      {/* コンテンツ */}
      <View style={styles.content}>
        {/* タイトル */}
        <Text style={[styles.title, todo.completed && styles.titleCompleted]}>
          {todo.title}
        </Text>

        {/* 説明 */}
        {todo.description && (
          <Text style={[styles.description, todo.completed && styles.descriptionCompleted]}>
            {todo.description}
          </Text>
        )}

        {/* メタ情報 */}
        <View style={styles.meta}>
          {/* 優先度 */}
          {showPriority && (
            <View style={styles.priorityContainer}>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: PriorityColors[todo.priority] }
                ]}
              >
                <Text style={styles.priorityText}>
                  {PriorityLabels[todo.priority]}
                </Text>
              </View>
            </View>
          )}

          {/* 期限 */}
          {showDueDate && todo.dueDate && (
            <View style={styles.dueDateContainer}>
              <Ionicons
                name="time-outline"
                size={14}
                color={isOverdue ? '#F44336' : '#666'}
              />
              <Text style={[
                styles.dueDateText,
                isOverdue && styles.overdueText
              ]}>
                {formatDate(todo.dueDate)}
              </Text>
            </View>
          )}

          {/* タグ */}
          {showTags && todo.tags && todo.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {todo.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
              {todo.tags.length > 3 && (
                <Text style={styles.moreTagsText}>+{todo.tags.length - 3}</Text>
              )}
            </View>
          )}
        </View>
      </View>

      {/* アクションボタン */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(todo.id)}
        >
          <Ionicons name="pencil-outline" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completed: {
    opacity: 0.6,
    backgroundColor: '#f8f9fa',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  descriptionCompleted: {
    color: '#999',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityContainer: {
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  dueDateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  overdueText: {
    color: '#F44336',
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 11,
    color: '#999',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
}); 