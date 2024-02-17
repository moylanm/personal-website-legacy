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

export type AppState = {
	requests: Request[];
	ipAddresses: string[];
	selectedIPAddresses: string[];
	reverseSort: boolean;
	isLoading: boolean;
	errorMessage: string;
	isError: boolean;
}

export enum ActionType {
	InitialFetchInit = 'REQUESTS_FETCH_INIT',
	InitialFetchSuccess = 'REQUESTS_FETCH_SUCCESS',
	InitialFetchFailure = 'REQUESTS_FETCH_FAILURE',
	SetSortOrder = 'SET_SORT_ORDER',
	SetSelectedIPAddresses = 'SET_SELECTED_IP_ADDRESSES',
	Reset = 'RESET'
}

type InitialFetchSuccessPayload = {
	requests: Request[];
	ipAddresses: string[];
	selectedIPAddresses: string[];
};

export type Action =
	| { type: ActionType.InitialFetchInit }
	| { type: ActionType.InitialFetchSuccess; payload: InitialFetchSuccessPayload }
	| { type: ActionType.InitialFetchFailure; payload: string }
	| { type: ActionType.SetSelectedIPAddresses; payload: string[] }
	| { type: ActionType.SetSortOrder; payload: boolean }
	| { type: ActionType.Reset }

export type ApiResponse = {
	requests: Request[];
};
