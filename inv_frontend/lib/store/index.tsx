

import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { baseApi } from './api/base/baseApi';
import { rootReducer } from './reducers/root.reducer'; // Import the root reducer
import { useStore } from "react-redux";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});
export default store;
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useMyStore = (): typeof store => useStore();












