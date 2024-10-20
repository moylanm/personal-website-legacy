import { configureStore } from '@reduxjs/toolkit';
import excerptsReducer from '../features/excerpts/excerptsSlice';
import metricsReducer from '../features/metrics/metricsSlice';
import { api } from '../features/api/apiSlice';

const store = configureStore({
  reducer: {
    excerpts: excerptsReducer,
    metrics: metricsReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
