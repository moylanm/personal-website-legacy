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
	requests: Request[];
	ipAddresses: IPAddress[];
	reverseSort: boolean;
	renderKey: number;
	isLoading: boolean;
	errorMessage: string;
	isInitError: boolean;
	isOtherError: boolean;
}

export enum ActionType {
	InitialFetchInit = 'INITIAL_FETCH_INIT',
	InitialFetchSuccess = 'INITIAL_FETCH_SUCCESS',
	InitialFetchFailure = 'INITIAL_FETCH_FAILURE',
	RefetchSuccess = 'REFETCH_SUCCESS',
	RefetchFailure = 'REFETCH_FAILURE',
	ClearLogsSuccess = 'CLEAR_LOGS_SUCCESS',
	ClearLogsFailure = 'CLEAR_LOGS_FAILURE',
	SetSortOrder = 'SET_SORT_ORDER',
	SetIPAddresses = 'SET_IP_ADDRESSES',
	Reset = 'RESET'
}

type InitialFetchSuccessPayload = {
	requests: Request[];
	ipAddresses: IPAddress[];
};

type RefetchSuccessPayload = {
	requests: Request[];
	ipAddresses: IPAddress[];
	renderKey: number;
};

export type Action =
	| { type: ActionType.InitialFetchInit }
	| { type: ActionType.InitialFetchSuccess; payload: InitialFetchSuccessPayload }
	| { type: ActionType.InitialFetchFailure; payload: string }
	| { type: ActionType.RefetchSuccess; payload: RefetchSuccessPayload }
	| { type: ActionType.RefetchFailure; payload: string }
	| { type: ActionType.ClearLogsSuccess; payload: number }
	| { type: ActionType.ClearLogsFailure; payload: string }
	| { type: ActionType.SetIPAddresses; payload: IPAddress[] }
	| { type: ActionType.SetSortOrder; payload: boolean }
	| { type: ActionType.Reset }

export type ApiResponse = {
	requests: Request[];
};
