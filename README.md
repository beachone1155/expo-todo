# Expo Todo App 📝

Expo Routerを使用したTypeScriptベースのTodoアプリケーションです。

## 🚀 機能

- ✅ Todoタスクの作成・編集・削除
- 📱 iOS/Android/Web対応
- 🌙 ダークモード対応
- 📊 タスク管理機能
- 🎨 モダンなUI/UX

## 🛠️ 技術スタック

- **フレームワーク**: Expo SDK
- **言語**: TypeScript
- **ルーティング**: Expo Router
- **ナビゲーション**: React Navigation
- **状態管理**: React Hooks
- **スタイリング**: React Native StyleSheet

## 📋 必要条件

- Node.js (v18以上)
- npm または yarn
- Expo CLI
- iOS開発: Xcode (macOS)
- Android開発: Android Studio

## 🚀 セットアップ

1. **リポジトリのクローン**
   ```bash
   git clone git@github.com:beachone1155/expo-todo.git
   cd expo-todo
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **Expoアカウントにログイン**
   ```bash
   expo login
   ```

4. **開発サーバーの起動**
   ```bash
   npx expo start
   ```

## 📱 アプリの実行

開発サーバー起動後、以下のオプションから選択できます：

- **iOSシミュレータ**: `npm run ios`
- **Androidエミュレータ**: `npm run android`
- **Webブラウザ**: `npm run web`
- **Expo Go**: QRコードをスキャン

## 📁 プロジェクト構造

詳細なプロジェクト構造については [docs/project-structure.md](docs/project-structure.md) を参照してください。

## 🧪 開発

### ファイルベースルーティング

このプロジェクトはExpo Routerを使用したファイルベースルーティングを採用しています：

- `app/` - アプリのメインページ
- `app/(tabs)/` - タブナビゲーション
- `components/` - 再利用可能なコンポーネント

### 開発のベストプラクティス

- TypeScriptの型定義を活用
- コンポーネントは `components/` ディレクトリに配置
- 定数は `constants/` ディレクトリに定義
- カスタムフックは `hooks/` ディレクトリに配置

## 📚 ドキュメント

- [プロジェクト構造](docs/project-structure.md)
- [開発ガイド](docs/development-guide.md)
- [API仕様](docs/api-specification.md)
- [デプロイメント](docs/deployment.md)

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🆘 サポート

問題が発生した場合や質問がある場合は、[Issues](../../issues) を作成してください。

## 🔗 リンク

- [Expo公式ドキュメント](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)
