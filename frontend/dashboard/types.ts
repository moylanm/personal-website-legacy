export type Excerpt = {
	id: number;
	author: string;
	work: string;
	body: string;
};

export type AppState = {
	excerpts: Excerpt[];
	authors: string[];
	works: { [author: string]: string[] };
	renderKey: number;
	authorField: string;
	workField: string;
	bodyField: string;
	errorMessage: string;
	fetchLoading: boolean;
	fetchError: boolean;
	excerptActionResponse: string;
	excerptActionProcessing: boolean;
	excerptActionSuccess: boolean;
	excerptActionError: boolean;
};

export enum ActionType {
  FetchInit = 'FETCH_INIT',
  FetchSuccess = 'FETCH_SUCCESS',
  FetchFailure = 'FETCH_FAILURE',
	SetAuthorField = 'SET_AUTHOR_FIELD',
	SetWorkField = 'SET_WORK_FIELD',
	SetBodyField = 'SET_BODY_FIELD',
	ResetPublishForm = 'RESET_PUBLISH_FORM',
	ExcerptActionInit = 'EXCERPT_ACTION_INIT',
	ExcerptActionSuccess = 'EXCERPT_ACTION_SUCCESS',
	ExcerptActionFailure = 'EXCERPT_ACTION_FAILURE',
	ResetActionState = 'RESET_ACTION_STATE'
};

type FetchSuccessPayload = {
	excerpts: Excerpt[];
	authors: string[];
	works: { [author: string]: string[] };
	renderKey: number;
};

export type Action =
	| { type: ActionType.FetchInit }
	| { type: ActionType.FetchSuccess; payload: FetchSuccessPayload }
	| { type: ActionType.FetchFailure; payload: string }
	| { type: ActionType.SetAuthorField; payload: string }
	| { type: ActionType.SetWorkField; payload: string }
	| { type: ActionType.SetBodyField; payload: string }
	| { type: ActionType.ResetPublishForm }
	| { type: ActionType.ExcerptActionInit }
	| { type: ActionType.ExcerptActionSuccess; payload: string }
	| { type: ActionType.ExcerptActionFailure; payload: string }
	| { type: ActionType.ResetActionState };

export type FetchResponse = {
	excerpts: Excerpt[];
};

export type ActionResponse = {
	message: string;
};
