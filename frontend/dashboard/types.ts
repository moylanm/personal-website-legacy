export type Excerpt = {
	id: number;
	author: string;
	work: string;
	body: string;
};

export type Request = {
	id: number;
	method: string;
	path: string;
	ipAddress: string;
	referer: string;
	uaName: string;
	uaOS: string;
	uaDeviceType: string;
	uaDeviceName: string;
	timestamp: string;
};

export type IPAddress = {
	value: string;
	selected: boolean;
};

export type AppState = {
	excerpts: Excerpt[];
	authors: string[];
	works: { [author: string]: string[] };
	requests: Request[];
	ipAddresses: IPAddress[];
	renderKey: number;
	authorField: string;
	workField: string;
	bodyField: string;
	errorMessage: string;
	setupLoading: boolean;
	setupError: boolean;
	fetchLoading: boolean;
	fetchError: boolean;
	excerptActionResponse: string;
	excerptActionProcessing: boolean;
	excerptActionSuccess: boolean;
	excerptActionError: boolean;
};

export enum ActionType {
	SetupInit = 'SETUP_INIT',
	SetupSuccess = 'SETUP_SUCCESS',
	SetupError = 'SETUP_FAILURE',
  ExcerptFetchInit = 'FETCH_INIT',
  ExcerptFetchSuccess = 'FETCH_SUCCESS',
  ExcerptFetchError = 'FETCH_FAILURE',
	SetAuthorField = 'SET_AUTHOR_FIELD',
	SetWorkField = 'SET_WORK_FIELD',
	SetBodyField = 'SET_BODY_FIELD',
	ResetPublishForm = 'RESET_PUBLISH_FORM',
	ExcerptActionInit = 'EXCERPT_ACTION_INIT',
	ExcerptActionSuccess = 'EXCERPT_ACTION_SUCCESS',
	ExcerptActionError = 'EXCERPT_ACTION_FAILURE',
	ResetActionState = 'RESET_ACTION_STATE'
};

type SetupSuccessPayload = {
	excerpts: Excerpt[];
	authors: string[];
	works: { [author: string]: string[] };
	requests: Request[];
	ipAddresses: IPAddress[];
	renderKey: number;
};

type ExcerptFetchSuccessPayload = {
	excerpts: Excerpt[];
	authors: string[];
	works: { [author: string]: string[] };
	renderKey: number;
};

export type Action =
	| { type: ActionType.SetupInit }
	| { type: ActionType.SetupSuccess; payload: SetupSuccessPayload }
	| { type: ActionType.SetupError; payload: string }
	| { type: ActionType.ExcerptFetchInit }
	| { type: ActionType.ExcerptFetchSuccess; payload: ExcerptFetchSuccessPayload }
	| { type: ActionType.ExcerptFetchError; payload: string }
	| { type: ActionType.SetAuthorField; payload: string }
	| { type: ActionType.SetWorkField; payload: string }
	| { type: ActionType.SetBodyField; payload: string }
	| { type: ActionType.ResetPublishForm }
	| { type: ActionType.ExcerptActionInit }
	| { type: ActionType.ExcerptActionSuccess; payload: string }
	| { type: ActionType.ExcerptActionError; payload: string }
	| { type: ActionType.ResetActionState };

export type LogsFetchResponse = {
	requests: Request[];
}

export type ExcerptsFetchResponse = {
	excerpts: Excerpt[];
};

export type ExcerptActionResponse = {
	message: string;
};
