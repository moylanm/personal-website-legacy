import { configureStore } from "@reduxjs/toolkit";
import themeReducer from '../theme/themeSlice';
import excerptsReducer from '../features/excerpts/excerptsSlice';
import { api } from '../features/api/apiSlice'

const store = configureStore({
  reducer: {
    theme: themeReducer,
    excerpts: excerptsReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
