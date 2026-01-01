import { Mandalart, EditingCell } from './mandalart';

export interface MandalartState {
  // 現在表示中のマンダラート
  currentMandalart: Mandalart | null;

  // マンダラート一覧
  mandalarts: Mandalart[];

  // 編集中のセル
  editingCell: EditingCell | null;

  // 選択されているセル（ハイライト用）
  selectedCellId: string | null;

  // ローディング状態
  isLoading: boolean;

  // エラーメッセージ
  error: string | null;
}

export const initialState: MandalartState = {
  currentMandalart: null,
  mandalarts: [],
  editingCell: null,
  selectedCellId: null,
  isLoading: false,
  error: null,
};
