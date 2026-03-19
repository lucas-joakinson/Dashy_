import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/users/usersSlice';
import productsReducer from '../features/products/productsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
