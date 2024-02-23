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
	authorField: string;
	workField: string;
	bodyField: string;
	errorMessage: string;
	initialFetchLoading: boolean;
	initialFetchError: boolean;
	publishExcerptResponse: string;
	publishExcerptProcessing: boolean;
	publishExcerptSuccess: boolean;
	publishExcerptError: boolean;
};

export enum ActionType {
  InitialFetchInit = 'INITIAL_FETCH_INIT',
  InitialFetchSuccess = 'INITIAL_FETCH_SUCCESS',
  InitialFetchFailure = 'INITIAL_FETCH_FAILURE',
	SetAuthorField = 'SET_AUTHOR_FIELD',
	SetWorkField = 'SET_WORK_FIELD',
	SetBodyField = 'SET_BODY_FIELD',
	ResetPublishForm = 'RESET_PUBLISH_FORM',
	PublishExcerptInit = 'PUBLISH_EXCERPT_INIT',
	PublishExcerptSuccess = 'PUBLISH_EXCERPT_SUCCESS',
	PublishExcerptFailure = 'PUBLISH_EXCERPT_FAILURE',
	ResetPublisherState = 'RESET_PUBLISHER_STATE'
};

type InitialFetchSuccessPayload = {
	excerpts: Excerpt[];
	authors: string[];
	works: { [author: string]: string[] };
};

export type Action =
	| { type: ActionType.InitialFetchInit }
	| { type: ActionType.InitialFetchSuccess; payload: InitialFetchSuccessPayload }
	| { type: ActionType.InitialFetchFailure; payload: string }
	| { type: ActionType.SetAuthorField; payload: string }
	| { type: ActionType.SetWorkField; payload: string }
	| { type: ActionType.SetBodyField; payload: string }
	| { type: ActionType.ResetPublishForm }
	| { type: ActionType.PublishExcerptInit }
	| { type: ActionType.PublishExcerptSuccess; payload: string }
	| { type: ActionType.PublishExcerptFailure; payload: string }
	| { type: ActionType.ResetPublisherState };

export type FetchResponse = {
	excerpts: Excerpt[];
};

export type PublishResponse = {
	message: string;
};
