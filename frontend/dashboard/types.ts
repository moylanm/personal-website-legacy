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
	isLoading: boolean;
	errorMessage: string;
	isError: boolean;
};

export enum ActionType {
  InitialFetchInit = 'INITIAL_FETCH_INIT',
  InitialFetchSuccess = 'INITIAL_FETCH_SUCCESS',
  InitialFetchFailure = 'INITIAL_FETCH_FAILURE',
};

type InitialFetchSuccessPayload = {
	excerpts: Excerpt[];
	authors: string[];
	works: { [author: string]: string[] };
};

export type Action =
	| { type: ActionType.InitialFetchInit }
	| { type: ActionType.InitialFetchSuccess; payload: InitialFetchSuccessPayload }
	| { type: ActionType.InitialFetchFailure; payload: string };
