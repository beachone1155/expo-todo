import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Todo, CreateTodoInput, Priority } from '@/types/todo';
import { PriorityLabels, PriorityColors } from '@/types/todo';

interface TodoFormProps {
  onSubmit: (todo: CreateTodoInput) => void;
  onCancel?: () => void;
  initialValues?: Partial<Todo>;
  mode?: 'create' | 'edit';
  loading?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
  mode = 'create',
  loading = false,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [priority, setPriority] = useState<Priority>(initialValues?.priority || Priority.MEDIUM);

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setDescription(initialValues.description || '');
      setPriority(initialValues.priority || Priority.MEDIUM);
    }
  }, [initialValues]);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('エラー', 'タイトルを入力してください');
      return;
    }

    const todoData: CreateTodoInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
    };

    onSubmit(todoData);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* タイトル */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>タイトル *</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Todoのタイトルを入力"
            maxLength={100}
            autoFocus={mode === 'create'}
          />
        </View>

        {/* 説明 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>説明</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="詳細な説明を入力（オプション）"
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        {/* 優先度 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>優先度</Text>
          <View style={styles.priorityContainer}>
            {Object.values(Priority).map((priorityValue) => (
              <TouchableOpacity
                key={priorityValue}
                style={[
                  styles.priorityButton,
                  priority === priorityValue && styles.priorityButtonSelected,
                  { borderColor: PriorityColors[priorityValue] }
                ]}
                onPress={() => setPriority(priorityValue)}
              >
                <Text style={[
                  styles.priorityButtonText,
                  { color: priority === priorityValue ? '#fff' : PriorityColors[priorityValue] }
                ]}>
                  {PriorityLabels[priorityValue]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ボタン */}
        <View style={styles.buttonContainer}>
          {onCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>キャンセル</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading || !title.trim()}
          >
            <Text style={styles.submitButtonText}>
              {loading ? '保存中...' : mode === 'create' ? '追加' : '更新'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityButton: {
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  priorityButtonSelected: {
    backgroundColor: PriorityColors[Priority.MEDIUM],
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
}); 