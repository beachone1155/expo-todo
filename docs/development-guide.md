# 開発ガイド

## 目次

1. [開発環境のセットアップ](#開発環境のセットアップ)
2. [プロジェクトの構造](#プロジェクトの構造)
3. [コーディング規約](#コーディング規約)
4. [コンポーネント開発](#コンポーネント開発)
5. [状態管理](#状態管理)
6. [ナビゲーション](#ナビゲーション)
7. [スタイリング](#スタイリング)
8. [テスト](#テスト)
9. [デバッグ](#デバッグ)
10. [パフォーマンス最適化](#パフォーマンス最適化)

## 開発環境のセットアップ

### 必要なツール

1. **Node.js** (v18以上)
   ```bash
   node --version
   ```

2. **npm** または **yarn**
   ```bash
   npm --version
   ```

3. **Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

4. **Git**
   ```bash
   git --version
   ```

### 推奨エディタ

- **Visual Studio Code** 推奨
- 推奨拡張機能:
  - TypeScript and JavaScript Language Features
  - React Native Tools
  - Expo Tools
  - ESLint
  - Prettier

## プロジェクトの構造

### ディレクトリの役割

```
app/                    # ページコンポーネント（Expo Router）
├── (tabs)/            # タブナビゲーション
├── _layout.tsx        # ルートレイアウト
└── +not-found.tsx     # 404ページ

components/            # 再利用可能コンポーネント
├── ui/               # 基本UIコンポーネント
└── [feature]/        # 機能別コンポーネント

constants/             # 定数定義
├── Colors.ts         # カラー定義
└── Config.ts         # 設定定数

hooks/                 # カスタムフック
├── useTodo.ts        # Todo関連フック
└── useTheme.ts       # テーマ関連フック

types/                 # TypeScript型定義
├── todo.ts           # Todo関連型
└── navigation.ts     # ナビゲーション型

utils/                 # ユーティリティ関数
├── storage.ts        # ストレージ関連
└── validation.ts     # バリデーション
```

## コーディング規約

### TypeScript

- 厳密な型チェックを有効にする
- `any` 型の使用を避ける
- インターフェースとタイプエイリアスを適切に使用
- 型推論を活用する

```typescript
// 良い例
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// 悪い例
const todo: any = {
  id: "1",
  title: "タスク",
  completed: false
};
```

### コンポーネント命名

- ファイル名: PascalCase (例: `TodoItem.tsx`)
- コンポーネント名: PascalCase (例: `TodoItem`)
- ディレクトリ名: kebab-case (例: `todo-item`)

### インポート順序

```typescript
// 1. React関連
import React from 'react';
import { View, Text } from 'react-native';

// 2. サードパーティライブラリ
import { useNavigation } from '@react-navigation/native';

// 3. 内部モジュール
import { TodoItem } from '@/components/TodoItem';
import { useTodo } from '@/hooks/useTodo';

// 4. 型定義
import type { Todo } from '@/types/todo';
```

## コンポーネント開発

### コンポーネントの基本構造

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TodoItemProps } from './types';

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{todo.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
```

### Props型定義

```typescript
// types/todo.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
```

## 状態管理

### React Hooksの使用

```typescript
// hooks/useTodo.ts
import { useState, useCallback } from 'react';
import type { Todo } from '@/types/todo';

export const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = useCallback((title: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
    };
    setTodos(prev => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
};
```

## ナビゲーション

### Expo Routerの使用

```typescript
// app/(tabs)/index.tsx
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>ホーム画面</Text>
      <Link href="/todo/new">新しいTodoを作成</Link>
    </View>
  );
}
```

### 型安全なナビゲーション

```typescript
// types/navigation.ts
export type RootStackParamList = {
  Home: undefined;
  TodoDetail: { id: string };
  NewTodo: undefined;
};

// 使用例
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/todo/detail?id=123');
```

## スタイリング

### StyleSheetの使用

```typescript
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
});
```

### テーマ対応

```typescript
// constants/Colors.ts
export const Colors = {
  light: {
    background: '#ffffff',
    text: '#000000',
    primary: '#007AFF',
  },
  dark: {
    background: '#000000',
    text: '#ffffff',
    primary: '#0A84FF',
  },
};
```

## テスト

### テスト計画

- **テスト対象**: Todo作成・編集・削除・完了切替、猫成長システム（XP加算・成長UI）、永続化（AsyncStorage）、UI表示（タブ・リスト・フォーム）
- **テスト観点**:
  - 正常系: 各機能が期待通り動作するか
  - 異常系: 未入力・長文・不正値などのバリデーション
  - UI: 表示崩れや誤動作がないか
  - 永続化: リロード・再起動後もデータが保持されるか
- **テスト方法**:
  - ユニットテスト（Jest＋React Native Testing Library推奨）
  - 手動E2Eテスト（Expo Go/エミュレータ/実機）

### 自動テスト導入・実行手順

1. 必要パッケージのインストール

   ```bash
   npm install --save-dev jest @testing-library/react-native @testing-library/jest-native @types/jest ts-jest
   ```

2. Jest設定ファイル作成（jest.config.js）

   ```js
   module.exports = {
     preset: 'react-native',
     transform: {
       '^.+\\.(js|ts|tsx)$': 'ts-jest',
     },
     testMatch: [
       '**/__tests__/**/*.test.(ts|tsx|js)',
       '**/?(*.)+(spec|test).(ts|tsx|js)'
     ],
     setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
   };
   ```

3. テストディレクトリ・サンプルテスト作成

   ```
   __tests__/
     components/
       TodoItem.test.tsx
     hooks/
       useTodo.test.ts
   ```

   例: `__tests__/components/TodoItem.test.tsx`

   ```tsx
   import React from 'react';
   import { render } from '@testing-library/react-native';
   import { TodoItem } from '../../components/TodoItem';

   test('タイトルが表示される', () => {
     const { getByText } = render(<TodoItem todo={{ id: '1', title: 'テスト', completed: false, createdAt: new Date(), updatedAt: new Date() }} onToggle={() => {}} onDelete={() => {}} />);
     expect(getByText('テスト')).toBeTruthy();
   });
   ```

4. package.jsonにテストスクリプト追加

   ```json
   "scripts": {
     "test": "jest"
   }
   ```

5. テスト実行

   ```bash
   npm test
   ```

### 既存のテスト実行方法

```bash
# 全テスト実行
npm test

# ウォッチモード
npm test -- --watch

# カバレッジ
npm test -- --coverage
```

### 注意：Expo + Jestの現状の限界と推奨運用

- Expo/React Nativeの最新環境では、一部の依存パッケージ（expo-modules-core等）がESM形式で配布されており、Jest（CJSベース）での完全な自動テスト実行が困難な場合があります。
- そのため、現状では「ロジック部分（hooks/utils等）のみユニットテスト」「UIや統合テストは手動またはE2E（Detox等）で補完」する運用を推奨します。
- Jest/Expoの公式アップデートや、テスト戦略の最新情報も随時確認してください。

## デバッグ

### React Native Debugger

1. React Native Debuggerをインストール
2. 開発サーバー起動時に自動で接続
3. Chrome DevToolsでデバッグ

### ログ出力

```typescript
import { LogBox } from 'react-native';

// 開発時のみログを有効
if (__DEV__) {
  LogBox.ignoreLogs(['Warning:']);
}
```

## パフォーマンス最適化

### メモ化

```typescript
import React, { memo, useMemo, useCallback } from 'react';

// コンポーネントのメモ化
export const TodoItem = memo(({ todo, onToggle }) => {
  // 重い計算のメモ化
  const formattedDate = useMemo(() => {
    return todo.createdAt.toLocaleDateString();
  }, [todo.createdAt]);

  // コールバックのメモ化
  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [todo.id, onToggle]);

  return (
    <View>
      <Text>{todo.title}</Text>
      <Text>{formattedDate}</Text>
    </View>
  );
});
```

### リストの最適化

```typescript
import { FlatList } from 'react-native';

const TodoList = ({ todos, onToggle }) => {
  const renderItem = useCallback(({ item }) => (
    <TodoItem todo={item} onToggle={onToggle} />
  ), [onToggle]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <FlatList
      data={todos}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};
```

## トラブルシューティング

### よくある問題

1. **Metro bundlerのエラー**
   ```bash
   npx expo start --clear
   ```

2. **依存関係の競合**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScriptエラー**
   ```bash
   npx tsc --noEmit
   ```

### デバッグコマンド

```bash
# 依存関係の確認
npm ls

# 型チェック
npx tsc --noEmit

# ESLint
npx eslint . --ext .ts,.tsx

# フォーマット
npx prettier --write .
``` 