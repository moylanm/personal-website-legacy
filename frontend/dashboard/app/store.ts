import { configureStore } from '@reduxjs/toolkit';
import excerptsReducer from '../features/excerpts/excerptsSlice';
import logsReducer from '../features/logs/logsSlice';
import { api } from '../features/api/apiSlice';

const store = configureStore({
  reducer: {
    excerpts: excerptsReducer,
    logs: logsReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
