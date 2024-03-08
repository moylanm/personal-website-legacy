import { createEntityAdapter, createSlice, SerializedError } from '@reduxjs/toolkit';
import { api } from '../api/apiSlice';
import { RootState } from '../../app/store';
import { Excerpt } from './types';

const excerptsAdapter = createEntityAdapter({
	sortComparer: (a: Excerpt, b: Excerpt) => a.id - b.id
});

const initialState = excerptsAdapter.getInitialState({
	status: 'idle',
	error: null as (SerializedError | null)
});

export const excerptsSlice = createSlice({
	name: 'excerpts',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addMatcher(api.endpoints.getExcerpts.matchPending, (state) => {
				state.status = 'loading';
			})
			.addMatcher(api.endpoints.getExcerpts.matchRejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error;
			})
			.addMatcher(api.endpoints.getExcerpts.matchFulfilled, (state, { payload }) => {
				state.status = 'succeeded';
				state.ids = payload.map(excerpt => excerpt.id);
				state.entities = payload.reduce((acc, excerpt) => acc[excerpt.id] = excerpt, {});
			})
			.addMatcher(api.endpoints.publishExcerpt.matchRejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error;
			})
			.addMatcher(api.endpoints.publishExcerpt.matchFulfilled, (state, { payload }) => {
				state.status = 'succeeded';
				state.ids.push(payload.id);
				state.entities[payload.id] = payload;
			})
			.addMatcher(api.endpoints.updateExcerpt.matchRejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error;
			})
			.addMatcher(api.endpoints.updateExcerpt.matchFulfilled, (state, { payload }) => {
				state.status = 'succeeded';
				state.entities[payload.id] = payload;
			})
			.addMatcher(api.endpoints.deleteExcerpt.matchRejected, (state) => {
				state.status = 'failed';
			})
	}
});

export const {} = excerptsSlice.actions;

export default excerptsSlice.reducer;

export const {
	selectAll: selectAllExcerpts,
	selectById: selecteExcerptById,
	selectIds: selectExcerptIds
} = excerptsAdapter.getSelectors((state: RootState) => state.excerpts);
