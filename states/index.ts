import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { RootState } from './store';
import { mandalartSlice } from './slice';

// Selector
export const useMandalartSelector = () =>
  useSelector((state: RootState) => state.mandalart);

// Actions
export const useMandalartActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(mandalartSlice.actions, dispatch);
};

// 型のエクスポート
export type { MandalartState } from './state';
export type { Mandalart, Goal, Task, CellType, EditingCell } from './mandalart';
export type { RootState, AppStore, AppDispatch } from './store';
