// マンダラート関連の型定義

export interface Task {
  id: string;
  title: string;
  currentCount: number;
  targetCount: number;
  targetUnit: string;
  position: number; // 1-8
  goalId: string;
}

export interface Goal {
  id: string;
  title: string;
  position: number; // 1-8
  mandalartId: string;
  tasks: Task[];
}

export interface Mandalart {
  id: string;
  mainGoal: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DELETED';
  userId: string;
  goals: Goal[];
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// セルの種類
export type CellType = 'main' | 'goal' | 'task';

// セル位置の計算用
export interface CellPosition {
  row: number; // 0-8
  col: number; // 0-8
  type: CellType;
  goalPosition?: number; // goalまたはtaskの場合の目標位置 (1-8)
  taskPosition?: number; // taskの場合のタスク位置 (1-8)
}

// 編集中のセル情報
export interface EditingCell {
  type: CellType;
  id: string;
  value: string;
}
