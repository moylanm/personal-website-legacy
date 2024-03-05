import { configureStore } from '@reduxjs/toolkit';
import excerptsReducer from '../features/excerpts/excerptsSlice';
import logsReducer from '../features/logs/logsSlice';

export default configureStore({
  reducer: {
    excerpts: excerptsReducer,
    logs: logsReducer
  }
});
