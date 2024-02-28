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
	clearLoading: boolean;
	clearError: boolean;
	excerptActionResponse: string;
	excerptActionProcessing: boolean;
	excerptActionSuccess: boolean;
	excerptActionError: boolean;
};

export enum ActionType {
	SetupInit = 'SETUP_INIT',
	SetupSuccess = 'SETUP_SUCCESS',
  ExcerptsFetchInit = 'EXCERPTS_FETCH_INIT',
  ExcerptsFetchSuccess = 'EXCERPTS_FETCH_SUCCESS',
	LogsFetchInit = 'LOGS_FETCH_INIT',
	LogsFetchSuccess = 'LOGS_FETCH_SUCCESS',
	LogsClearInit = 'LOGS_CLEAR_INIT',
	LogsClearSuccess = 'LOGS_CLEAR_SUCCESS',
	SetAuthorField = 'SET_AUTHOR_FIELD',
	SetWorkField = 'SET_WORK_FIELD',
	SetBodyField = 'SET_BODY_FIELD',
	ResetPublishForm = 'RESET_PUBLISH_FORM',
	SetIPAddresses = 'SET_IP_ADDRESSES',
	ExcerptActionInit = 'EXCERPT_ACTION_INIT',
	ExcerptActionSuccess = 'EXCERPT_ACTION_SUCCESS',
	ResetActionState = 'RESET_ACTION_STATE'
};

export enum ErrorType {
	SetupError = 'SETUP_ERROR',
  ExcerptsFetchError = 'EXCERPTS_FETCH_ERROR',
	LogsFetchError = 'LOGS_FETCH_ERROR',
	LogsClearError = 'LOGS_CLEAR_ERROR',
	ExcerptActionError = 'EXCERPT_ACTION_ERROR',
}

type SetupSuccessPayload = {
	excerpts: Excerpt[];
	authors: string[];
	works: { [author: string]: string[] };
	requests: Request[];
	ipAddresses: IPAddress[];
	renderKey: number;
};

type ExcerptsFetchSuccessPayload = {
	excerpts: Excerpt[];
	authors: string[];
	works: { [author: string]: string[] };
	renderKey: number;
};

type LogsFetchSuccessPayload = {
	requests: Request[];
	ipAddresses: IPAddress[];
	renderKey: number;
};

export type Action =
	| { type: ActionType.SetupInit }
	| { type: ActionType.SetupSuccess; payload: SetupSuccessPayload }
	| { type: ErrorType.SetupError; payload: string }
	| { type: ActionType.ExcerptsFetchInit }
	| { type: ActionType.ExcerptsFetchSuccess; payload: ExcerptsFetchSuccessPayload }
	| { type: ErrorType.ExcerptsFetchError; payload: string }
	| { type: ActionType.LogsFetchInit }
	| { type: ActionType.LogsFetchSuccess; payload: LogsFetchSuccessPayload }
	| { type: ErrorType.LogsFetchError; payload: string }
	| { type: ActionType.LogsClearInit }
	| { type: ActionType.LogsClearSuccess; payload: number }
	| { type: ErrorType.LogsClearError; payload: string }
	| { type: ActionType.SetAuthorField; payload: string }
	| { type: ActionType.SetWorkField; payload: string }
	| { type: ActionType.SetBodyField; payload: string }
	| { type: ActionType.ResetPublishForm }
	| { type: ActionType.SetIPAddresses; payload: IPAddress[] }
	| { type: ActionType.ExcerptActionInit }
	| { type: ActionType.ExcerptActionSuccess; payload: string }
	| { type: ErrorType.ExcerptActionError; payload: string }
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

export type ErrorResponse = {
	errors?: { [key: string]: string };
	error?: string;
}
