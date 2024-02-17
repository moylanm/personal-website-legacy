import { AppState, Action, ActionType } from './types';

export const initialState: AppState = {
	requests: [],
	ipAddresses: [],
	selectedIPAddresses: [],
	reverseSort: false,
	isLoading: false,
	errorMessage: '',
	isError: false
}

export const reducer = (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case ActionType.RequestsFetchInit:
			return {
				...state,
				isLoading: true,
				isError: false
			};
		case ActionType.RequestsFetchSuccess:
			return {
				...state,
				requests: action.payload.requests,
				ipAddresses: action.payload.ipAddresses,
				selectedIPAddresses: action.payload.selectedIPAddresses,
				isLoading: false,
				isError: false
			};
		case ActionType.RequestsFetchFailure:
			return {
				...state,
				errorMessage: action.payload,
				isLoading: false,
				isError: true
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
