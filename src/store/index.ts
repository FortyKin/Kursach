import { configureStore } from '@reduxjs/toolkit';
import financeReducer from './financeSlice';
import authReducer from './authSlice'; 

export const store = configureStore({
  reducer: {
    finance: financeReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;