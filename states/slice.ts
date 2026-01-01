import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MandalartState, initialState } from './state';
import { Mandalart, EditingCell, Task } from './mandalart';

export const mandalartSlice = createSlice({
  name: 'mandalart',
  initialState,
  reducers: {
    // マンダラートを設定
    setCurrentMandalart: (state, action: PayloadAction<Mandalart>) => {
      state.currentMandalart = action.payload;
      state.error = null;
    },

    // マンダラート一覧を設定
    setMandalarts: (state, action: PayloadAction<Mandalart[]>) => {
      state.mandalarts = action.payload;
    },

    // 大目標を更新
    updateMainGoal: (state, action: PayloadAction<string>) => {
      if (state.currentMandalart) {
        state.currentMandalart.mainGoal = action.payload;
      }
    },

    // 目標を更新
    updateGoal: (
      state,
      action: PayloadAction<{ goalId: string; title: string }>
    ) => {
      if (state.currentMandalart) {
        const goal = state.currentMandalart.goals.find(
          (g) => g.id === action.payload.goalId
        );
        if (goal) {
          goal.title = action.payload.title;
        }
      }
    },

    // タスクを更新
    updateTask: (
      state,
      action: PayloadAction<{
        goalId: string;
        taskId: string;
        updates: Partial<Task>;
      }>
    ) => {
      if (state.currentMandalart) {
        const goal = state.currentMandalart.goals.find(
          (g) => g.id === action.payload.goalId
        );
        if (goal) {
          const task = goal.tasks.find((t) => t.id === action.payload.taskId);
          if (task) {
            Object.assign(task, action.payload.updates);
          }
        }
      }
    },

    // タスクのカウントをインクリメント
    incrementTaskCount: (
      state,
      action: PayloadAction<{ goalId: string; taskId: string }>
    ) => {
      if (state.currentMandalart) {
        const goal = state.currentMandalart.goals.find(
          (g) => g.id === action.payload.goalId
        );
        if (goal) {
          const task = goal.tasks.find((t) => t.id === action.payload.taskId);
          if (task && task.currentCount < task.targetCount) {
            task.currentCount += 1;
          }
        }
      }
    },

    // セルを選択
    selectCell: (state, action: PayloadAction<string | null>) => {
      state.selectedCellId = action.payload;
    },

    // 編集中のセルを設定
    setEditingCell: (state, action: PayloadAction<EditingCell | null>) => {
      state.editingCell = action.payload;
    },

    // ローディング状態を設定
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // エラーを設定
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // 状態をリセット
    resetState: () => initialState,
  },
});

export const {
  setCurrentMandalart,
  setMandalarts,
  updateMainGoal,
  updateGoal,
  updateTask,
  incrementTaskCount,
  selectCell,
  setEditingCell,
  setLoading,
  setError,
  resetState,
} = mandalartSlice.actions;

export default mandalartSlice.reducer;
