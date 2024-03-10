import { createEntityAdapter, createSlice, SerializedError } from '@reduxjs/toolkit';
import { api } from '../api/apiSlice';
import { IPAddress, Request } from './types';
import { updateIPAddresses } from './utils';
import { RootState } from '../../app/store';

const logsAdapter = createEntityAdapter({
	sortComparer: (a: Request, b: Request) => a.id - b.id
});

const initialState = logsAdapter.getInitialState({
	status: 'idle',
	error: null as (SerializedError | null),
	ipAddresses: [] as IPAddress[]
});

export const logsSlice = createSlice({
	name: 'logs',
	initialState,
	reducers: {
		setIPAddressState(state, { payload }) {
			state.ipAddresses = state.ipAddresses.map(ip => {
				return ip.value === payload.value ? {value: ip.value, selected: !payload.selected} : ip;
			});
		}
	},
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
				state.entities = payload.reduce((acc, log) => Object.assign(acc, {[log.id]: log}), {});

				const uniqueIPAddresses = [...new Set(payload.map(log => log.ipAddress))];

				if (state.ipAddresses.length === 0) {
					state.ipAddresses = uniqueIPAddresses.map(ipAddress => <IPAddress>{value: ipAddress, selected: true});
				} else {
					state.ipAddresses = updateIPAddresses(state.ipAddresses, uniqueIPAddresses);
				}
			})
			.addMatcher(api.endpoints.clearLogs.matchRejected, (state, { error }) => {
				state.status = 'failed';
				state.error = error;
			})
			.addMatcher(api.endpoints.clearLogs.matchFulfilled, (state) => {
				state.status = 'succeeded';
				state.ipAddresses = [];
				state.ids = [];
				state.entities = {};
			})
	}
});

export const {
	setIPAddressState
} = logsSlice.actions;

export default logsSlice.reducer;

export const {
	selectAll: selectAllRequests,
	selectById: selectRequestById,
	selectIds: selectRequestIds
} = logsAdapter.getSelectors((state: RootState) => state.logs);
