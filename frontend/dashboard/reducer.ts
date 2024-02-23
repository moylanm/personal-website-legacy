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
	publishExcerptResponse: '',
	publishExcerptProcessing: false,
	publishExcerptSuccess: false,
	publishExcerptError: false
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
		case ActionType.PublishExcerptInit:
		  return {
				...state,
				publishExcerptProcessing: true,
				publishExcerptError: false
		  };
		case ActionType.PublishExcerptSuccess:
		  return {
				...state,
				publishExcerptResponse: action.payload,
				publishExcerptSuccess: true,
				publishExcerptProcessing: false,
				publishExcerptError: false
		  };
		case ActionType.PublishExcerptFailure:
		  return {
				...state,
				errorMessage: action.payload,
				publishExcerptProcessing: false,
				publishExcerptSuccess: false,
				publishExcerptError: true
		  };
		case ActionType.ResetPublisherState:
			return {
				...state,
				publishExcerptProcessing: false,
				publishExcerptError: false,
				publishExcerptSuccess: false
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
