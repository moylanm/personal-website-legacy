import { AppState, Action, ActionType, ErrorType } from './types';

export const initialState: AppState = {
	excerpts: [],
	authors: [],
	works: {},
	requests: [],
	ipAddresses: [],
	renderKey: 0,
	authorField: '',
	workField: '',
	bodyField: '',
	errorMessage: '',
	setupLoading: false,
	setupError: false,
	fetchLoading: false,
	fetchError: false,
	clearLoading: false,
	clearError: false,
	excerptActionResponse: '',
	excerptActionProcessing: false,
	excerptActionSuccess: false,
	excerptActionError: false
};

export const reducer = (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case ActionType.SetupInit:
		  return {
				...state,
				setupLoading: true,
				setupError: false
		  };
		case ActionType.SetupSuccess:
		  return {
				...state,
				excerpts: action.payload.excerpts,
				authors: action.payload.authors,
				works: action.payload.works,
				requests: action.payload.requests,
				ipAddresses: action.payload.ipAddresses,
				setupLoading: false,
				setupError: false,
		  };
		case ErrorType.SetupError:
			return {
				...state,
				errorMessage: action.payload,
				setupLoading: false,
				setupError: true
		  };
		case ActionType.ExcerptsFetchInit:
			return {
				...state,
				fetchLoading: true,
				fetchError: false
			};
		case ActionType.ExcerptsFetchSuccess:
			return {
				...state,
				excerpts: action.payload.excerpts,
				authors: action.payload.authors,
				works: action.payload.works,
				renderKey: action.payload.renderKey,
				fetchLoading: false,
				fetchError: false
			};
		case ActionType.LogsFetchInit:
		  return {
				...state,
				fetchLoading: true,
				fetchError: false
		  };
		case ActionType.LogsFetchSuccess:
		  return {
				...state,
				requests: action.payload.requests,
				ipAddresses: action.payload.ipAddresses,
				renderKey: action.payload.renderKey,
				fetchLoading: false,
				fetchError: false
		  };
		case ErrorType.LogsFetchError:
		  return {
				...state,
				fetchLoading: false,
				fetchError: true
		  };
		case ActionType.LogsClearInit:
		  return {
				...state,
				clearLoading: true,
				clearError: false
		  };
		case ActionType.LogsClearSuccess:
		  return {
				...state,
				requests: [],
				ipAddresses: [],
				renderKey: action.payload,
				clearLoading: false,
				clearError: false
		  };
		case ErrorType.LogsClearError:
			return {
				...state,
				errorMessage: action.payload,
				clearLoading: false,
				clearError: true
		  };
		case ErrorType.ExcerptsFetchError:
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
		case ErrorType.ExcerptActionError:
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
		case ActionType.SetIPAddresses:
		  return {
				...state,
				ipAddresses: action.payload
		  };
		default:
			return state;
	}
};
