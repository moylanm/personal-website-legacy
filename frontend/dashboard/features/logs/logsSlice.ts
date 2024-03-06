import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Request } from './types';

const logsAdapter = createEntityAdapter({
	sortComparer: (a: Request, b: Request) => a.id - b.id
});

const initialState = logsAdapter.getInitialState({
	status: 'idle',
	error: null
});

export const logsSlice = createSlice({
	name: 'logs',
	initialState,
	reducers: {

	}
});

export const {} = logsSlice.actions;

export default logsSlice.reducer;
