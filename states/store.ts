import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slice';

export const store = () => {
  return configureStore({
    reducer: {
      app: appReducer,
    },
  });
};

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
