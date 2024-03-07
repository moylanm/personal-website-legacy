import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Excerpt } from './types';

const excerptsAdapter = createEntityAdapter({
	sortComparer: (a: Excerpt, b: Excerpt) => a.id - b.id
});

const initialState = excerptsAdapter.getInitialState({
	status: 'idle',
	error: null
});

export const excerptsSlice = createSlice({
	name: 'excerpts',
	initialState,
	reducers: {

	}
});

export const {} = excerptsSlice.actions;

export default excerptsSlice.reducer;

export const {
	selectAll: selectAllExcerpts,
	selectById: selecteExcerptById,
	selectIds: selectExcerptIds
} = excerptsAdapter.getSelectors((state: RootState) => state.excerpts);
