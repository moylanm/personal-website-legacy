import { createEntityAdapter, createSlice, SerializedError } from '@reduxjs/toolkit';
import { api } from '../api/apiSlice';
import { Request } from './types';

const logsAdapter = createEntityAdapter({
	sortComparer: (a: Request, b: Request) => a.id - b.id
});

const initialState = logsAdapter.getInitialState({
	status: 'idle',
	error: null as (SerializedError | null)
});

export const logsSlice = createSlice({
	name: 'logs',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addMatcher(api.endpoints.getLogs.matchPending, (state) => {
				state.status = 'loading';
			})
			.addMatcher(api.endpoints.getLogs.matchRejected, (state, { error }) => {
				state.status = 'failed';
				state.error = error;
			})
			.addMatcher(api.endpoints.getLogs.matchFulfilled, (state, { payload }) => {
				state.status = 'succeeded';
				state.ids = payload.map(log => log.id);
				state.entities = payload.reduce((acc, log) => acc[log.id] = log, {});
			})
			.addMatcher(api.endpoints.clearLogs.matchRejected, (state, { error }) => {
				state.status = 'failed';
				state.error = error;
			})
			.addMatcher(api.endpoints.clearLogs.matchFulfilled, (state) => {
				state.status = 'succeeded';
				state.ids = [];
				state.entities = {};
			})
	}
});

export const {} = logsSlice.actions;

export default logsSlice.reducer;
