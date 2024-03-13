import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { Metrics } from "./types";
import { api } from "../api/apiSlice";

const initialState = {
	status: 'idle',
	error: null as (SerializedError | null),
	entities: {} as Metrics
};

export const metricsSlice = createSlice({
	name: 'metrics',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addMatcher(api.endpoints.getMetrics.matchPending, (state) => {
				state.status = 'loading';
			})
			.addMatcher(api.endpoints.getMetrics.matchRejected, (state, { error }) => {
				state.status = 'failed';
				state.error = error;
			})
			.addMatcher(api.endpoints.getMetrics.matchFulfilled, (state, { payload }) => {
				state.status = 'succeeded';
				state.entities.uptime = payload['uptime'];
				state.entities.goroutines = payload['goroutines'];
				state.entities.database = payload['database'];
				state.entities.memstats = payload['memstats'];

				delete state.entities.memstats['PauseNs'];
				delete state.entities.memstats['PauseEnd'];
				delete state.entities.memstats['GCCPUFraction'];
				delete state.entities.memstats['BySize'];
			})
	}
})

export default metricsSlice.reducer;
