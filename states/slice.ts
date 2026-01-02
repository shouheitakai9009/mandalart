import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MandalartState, initialState } from './state';
import { Mandalart, EditingCell, Task } from './mandalart';

// マンダラート一覧取得
export const fetchMandalarts = createAsyncThunk(
  'mandalart/fetchMandalarts',
  async (userId: string) => {
    const response = await fetch(`/api/mandalarts?userId=${userId}`);
    if (!response.ok) {
      throw new Error('マンダラートの取得に失敗しました');
    }
    return response.json();
  }
);

// タスク更新
export const updateTaskAsync = createAsyncThunk(
  'mandalart/updateTask',
  async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('タスクの更新に失敗しました');
    }
    return response.json();
  }
);

// タスク削除
export const deleteTaskAsync = createAsyncThunk(
  'mandalart/deleteTask',
  async ({ taskId, goalId }: { taskId: string; goalId: string }) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('タスクの削除に失敗しました');
    }
    return { taskId, goalId };
  }
);

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

    // マンダラート一覧のローディング状態を設定
    setLoadingMandalarts: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMandalarts = action.payload;
    },

    // タスクのローディング状態を設定
    setLoadingTask: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTask = action.payload;
    },

    // エラーを設定
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // 状態をリセット
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // fetchMandalarts
    builder
      .addCase(fetchMandalarts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMandalarts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mandalarts = action.payload;
        // 最初のアクティブなマンダラートを現在のマンダラートに設定
        const activeMandalart = action.payload.find(
          (m: Mandalart) => m.status === 'ACTIVE'
        );
        if (activeMandalart) {
          state.currentMandalart = activeMandalart;
        }
      })
      .addCase(fetchMandalarts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'マンダラートの取得に失敗しました';
      })
      // updateTaskAsync
      .addCase(updateTaskAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Redux Storeの該当タスクを更新
        if (state.currentMandalart) {
          const updatedTask = action.payload;
          const goal = state.currentMandalart.goals.find(
            (g) => g.id === updatedTask.goalId
          );
          if (goal) {
            const taskIndex = goal.tasks.findIndex(
              (t) => t.id === updatedTask.id
            );
            if (taskIndex !== -1) {
              goal.tasks[taskIndex] = updatedTask;
            }
          }
        }
        // mandalarts配列内も更新
        if (state.currentMandalart) {
          const mandalartIndex = state.mandalarts.findIndex(
            (m) => m.id === state.currentMandalart?.id
          );
          if (mandalartIndex !== -1) {
            state.mandalarts[mandalartIndex] = state.currentMandalart;
          }
        }
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'タスクの更新に失敗しました';
      })
      // deleteTaskAsync
      .addCase(deleteTaskAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Redux Storeから該当タスクを削除
        if (state.currentMandalart) {
          const { taskId, goalId } = action.payload;
          const goal = state.currentMandalart.goals.find((g) => g.id === goalId);
          if (goal) {
            goal.tasks = goal.tasks.filter((t) => t.id !== taskId);
          }
        }
        // mandalarts配列内も更新
        if (state.currentMandalart) {
          const mandalartIndex = state.mandalarts.findIndex(
            (m) => m.id === state.currentMandalart?.id
          );
          if (mandalartIndex !== -1) {
            state.mandalarts[mandalartIndex] = state.currentMandalart;
          }
        }
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'タスクの削除に失敗しました';
      });
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
