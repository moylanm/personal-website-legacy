import { AppState, Action, ActionType } from './types';

export const initialState: AppState = {
	excerpts: [],
	authors: [],
	works: {},
	authorField: '',
	workField: '',
	bodyField: '',
	isLoading: false,
	errorMessage: '',
	isError: false
};

export const reducer = (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case ActionType.InitialFetchInit:
			return {
				...state,
				isLoading: true,
				isError: false
			};
		case ActionType.InitialFetchSuccess:
			return {
				...state,
				excerpts: action.payload.excerpts,
				authors: action.payload.authors,
				works: action.payload.works,
				isLoading: false,
				isError: false
			}
		case ActionType.InitialFetchFailure:
			return {
				...state,
				errorMessage: action.payload,
				isLoading: false,
				isError: true
			};
		case ActionType.SetAuthorField:
		  return {
				...state,
				authorField: action.payload
		  };
		case ActionType.SetWorkField:
		  return {
				...state,
				workField: action.payload
		  };
		case ActionType.SetBodyField:
		  return {
				...state,
				bodyField: action.payload
		  };
		default:
			return state;
	}
};
