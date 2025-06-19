import { render } from '@testing-library/react-native';
import React from 'react';
import { TodoItem } from '../../components/TodoItem';

test('タイトルが表示される', () => {
  const { getByText } = render(
    <TodoItem
      todo={{ id: '1', title: 'テスト', completed: false, createdAt: new Date(), updatedAt: new Date() }}
      onToggle={() => {}}
      onDelete={() => {}}
    />
  );
  expect(getByText('テスト')).toBeTruthy();
}); 