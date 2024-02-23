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
	isLoading: boolean;
	errorMessage: string;
	isError: boolean;
};

export enum ActionType {
  InitialFetchInit = 'INITIAL_FETCH_INIT',
  InitialFetchSuccess = 'INITIAL_FETCH_SUCCESS',
  InitialFetchFailure = 'INITIAL_FETCH_FAILURE',
	SetAuthorField = 'SET_AUTHOR_FIELD',
	SetWorkField = 'SET_WORK_FIELD',
	SetBodyField = 'SET_BODY_FIELD',
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
	| { type: ActionType.SetBodyField; payload: string };

export type ApiResponse = {
	excerpts: Excerpt[];
};
