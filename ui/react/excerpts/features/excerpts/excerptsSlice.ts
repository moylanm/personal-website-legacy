import type { SerializedError } from '@reduxjs/toolkit';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { api } from '../api/apiSlice';
import type { RootState } from '../../app/store';
import type { Excerpt } from './types';

const excerptsAdapter = createEntityAdapter({
	sortComparer: (a: Excerpt, b: Excerpt) => a.id - b.id
});

const initialState = excerptsAdapter.getInitialState({
	status: 'idle',
	statusMessage: '',
	error: null as (SerializedError | null),
	reverseSort,
	randomExcerpt: null
});

export const excerptsSlice = createSlice({
	name: 'excerpts',
	initialState,
	reducers: {
		resetDisplayed(state) {
			state.reverseSort = false;
			state.randomExcerpt = null;
		},
		resetStatus(state) {
			state.status = 'idle';
			state.statusMessage = '';
			state.error = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(api.endpoints.getExcerpts.matchPending, (state) => {
				state.status = 'loading';
			})
			.addMatcher(api.endpoints.getExcerpts.matchRejected, (state, { error }) => {
				state.status = 'failed';
				state.error = error;
			})
			.addMatcher(api.endpoints.getExcerpts.matchFulfilled, (state, { payload }) => {
				state.status = 'succeeded';
				state.ids = payload.map(excerpt => excerpt.id)
				state.entities = payload.reduce((acc, excerpt) => Object.assign(acc, {[excerpt.id]: excerpt}), {});
			})
	}
});

export const {
	resetDisplayed,
	resetStatus
} = excerptsSlice.actions;

export const {
	selectAll: selectAllExcerpts,
	selectById: selectExcerptById,
	selectIds: selectExcerptIds
} = excerptsAdapter.getSelectors((state: RootState) => state.excerpts);

export default excerptsSlice.reducer;
