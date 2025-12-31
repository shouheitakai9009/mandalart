import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState, initialState } from './state';

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateCell: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const cell = state.cells.find((c) => c.id === action.payload.id);
      if (cell) {
        cell.content = action.payload.content;
      }
    },
    selectCell: (state, action: PayloadAction<string | null>) => {
      state.selectedCellId = action.payload;
    },
    initializeCells: (state, action: PayloadAction<AppState['cells']>) => {
      state.cells = action.payload;
    },
  },
});

export const { updateCell, selectCell, initializeCells } = appSlice.actions;
export default appSlice.reducer;
