import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { RootState } from './store';
import { appSlice } from './slice';

// Selector
export const useAppSelector = () => useSelector((state: RootState) => state.app);

// Actions
export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(appSlice.actions, dispatch);
};

// 型のエクスポート
export type { AppState, Cell } from './state';
export type { RootState, AppStore, AppDispatch } from './store';
