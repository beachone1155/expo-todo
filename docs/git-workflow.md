# Git Workflow

## 概要

このプロジェクトでは、Git Flowワークフローを採用しています。これにより、開発の効率性とコードの品質を保ちながら、チーム開発を円滑に進めることができます。

## ブランチ戦略

### メインブランチ

- **`main`**: 本番環境用のブランチ
  - 常にデプロイ可能な状態を保つ
  - 直接コミットしない
  - リリース時にdevelopブランチからマージ

- **`develop`**: 開発用のメインブランチ
  - 最新の開発変更が含まれる
  - featureブランチのマージ先
  - テスト完了後にmainブランチにマージ

### サポートブランチ

- **`feature/*`**: 機能開発用ブランチ
  - 例: `feature/todo-implementation`, `feature/user-authentication`
  - developブランチから分岐
  - 開発完了後にdevelopブランチにマージ

- **`release/*`**: リリース準備用ブランチ
  - 例: `release/v1.0.0`
  - developブランチから分岐
  - バグ修正とリリース準備
  - 完了後にmainとdevelopブランチにマージ

- **`hotfix/*`**: 緊急修正用ブランチ
  - 例: `hotfix/critical-bug-fix`
  - mainブランチから分岐
  - 緊急修正後にmainとdevelopブランチにマージ

## ワークフロー

### 1. 機能開発

```bash
# developブランチに切り替え
git checkout develop
git pull origin develop

# featureブランチを作成
git checkout -b feature/new-feature

# 開発作業
# ... コードの変更 ...

# コミット
git add .
git commit -m "feat: 新機能の実装"

# リモートにプッシュ
git push -u origin feature/new-feature

# プルリクエストを作成（GitHub上で）
# developブランチにマージ
```

### 2. リリース準備

```bash
# developブランチからリリースブランチを作成
git checkout develop
git checkout -b release/v1.0.0

# バージョン番号の更新
# package.json, app.jsonの更新

# バグ修正や最終調整
git commit -m "fix: リリース前のバグ修正"

# mainブランチにマージ
git checkout main
git merge release/v1.0.0

# タグを作成
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0

# developブランチにもマージ
git checkout develop
git merge release/v1.0.0

# リリースブランチを削除
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

### 3. 緊急修正

```bash
# mainブランチからhotfixブランチを作成
git checkout main
git checkout -b hotfix/critical-bug

# 緊急修正
git commit -m "fix: 緊急バグ修正"

# mainブランチにマージ
git checkout main
git merge hotfix/critical-bug

# タグを作成
git tag -a v1.0.1 -m "Version 1.0.1"
git push origin v1.0.1

# developブランチにもマージ
git checkout develop
git merge hotfix/critical-bug

# hotfixブランチを削除
git branch -d hotfix/critical-bug
git push origin --delete hotfix/critical-bug
```

## コミットメッセージ規約

### 形式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- **feat**: 新機能
- **fix**: バグ修正
- **docs**: ドキュメントのみの変更
- **style**: コードの意味に影響しない変更（空白、フォーマット等）
- **refactor**: バグ修正や機能追加ではないコードの変更
- **test**: テストの追加や修正
- **chore**: ビルドプロセスや補助ツールの変更

### 例
```bash
git commit -m "feat(todo): Todoアイテムの追加機能を実装

- TodoItemコンポーネントの作成
- useTodoフックの実装
- AsyncStorageでの永続化

Closes #123"
```

## プルリクエスト

### 作成手順

1. **ブランチの準備**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature
   ```

2. **開発作業**
   - 機能の実装
   - テストの追加
   - ドキュメントの更新

3. **プルリクエストの作成**
   - GitHubでプルリクエストを作成
   - ベースブランチ: `develop`
   - 比較ブランチ: `feature/your-feature`

4. **レビュー**
   - コードレビューの実施
   - CI/CDの通過確認
   - 必要に応じて修正

5. **マージ**
   - レビュー完了後にマージ
   - featureブランチの削除

### プルリクエストテンプレート

```markdown
## 概要
このプルリクエストで実装した機能の概要

## 変更内容
- 変更点1
- 変更点2
- 変更点3

## テスト
- [ ] 単体テストの追加
- [ ] 統合テストの追加
- [ ] 手動テストの実施

## スクリーンショット
（UI変更がある場合）

## 関連Issue
Closes #123

## チェックリスト
- [ ] コードレビューを実施した
- [ ] テストが通ることを確認した
- [ ] ドキュメントを更新した
- [ ] コミットメッセージが適切である
```

## ブランチ保護ルール

### mainブランチ
- 直接プッシュ禁止
- プルリクエスト必須
- レビュー必須（最低1名）
- CI/CDの通過必須

### developブランチ
- 直接プッシュ禁止
- プルリクエスト必須
- レビュー推奨
- CI/CDの通過必須

## 便利なGitコマンド

### ブランチ管理
```bash
# ブランチ一覧
git branch -a

# リモートブランチの削除
git push origin --delete branch-name

# ローカルブランチの削除
git branch -d branch-name

# ブランチの強制削除
git branch -D branch-name
```

### 履歴確認
```bash
# コミット履歴
git log --oneline --graph

# 特定のファイルの変更履歴
git log --follow filename

# ブランチ間の差分
git diff main..develop
```

### 状態確認
```bash
# 現在の状態
git status

# 変更内容の確認
git diff

# ステージングされた変更の確認
git diff --cached
```

## トラブルシューティング

### よくある問題

#### 1. コンフリクトの解決
```bash
# コンフリクトの確認
git status

# コンフリクトファイルの編集
# ... 手動で解決 ...

# 解決後のコミット
git add .
git commit -m "fix: コンフリクトを解決"
```

#### 2. 間違ったブランチでの作業
```bash
# 変更を一時保存
git stash

# 正しいブランチに切り替え
git checkout correct-branch

# 変更を復元
git stash pop
```

#### 3. コミットの取り消し
```bash
# 直前のコミットを取り消し（変更は保持）
git reset --soft HEAD~1

# 直前のコミットを完全に取り消し
git reset --hard HEAD~1

# 特定のコミットまで戻る
git reset --hard commit-hash
```

## ベストプラクティス

1. **小さなコミット**: 1つのコミットに1つの変更
2. **頻繁なプッシュ**: 作業の進捗を定期的にプッシュ
3. **明確なメッセージ**: コミットメッセージは具体的に
4. **ブランチの整理**: 完了したブランチは削除
5. **レビューの活用**: コードレビューを積極的に行う

## 参考リンク

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/) 