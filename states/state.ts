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

  // 個別のローディング状態
  isLoadingMandalarts: boolean; // マンダラート一覧の読み込み中
  isLoadingTask: boolean; // タスクの更新/削除中

  // エラーメッセージ
  error: string | null;
}

export const initialState: MandalartState = {
  currentMandalart: null,
  mandalarts: [],
  editingCell: null,
  selectedCellId: null,
  isLoadingMandalarts: false,
  isLoadingTask: false,
  error: null,
};
