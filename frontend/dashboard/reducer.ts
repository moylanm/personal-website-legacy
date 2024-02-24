import { AppState, Action, ActionType } from './types';

export const initialState: AppState = {
	excerpts: [],
	authors: [],
	works: {},
	authorField: '',
	workField: '',
	bodyField: '',
	errorMessage: '',
	initialFetchLoading: false,
	initialFetchError: false,
	excerptActionResponse: '',
	excerptActionProcessing: false,
	excerptActionSuccess: false,
	excerptActionError: false
};

export const reducer = (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case ActionType.InitialFetchInit:
			return {
				...state,
				initialFetchLoading: true,
				initialFetchError: false
			};
		case ActionType.InitialFetchSuccess:
			return {
				...state,
				excerpts: action.payload.excerpts,
				authors: action.payload.authors,
				works: action.payload.works,
				initialFetchLoading: false,
				initialFetchError: false
			}
		case ActionType.InitialFetchFailure:
			return {
				...state,
				errorMessage: action.payload,
				initialFetchLoading: false,
				initialFetchError: true
			};
		case ActionType.ExcerptActionInit:
		  return {
				...state,
				excerptActionProcessing: true,
				excerptActionError: false
		  };
		case ActionType.ExcerptActionSuccess:
		  return {
				...state,
				excerptActionResponse: action.payload,
				excerptActionSuccess: true,
				excerptActionProcessing: false,
				excerptActionError: false
		  };
		case ActionType.ExcerptActionFailure:
		  return {
				...state,
				errorMessage: action.payload,
				excerptActionProcessing: false,
				excerptActionSuccess: false,
				excerptActionError: true
		  };
		case ActionType.ResetActionState:
			return {
				...state,
				excerptActionResponse: '',
				excerptActionProcessing: false,
				excerptActionError: false,
				excerptActionSuccess: false
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
		case ActionType.ResetPublishForm:
		  return {
				...state,
				authorField: '',
				workField: '',
				bodyField: ''
		  };
		default:
			return state;
	}
};
