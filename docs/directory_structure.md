# ディレクトリ構造

## プロジェクト全体のディレクトリ構成

```
mandalart-1/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # トップページ
│   ├── globals.css          # グローバルスタイル
│   ├── providers.tsx        # Redux Provider等のプロバイダー
│   └── [feature]/           # 機能別のページ
│       ├── page.tsx
│       └── layout.tsx
│
├── designs/                  # ドメインロジックを持たないUIコンポーネント (storybookは必ず含む)
│   ├── Button/
│   │   ├── index.tsx
        └── index.stories.tsx
│   ├── Input/
│   │   ├── index.tsx
        └── index.stories.tsx
│   └── Card/
│       └── index.tsx
│
├── widgets/                  # ドメインロジックを持つUIコンポーネント
│   ├── MandalartGrid/
│   │   └── index.tsx
│   ├── MandalartCell/
│   │   └── index.tsx
│   └── Header/
│       └── index.tsx
│
├── states/                   # 状態管理やドメインの型定義
│   ├── slice.ts             # Redux Toolkit のスライス定義（これのみ）
│   ├── state.ts             # ステート型と initialState の定義
│   ├── index.ts             # ストア、useSelector、useActions の export
│   ├── store.ts             # グローバルストアの設定
│   └── task.ts              # ドメイン知識の型定義（例）
│
├── libs/                     # ライブラリの腐敗防止層
│   └── prisma.ts            # Prisma クライアントのラッパー
│
└── prisma/                   # データベーススキーマ
    └── schema.prisma
```

## ディレクトリ・ファイルの役割

### app/

Next.js App Router の規約に従ったディレクトリです。

- ルーティング
- レイアウト
- ページコンポーネント
- API Routes（必要に応じて）

**注意:** ビジネスロジックやUIコンポーネントは `widgets/` と `designs/` に配置し、`app/` 内のページではそれらを組み合わせるのみとします。

### designs/

ドメインロジックを持たないUIコンポーネント（プレゼンテーショナルコンポーネント）

**配置するもの:**

- ボタン、入力フィールド、カードなどの汎用UIコンポーネント
- props で受け取った値を表示するだけのコンポーネント
- Redux stateに直接アクセスしないコンポーネント
- storybook 用のストーリーファイル（`index.stories.tsx`）

**命名規則:**

- コンポーネント名は PascalCase
- ディレクトリ名もコンポーネント名と同じ PascalCase
- エントリーポイントは `index.tsx`

### widgets/

ドメインロジックを持つUIコンポーネント（コンテナコンポーネント）

**配置するもの:**

- ビジネスロジックを含むコンポーネント
- Redux state にアクセスするコンポーネント
- API 呼び出しを行うコンポーネント
- `designs/` のコンポーネントを組み合わせて機能を実現するコンポーネント

**命名規則:**

- コンポーネント名は PascalCase
- ディレクトリ名もコンポーネント名と同じ PascalCase
- エントリーポイントは `index.tsx`

### states/

状態管理とドメインの型定義

ディレクトリ分けせず、フラットに以下のファイルで構成します：

**必須ファイル:**

- `slice.ts` - Redux Toolkit のスライス定義
- `state.ts` - ステート型と initialState の定義
- `index.ts` - ストア、useSelector、useActions の export
- `store.ts` - グローバルストアの設定

**オプションファイル:**

- Prisma の型定義で推論できないドメイン知識の型定義ファイル（例: `task.ts`, `mandalart.ts`）

#### slice.ts

Redux Toolkit のスライス定義。**このファイルのみにスライスを定義します。**

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState, initialState } from './state';

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateCell: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      const cell = state.cells.find((c) => c.id === action.payload.id);
      if (cell) {
        cell.content = action.payload.content;
      }
    },
    selectCell: (state, action: PayloadAction<string | null>) => {
      state.selectedCellId = action.payload;
    },
  },
});

export const { updateCell, selectCell } = appSlice.actions;
export default appSlice.reducer;
```

#### state.ts

ステート型と initialState の定義

```typescript
export interface Cell {
  id: string;
  content: string;
  row: number;
  col: number;
}

export interface AppState {
  cells: Cell[];
  selectedCellId: string | null;
}

export const initialState: AppState = {
  cells: [],
  selectedCellId: null,
};
```

#### index.ts

ストア、useSelector、useActions の export

useActions は useDispatch を内部で使用し、`const { updateCell } = useActions()` の形で使用可能にします。

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { RootState } from './store';
import { appSlice } from './slice';

// Selector
export const useAppSelector = () =>
  useSelector((state: RootState) => state.app);

// Actions
export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(appSlice.actions, dispatch);
};

// 型のエクスポート
export type { AppState, Cell } from './state';
```

**使用例:**

```typescript
// コンポーネント内での使用
const { cells, selectedCellId } = useAppSelector();
const { updateCell, selectCell } = useActions();

// アクション呼び出し
updateCell({ id: '1', content: 'New content' });
```

#### store.ts

グローバルストアの設定

```typescript
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
```

#### その他の型定義ファイル（オプション）

Prisma の型定義で推論できないドメイン知識の型定義を配置します。

**例: task.ts**

```typescript
// タスクのステータス
export type TaskStatus = 'todo' | 'in_progress' | 'done';

// タスクの優先度
export type TaskPriority = 'low' | 'medium' | 'high';

// マンダラートのセルタイプ
export type CellType = 'center' | 'goal' | 'sub_goal';

// ビジネスロジックで使用するドメインモデル
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  cellId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### libs/

ライブラリの腐敗防止層（Anti-Corruption Layer）

外部ライブラリとの依存関係を隔離し、アプリケーションコードが外部ライブラリの変更の影響を受けにくくします。

**配置するもの:**

- Prisma クライアントのラッパー

**例: prisma.ts**

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### prisma/

Prisma のスキーマファイルとマイグレーションファイルを配置します。

## 削除・再編成するディレクトリ

### components/ (削除)

`designs/` と `widgets/` に分割するため、`components/` ディレクトリは使用しません。

### lib/ (再編成)

以下のように再編成します：

- `lib/store.ts` → `states/store.ts`
- `lib/hooks.ts` → `states/index.ts`
- `lib/features/mandalart/mandalartSlice.ts` → `states/slice.ts`
- `lib/prisma.ts` → `libs/prisma.ts`

## ファイル命名規則

- コンポーネントファイル: PascalCase (例: `Button.tsx`, `MandalartGrid.tsx`)
- ユーティリティ・関数ファイル: camelCase (例: `formatDate.ts`, `calculateScore.ts`)
- 定数ファイル: camelCase (例: `constants.ts`)
- 型定義ファイル: camelCase (例: `types.ts`, `state.ts`)
- **CSS Modules は使用しない（Tailwind CSS を使用）**

## インポートの優先順位

```typescript
// 1. 外部ライブラリ
import React from 'react';
import { useSelector } from 'react-redux';

// 2. libs (腐敗防止層)
import { prisma } from '@/libs/prisma';

// 3. states (状態管理)
import { useAppSelector, useActions } from '@/states';

// 4. widgets (ドメインロジック付きUI)
import { MandalartGrid } from '@/widgets/MandalartGrid';

// 5. designs (純粋UI)
import { Button } from '@/designs/Button';

// 6. ローカルインポート
import { formatDate } from './utils';
```
