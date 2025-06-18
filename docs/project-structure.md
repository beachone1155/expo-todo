# Expo Todo プロジェクト構成

## 概要
このプロジェクトは、Expo Routerを使用したTypeScriptベースのTodoアプリケーションです。

## ディレクトリ構成

```
expo-todo/
├── .git/                          # Gitリポジトリ
├── .expo/                         # Expo設定ファイル
├── node_modules/                  # npm依存関係
├── package.json                   # プロジェクト設定・依存関係
├── package-lock.json              # 依存関係ロックファイル
├── app.json                       # Expo設定ファイル
├── tsconfig.json                  # TypeScript設定
├── eslint.config.js               # ESLint設定
├── expo-env.d.ts                  # Expo型定義
├── README.md                      # プロジェクト説明
├── .gitignore                     # Git除外設定
├── .vscode/                       # VSCode設定
├── scripts/                       # ビルド・デプロイスクリプト
├── app/                           # アプリメイン（Expo Router）
│   ├── (tabs)/                    # タブナビゲーション
│   │   ├── _layout.tsx            # タブレイアウト
│   │   ├── index.tsx              # ホーム画面
│   │   └── explore.tsx            # 探索画面
│   ├── _layout.tsx                # ルートレイアウト
│   └── +not-found.tsx             # 404ページ
├── components/                    # 再利用可能コンポーネント
│   ├── ui/                        # UIコンポーネント
│   │   ├── IconSymbol.tsx         # アイコンコンポーネント
│   │   ├── IconSymbol.ios.tsx     # iOS専用アイコン
│   │   ├── TabBarBackground.tsx   # タブバー背景
│   │   └── TabBarBackground.ios.tsx # iOS専用タブバー背景
│   ├── Collapsible.tsx            # 折りたたみコンポーネント
│   ├── ExternalLink.tsx           # 外部リンクコンポーネント
│   ├── HapticTab.tsx              # 触覚フィードバックタブ
│   ├── HelloWave.tsx              # 挨拶コンポーネント
│   ├── ParallaxScrollView.tsx     # パララックススクロールビュー
│   ├── ThemedText.tsx             # テーマ付きテキスト
│   └── ThemedView.tsx             # テーマ付きビュー
├── constants/                     # 定数定義
│   └── Colors.ts                  # カラー定義
├── hooks/                         # カスタムフック
│   ├── useColorScheme.ts          # カラースキームフック
│   ├── useColorScheme.web.ts      # Web用カラースキームフック
│   └── useThemeColor.ts           # テーマカラーフック
└── assets/                        # 静的アセット
    ├── fonts/                     # フォントファイル
    └── images/                    # 画像ファイル
```

## 主要ディレクトリの説明

### `/app`
Expo Routerを使用したファイルベースルーティングのディレクトリです。
- `(tabs)/`: タブナビゲーション用のグループ
- `_layout.tsx`: ルートレイアウト
- `+not-found.tsx`: 404エラーページ

### `/components`
再利用可能なReactコンポーネントを格納します。
- `ui/`: 基本的なUIコンポーネント
- その他: 機能別のコンポーネント

### `/constants`
アプリケーション全体で使用する定数を定義します。
- `Colors.ts`: テーマカラーの定義

### `/hooks`
カスタムReactフックを格納します。
- カラースキーム関連のフック
- テーマ関連のフック

### `/assets`
静的ファイル（画像、フォントなど）を格納します。

## 技術スタック

- **フレームワーク**: Expo SDK
- **言語**: TypeScript
- **ルーティング**: Expo Router
- **ナビゲーション**: React Navigation (Expo Router内蔵)
- **スタイリング**: React Native StyleSheet

## 開発環境

- Node.js
- Expo CLI
- TypeScript
- ESLint

## コマンド

```bash
# 開発サーバー起動
npx expo start

# iOSシミュレータで起動
npm run ios

# Androidエミュレータで起動
npm run android

# Webブラウザで起動
npm run web
```

## 注意事項

- このプロジェクトはExpo Router v3を使用しています
- TypeScriptの厳密な型チェックが有効です
- ESLintによるコード品質チェックが設定されています 