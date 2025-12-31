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
