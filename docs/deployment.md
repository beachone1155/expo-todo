# デプロイメントガイド

## 目次

1. [概要](#概要)
2. [開発環境でのテスト](#開発環境でのテスト)
3. [EAS Build](#eas-build)
4. [App Store/Google Play Store](#app-storegoogle-play-store)
5. [Webデプロイメント](#webデプロイメント)
6. [環境変数の管理](#環境変数の管理)
7. [トラブルシューティング](#トラブルシューティング)

## 概要

このドキュメントでは、Expo Todoアプリケーションのデプロイメント手順を説明します。

### デプロイメントオプション

- **EAS Build**: Expo Application Servicesを使用したクラウドビルド
- **App Store**: iOSアプリの配布
- **Google Play Store**: Androidアプリの配布
- **Web**: Webアプリケーションの配布

## 開発環境でのテスト

### 前提条件

```bash
# 依存関係のインストール
npm install

# Expo CLIのインストール
npm install -g @expo/cli

# EAS CLIのインストール
npm install -g @expo/eas-cli
```

### ローカルテスト

```bash
# 開発サーバー起動
npx expo start

# iOSシミュレータでテスト
npm run ios

# Androidエミュレータでテスト
npm run android

# Webブラウザでテスト
npm run web
```

### 実機テスト

```bash
# Expo Goアプリでテスト
npx expo start --tunnel

# 開発ビルドでテスト
npx expo run:ios
npx expo run:android
```

## EAS Build

### EAS CLIのセットアップ

```bash
# EASにログイン
eas login

# プロジェクトの初期化
eas build:configure
```

### app.jsonの設定

```json
{
  "expo": {
    "name": "Expo Todo",
    "slug": "expo-todo",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.expotodo"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.expotodo"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### eas.jsonの設定

```json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### ビルドの実行

```bash
# 開発ビルド
eas build --platform ios --profile development
eas build --platform android --profile development

# プレビュービルド
eas build --platform all --profile preview

# 本番ビルド
eas build --platform all --profile production
```

### ビルドの監視

```bash
# ビルド状況の確認
eas build:list

# 特定のビルドの詳細
eas build:view [BUILD_ID]
```

## App Store/Google Play Store

### App Store Connect

#### 1. アプリの準備

```bash
# 本番ビルドの作成
eas build --platform ios --profile production
```

#### 2. App Store Connectでの設定

1. [App Store Connect](https://appstoreconnect.apple.com)にアクセス
2. 新しいアプリを作成
3. アプリ情報を入力
   - アプリ名: "Expo Todo"
   - プライマリ言語: "日本語"
   - バンドルID: "com.yourcompany.expotodo"
   - SKU: 一意の識別子

#### 3. メタデータの準備

```json
{
  "appName": "Expo Todo",
  "description": "シンプルで使いやすいTodoアプリ",
  "keywords": ["todo", "タスク管理", "生産性"],
  "category": "Productivity",
  "screenshots": [
    "./assets/screenshots/ios/1.png",
    "./assets/screenshots/ios/2.png",
    "./assets/screenshots/ios/3.png"
  ]
}
```

#### 4. アプリの提出

```bash
# App Storeへの提出
eas submit --platform ios
```

### Google Play Console

#### 1. アプリの準備

```bash
# 本番ビルドの作成
eas build --platform android --profile production
```

#### 2. Google Play Consoleでの設定

1. [Google Play Console](https://play.google.com/console)にアクセス
2. 新しいアプリを作成
3. アプリ情報を入力
   - アプリ名: "Expo Todo"
   - デフォルト言語: "日本語"
   - アプリまたはゲーム: "アプリ"
   - 無料または有料: "無料"

#### 3. メタデータの準備

```json
{
  "appName": "Expo Todo",
  "shortDescription": "シンプルなTodoアプリ",
  "fullDescription": "使いやすく、直感的なTodoアプリケーションです。",
  "keywords": ["todo", "タスク管理", "生産性"],
  "category": "Productivity",
  "screenshots": [
    "./assets/screenshots/android/1.png",
    "./assets/screenshots/android/2.png",
    "./assets/screenshots/android/3.png"
  ]
}
```

#### 4. アプリの提出

```bash
# Google Play Storeへの提出
eas submit --platform android
```

## Webデプロイメント

### Vercel

#### 1. Vercel CLIのインストール

```bash
npm install -g vercel
```

#### 2. プロジェクトの設定

```json
// vercel.json
{
  "buildCommand": "npx expo export:web",
  "outputDirectory": "web-build",
  "framework": "expo",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 3. デプロイメント

```bash
# Vercelにログイン
vercel login

# プロジェクトのデプロイ
vercel

# 本番環境へのデプロイ
vercel --prod
```

### Netlify

#### 1. ビルド設定

```toml
# netlify.toml
[build]
  command = "npx expo export:web"
  publish = "web-build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. デプロイメント

```bash
# Netlify CLIのインストール
npm install -g netlify-cli

# ログイン
netlify login

# デプロイ
netlify deploy --prod
```

## 環境変数の管理

### .envファイルの設定

```bash
# .env.production
EXPO_PUBLIC_API_URL=https://api.yourapp.com
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### EASでの環境変数設定

```bash
# 環境変数の設定
eas secret:create --scope project --name API_URL --value "https://api.yourapp.com"
eas secret:create --scope project --name APP_ENV --value "production"
```

### 環境変数の使用

```typescript
// constants/Config.ts
export const Config = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  ANALYTICS_ID: process.env.EXPO_PUBLIC_ANALYTICS_ID,
};
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. ビルドエラー

```bash
# キャッシュのクリア
npx expo start --clear

# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install

# EASビルドのキャッシュクリア
eas build --clear-cache
```

#### 2. メタデータエラー

```bash
# メタデータの検証
eas build:configure

# アプリ設定の確認
npx expo config --type public
```

#### 3. 提出エラー

```bash
# 提出前の検証
eas submit --platform ios --latest
eas submit --platform android --latest

# 提出履歴の確認
eas submit:history
```

### デバッグコマンド

```bash
# プロジェクトの状態確認
npx expo doctor

# 依存関係の確認
npm ls

# 型チェック
npx tsc --noEmit

# ESLint
npx eslint . --ext .ts,.tsx

# ビルド設定の確認
eas build:configure --help
```

### ログの確認

```bash
# EASビルドログ
eas build:view [BUILD_ID] --logs

# 提出ログ
eas submit:history --platform ios
eas submit:history --platform android
```

## ベストプラクティス

### 1. バージョン管理

```json
// package.json
{
  "version": "1.0.0",
  "scripts": {
    "version:patch": "npm version patch",
    "version:minor": "npm version minor",
    "version:major": "npm version major"
  }
}
```

### 2. 自動化

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: eas build --platform all --non-interactive
```

### 3. セキュリティ

- 環境変数はEAS Secretsで管理
- APIキーは公開しない
- 本番環境ではデバッグモードを無効化

### 4. パフォーマンス

- アセットの最適化
- コード分割の活用
- キャッシュ戦略の実装

## 監視とメンテナンス

### 1. アナリティクス

```typescript
// utils/analytics.ts
import Analytics from 'expo-analytics';

export const analytics = {
  trackEvent: (event: string, properties?: object) => {
    Analytics.track(event, properties);
  },
  
  trackScreen: (screen: string) => {
    Analytics.track('Screen View', { screen });
  },
};
```

### 2. クラッシュレポート

```typescript
// utils/crashlytics.ts
import * as Sentry from '@sentry/react-native';

export const initCrashlytics = () => {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: process.env.EXPO_PUBLIC_APP_ENV,
  });
};
```

### 3. パフォーマンス監視

```typescript
// utils/performance.ts
import { Performance } from 'expo-performance';

export const performance = {
  startTrace: (name: string) => {
    return Performance.startTrace(name);
  },
  
  endTrace: (trace: any) => {
    Performance.endTrace(trace);
  },
};
``` 