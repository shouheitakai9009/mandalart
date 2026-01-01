# 技術スタック

このドキュメントでは、mandalart-1 プロジェクトで使用されている技術スタックを定義します。

## コア技術

### フレームワーク

- **Next.js**: フルスタック React フレームワーク
  - App Router を使用
  - Server Components と Client Components の併用
  - ビルドシステムは Next.js 標準（Webpack/Turbopack）

### 言語

- **TypeScript**: 型安全性を確保

### スタイリング

- **Tailwind CSS**: ユーティリティファースト CSS フレームワーク
  - JIT モードを使用
  - カスタムテーマ設定可能

### パッケージマネージャー

- **Bun**: 高速な JavaScript ランタイム・パッケージマネージャー
  - `bun install`でパッケージインストール
  - `bun run`でスクリプト実行

## 状態管理・データフェッチング

### 状態管理

- **Redux Toolkit**: 公式推奨の Redux 実装
  - `createSlice` でボイラープレートを削減
  - Immer による不変性管理
  - RTK Query でデータフェッチング（オプション）

### データベース

- **Supabase**: オープンソースの Firebase 代替
  - PostgreSQL データベース（AWS 上でホスティング）
  - リアルタイム機能
  - 認証・認可機能（将来的に使用予定）
  - Row Level Security (RLS) サポート

### ORM

- **Prisma**: 型安全な ORM
  - スキーマファーストの開発
  - 自動生成される TypeScript 型
  - マイグレーション管理機能
  - `@prisma/adapter-pg` によるコネクションプーリング対応

### バリデーション

- **Zod**: TypeScript ファーストのスキーマバリデーションライブラリ
  - API リクエストの型安全なバリデーション
  - 自動型推論
  - エラーメッセージのカスタマイズ

## UI/UX

### アニメーション

- **Framer Motion**: 宣言的アニメーションライブラリ
  - React コンポーネントベースの API
  - ジェスチャーサポート
  - レイアウトアニメーション

## 開発ツール

### リンティング・フォーマット

- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマット

### UI 開発・ドキュメント

- **Storybook**: UIコンポーネントの開発・テスト・ドキュメント化
  - Next.js Vite ビルダーを使用
  - アクセシビリティテスト（a11y addon）
  - Vitest統合によるコンポーネントテスト
  - 自動ドキュメント生成（Docs addon）

## インフラ・デプロイ

### ホスティング

- **Vercel**: Next.js 公式推奨プラットフォーム
  - Git 連携による自動デプロイ
  - プレビュー環境自動生成
  - Edge Network による高速配信

### データベースホスティング

- **Supabase**: PostgreSQL データベースホスティング
  - AWS リージョン: ap-northeast-1（東京）
  - コネクションプーリング対応（PgBouncer）
  - 自動バックアップ
  - 無料プランで開発可能
