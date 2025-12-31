# API ドキュメント

このドキュメントでは、マンダラート管理アプリケーションのバックエンドAPIエンドポイントについて説明します。

## 目次

- [認証について](#認証について)
- [Mandalart API](#mandalart-api)
- [Goal API](#goal-api)
- [Task API](#task-api)
- [Snapshot API](#snapshot-api)
- [エラーレスポンス](#エラーレスポンス)

## 認証について

現在、認証機能は実装されていません。将来的にはユーザー認証を追加する予定です。

## Mandalart API

### マンダラート一覧取得

**エンドポイント:** `GET /api/mandalarts`

**クエリパラメータ:**
- `userId` (必須): ユーザーID
- `status` (オプション): ステータスでフィルタ (`ACTIVE`, `COMPLETED`, `DELETED`)

**レスポンス例:**
```json
[
  {
    "id": "clxxx...",
    "mainGoal": "健康的な生活を送る",
    "status": "ACTIVE",
    "userId": "user123",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": null,
    "goals": [
      {
        "id": "goal1",
        "title": "運動習慣をつける",
        "position": 1,
        "tasks": [...]
      }
    ]
  }
]
```

### マンダラート作成

**エンドポイント:** `POST /api/mandalarts`

**リクエストボディ:**
```json
{
  "userId": "user123",
  "mainGoal": "健康的な生活を送る",
  "goals": [
    {
      "title": "運動習慣をつける",
      "tasks": [
        {
          "title": "ジムに行く",
          "targetCount": 7,
          "targetUnit": "回"
        },
        // ... 残り7つのタスク
      ]
    },
    // ... 残り7つの目標
  ]
}
```

**バリデーション:**
- `userId`: 必須、1文字以上
- `mainGoal`: 必須、1文字以上
- `goals`: 配列、必ず8つの目標が必要
- 各`goal`には必ず8つの`tasks`が必要
- `task.title`: 必須、1文字以上
- `task.targetCount`: 必須、1以上の整数
- `task.targetUnit`: 必須、1文字以上

**レスポンス例:**
```json
{
  "id": "clxxx...",
  "mainGoal": "健康的な生活を送る",
  "status": "ACTIVE",
  "userId": "user123",
  "startDate": "2024-01-01T00:00:00.000Z",
  "goals": [...]
}
```

### マンダラート詳細取得

**エンドポイント:** `GET /api/mandalarts/[id]`

**レスポンス例:**
```json
{
  "id": "clxxx...",
  "mainGoal": "健康的な生活を送る",
  "status": "ACTIVE",
  "userId": "user123",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": null,
  "goals": [...],
  "snapshots": [...]
}
```

### マンダラート更新

**エンドポイント:** `PUT /api/mandalarts/[id]`

**リクエストボディ:**
```json
{
  "mainGoal": "より健康的な生活を送る",
  "status": "ACTIVE"
}
```

**注意:**
- 完了済み（`COMPLETED`）のマンダラートは更新できません
- 削除済みのマンダラートは更新できません

### マンダラート削除

**エンドポイント:** `DELETE /api/mandalarts/[id]`

**クエリパラメータ:**
- `hard` (オプション): `true`の場合、物理削除を実行

**デフォルト（ソフトデリート）:**
```json
{
  "success": true,
  "message": "Mandalart soft deleted",
  "data": {...}
}
```

**ハードデリート:**
```json
{
  "success": true,
  "message": "Mandalart permanently deleted"
}
```

### マンダラート完了

**エンドポイント:** `POST /api/mandalarts/[id]/complete`

**レスポンス例:**
```json
{
  "success": true,
  "message": "Mandalart completed successfully",
  "data": {
    "id": "clxxx...",
    "status": "COMPLETED",
    "endDate": "2024-12-31T00:00:00.000Z",
    ...
  }
}
```

## Goal API

### 目標詳細取得

**エンドポイント:** `GET /api/goals/[id]`

**レスポンス例:**
```json
{
  "id": "goal1",
  "title": "運動習慣をつける",
  "position": 1,
  "mandalartId": "clxxx...",
  "tasks": [...],
  "mandalart": {...}
}
```

### 目標更新

**エンドポイント:** `PUT /api/goals/[id]`

**リクエストボディ:**
```json
{
  "title": "運動習慣を身につける"
}
```

**注意:**
- 完了済みまたは削除済みのマンダラートの目標は更新できません

### 目標削除

**エンドポイント:** `DELETE /api/goals/[id]`

**注意:**
- 目標の削除は通常推奨されません（データ整合性のため）
- 完了済みまたは削除済みのマンダラートの目標は削除できません

## Task API

### タスク詳細取得

**エンドポイント:** `GET /api/tasks/[id]`

**レスポンス例:**
```json
{
  "id": "task1",
  "title": "ジムに行く",
  "currentCount": 3,
  "targetCount": 7,
  "targetUnit": "回",
  "position": 1,
  "goalId": "goal1",
  "goal": {...}
}
```

### タスク更新

**エンドポイント:** `PUT /api/tasks/[id]`

**リクエストボディ:**
```json
{
  "title": "ジムでトレーニング",
  "currentCount": 5,
  "targetCount": 10,
  "targetUnit": "回"
}
```

**注意:**
- 完了済みまたは削除済みのマンダラートのタスクは更新できません

### タスクカウントのインクリメント

**エンドポイント:** `POST /api/tasks/[id]/increment`

**説明:** タスクの`currentCount`を1増やす便利なエンドポイント

**レスポンス例:**
```json
{
  "success": true,
  "message": "Task count incremented successfully",
  "data": {
    "id": "task1",
    "currentCount": 4,
    "targetCount": 7,
    ...
  }
}
```

**注意:**
- 完了済みまたは削除済みのマンダラートのタスクはインクリメントできません
- `currentCount >= targetCount`の場合、エラーが返されます

### タスク削除

**エンドポイント:** `DELETE /api/tasks/[id]`

**注意:**
- タスクの削除は通常推奨されません（データ整合性のため）
- 完了済みまたは削除済みのマンダラートのタスクは削除できません

## Snapshot API

### スナップショット一覧取得

**エンドポイント:** `GET /api/mandalarts/[id]/snapshots`

**説明:** 特定のマンダラートのスナップショット一覧を取得

**レスポンス例:**
```json
[
  {
    "id": "snapshot1",
    "mandalartId": "clxxx...",
    "mainGoal": "健康的な生活を送る",
    "snapshotData": {
      "goals": [...]
    },
    "weekStartDate": "2024-01-01T00:00:00.000Z",
    "weekEndDate": "2024-01-07T23:59:59.999Z",
    "createdAt": "2024-01-07T23:59:59.000Z"
  }
]
```

### スナップショット作成

**エンドポイント:** `POST /api/mandalarts/[id]/snapshots`

**説明:** 現在の週のスナップショットを作成

**注意:**
- 同じ週のスナップショットが既に存在する場合、エラーが返されます
- 週の開始日（月曜日）と終了日（日曜日）は自動計算されます

**レスポンス例:**
```json
{
  "id": "snapshot1",
  "mandalartId": "clxxx...",
  "mainGoal": "健康的な生活を送る",
  "snapshotData": {...},
  "weekStartDate": "2024-01-01T00:00:00.000Z",
  "weekEndDate": "2024-01-07T23:59:59.999Z",
  "createdAt": "2024-01-07T23:59:59.000Z"
}
```

### スナップショット詳細取得

**エンドポイント:** `GET /api/snapshots/[id]`

**レスポンス例:**
```json
{
  "id": "snapshot1",
  "mandalartId": "clxxx...",
  "mainGoal": "健康的な生活を送る",
  "snapshotData": {
    "goals": [
      {
        "id": "goal1",
        "title": "運動習慣をつける",
        "position": 1,
        "tasks": [...]
      }
    ]
  },
  "weekStartDate": "2024-01-01T00:00:00.000Z",
  "weekEndDate": "2024-01-07T23:59:59.999Z",
  "mandalart": {...}
}
```

### スナップショット削除

**エンドポイント:** `DELETE /api/snapshots/[id]`

**クエリパラメータ:**
- `force` (必須): `true`を指定しないと削除できません

**注意:**
- スナップショットの削除は通常推奨されません（履歴保全のため）
- 緊急時のみ`?force=true`を使用して削除可能

## エラーレスポンス

### バリデーションエラー（400）

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "number",
      "path": ["mainGoal"],
      "message": "Expected string, received number"
    }
  ]
}
```

### リソースが見つからない（404）

```json
{
  "error": "Mandalart not found"
}
```

### 削除済みリソース（410）

```json
{
  "error": "Mandalart has been deleted"
}
```

### サーバーエラー（500）

```json
{
  "error": "Failed to create mandalart"
}
```

## 型安全性について

すべてのAPIエンドポイントは、**Zod**を使用した型安全なバリデーションを実装しています。

バリデーションスキーマは`app/api/mandalarts/schemas.ts`に定義されており、以下の型が利用可能です：

- `CreateMandalartInput`
- `UpdateMandalartInput`
- `CreateGoalInput`
- `UpdateGoalInput`
- `CreateTaskInput`
- `UpdateTaskInput`

これらの型は、TypeScriptの型推論により自動的に生成されます。

## 使用例

### マンダラートの作成からタスク更新までの流れ

```typescript
// 1. マンダラートを作成
const response = await fetch('/api/mandalarts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    mainGoal: '健康的な生活を送る',
    goals: [
      {
        title: '運動習慣をつける',
        tasks: [
          { title: 'ジムに行く', targetCount: 7, targetUnit: '回' },
          // ... 残り7つ
        ]
      },
      // ... 残り7つの目標
    ]
  })
});
const mandalart = await response.json();

// 2. タスクの実行回数をインクリメント
const taskId = mandalart.goals[0].tasks[0].id;
await fetch(`/api/tasks/${taskId}/increment`, {
  method: 'POST'
});

// 3. 週次スナップショットを作成
await fetch(`/api/mandalarts/${mandalart.id}/snapshots`, {
  method: 'POST'
});

// 4. マンダラートを完了
await fetch(`/api/mandalarts/${mandalart.id}/complete`, {
  method: 'POST'
});
```
