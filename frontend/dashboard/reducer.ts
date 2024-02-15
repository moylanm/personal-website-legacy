import { AppState, Action, ActionType } from './types';

export const initialState: AppState = {
	requests: [],
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
				requests: action.payload,
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
		default:
			return state;
	};
};
