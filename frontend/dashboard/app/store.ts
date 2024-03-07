import { configureStore } from '@reduxjs/toolkit';
import excerptsReducer from '../features/excerpts/excerptsSlice';
import logsReducer from '../features/logs/logsSlice';
import { apiSlice } from '../features/api/apiSlice';

const store = configureStore({
  reducer: {
    excerpts: excerptsReducer,
    logs: logsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
