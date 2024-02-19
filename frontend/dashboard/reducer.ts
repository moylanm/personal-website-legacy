import { AppState, Action, ActionType } from './types';

export const initialState: AppState = {
	requests: [],
	ipAddresses: [],
	reverseSort: false,
	renderKey: 0,
	isLoading: false,
	errorMessage: '',
	isInitError: false,
	isOtherError: false
}

export const reducer = (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case ActionType.InitialFetchInit:
			return {
				...state,
				isLoading: true,
				isInitError: false
			};
		case ActionType.InitialFetchSuccess:
			return {
				...state,
				requests: action.payload.requests,
				ipAddresses: action.payload.ipAddresses,
				isLoading: false,
				isInitError: false
			};
		case ActionType.InitialFetchFailure:
			return {
				...state,
				errorMessage: action.payload,
				isLoading: false,
				isInitError: true
			};
		case ActionType.RefetchSuccess:
			return {
				...state,
				requests: action.payload.requests,
				ipAddresses: action.payload.ipAddresses
			};
		case ActionType.RefetchFailure:
			return {
				...state,
				errorMessage: action.payload,
				isOtherError: true
			};
		case ActionType.ClearLogsSuccess:
			return {
				...state,
				requests: [],
				ipAddresses: [],
				renderKey: action.payload
			};
		case ActionType.ClearLogsFailure:
			return {
				...state,
				errorMessage: action.payload,
				isOtherError: true
			}
		case ActionType.SetSortOrder:
		  return {
				...state,
				reverseSort: action.payload,
		  };
		case ActionType.SetIPAddresses:
			return {
				...state,
				ipAddresses: action.payload
			};
		case ActionType.Reset:
			return {
				...state,
				reverseSort: false,
			};
		default:
			return state;
	};
};
