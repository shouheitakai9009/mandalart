import { configureStore } from '@reduxjs/toolkit';
import mandalartReducer from './slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      mandalart: mandalartReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
