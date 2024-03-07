import { configureStore } from '@reduxjs/toolkit';
import excerptsReducer from '../features/excerpts/excerptsSlice';
import logsReducer from '../features/logs/logsSlice';

const store = configureStore({
  reducer: {
    excerpts: excerptsReducer,
    logs: logsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
