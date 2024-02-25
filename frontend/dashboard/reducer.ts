import { AppState, Action, ActionType } from './types';

export const initialState: AppState = {
	excerpts: [],
	authors: [],
	works: {},
	renderKey: 0,
	authorField: '',
	workField: '',
	bodyField: '',
	errorMessage: '',
	fetchLoading: false,
	fetchError: false,
	excerptActionResponse: '',
	excerptActionProcessing: false,
	excerptActionSuccess: false,
	excerptActionError: false
};

export const reducer = (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case ActionType.FetchInit:
			return {
				...state,
				fetchLoading: true,
				fetchError: false
			};
		case ActionType.FetchSuccess:
			return {
				...state,
				excerpts: action.payload.excerpts,
				authors: action.payload.authors,
				works: action.payload.works,
				renderKey: action.payload.renderKey,
				fetchLoading: false,
				fetchError: false
			}
		case ActionType.FetchFailure:
			return {
				...state,
				errorMessage: action.payload,
				fetchLoading: false,
				fetchError: true
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
