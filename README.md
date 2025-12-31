# Mandalart

目標達成のためのマンダラートアプリケーション

## 技術スタック

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: Redux Toolkit
- **アニメーション**: Framer Motion
- **データベース**: Vercel Postgres
- **ORM**: Prisma
- **パッケージマネージャー**: Bun

詳細は [docs/tech_stack.md](./docs/tech_stack.md) を参照してください。

## セットアップ

```bash
# 依存関係のインストール
bun install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してデータベース接続情報を設定

# Prismaマイグレーション
bunx prisma migrate dev

# 開発サーバーの起動
bun run dev
```

開発サーバーは [http://localhost:3000](http://localhost:3000) で起動します。

## スクリプト

- `bun run dev` - 開発サーバーを起動
- `bun run build` - 本番用ビルド
- `bun run start` - 本番サーバーを起動
- `bun run lint` - ESLintでコードチェック
- `bun run format` - Prettierでコードフォーマット

## プロジェクト構造

```
mandalart-1/
├── app/              # Next.js App Router
│   ├── layout.tsx    # ルートレイアウト
│   ├── page.tsx      # ホームページ
│   ├── providers.tsx # Redux Provider
│   └── globals.css   # グローバルスタイル
├── components/       # Reactコンポーネント
├── lib/              # ユーティリティとヘルパー
│   ├── store.ts      # Redux store
│   ├── hooks.ts      # カスタムRedux hooks
│   └── prisma.ts     # Prisma Client
├── prisma/           # Prismaスキーマとマイグレーション
└── docs/             # ドキュメント
```

## ライセンス

MIT
