import { AppState, Action, ActionType } from './types';

export const initialState: AppState = {
	requests: [],
	ipAddresses: [],
	selectedIPAddresses: [],
	reverseSort: false,
	isLoading: false,
	errorMessage: '',
	isInitError: false,
	isRefetchError: false
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
				selectedIPAddresses: action.payload.selectedIPAddresses,
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
				isRefetchError: true
			};
		case ActionType.SetSortOrder:
		  return {
				...state,
				reverseSort: action.payload,
		  };
		case ActionType.SetSelectedIPAddresses:
			return {
				...state,
				selectedIPAddresses: action.payload
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
