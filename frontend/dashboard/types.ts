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
	RequestsFetchInit = 'REQUESTS_FETCH_INIT',
	RequestsFetchSuccess = 'REQUESTS_FETCH_SUCCESS',
	RequestsFetchFailure = 'REQUESTS_FETCH_FAILURE',
	SetSortOrder = 'SET_SORT_ORDER',
	SetSelectedIPAddresses = 'SET_SELECTED_IP_ADDRESSES',
	Reset = 'RESET'
}

type RequestsFetchSuccessPayload = {
	requests: Request[];
	ipAddresses: string[];
	selectedIPAddresses: string[];
};

export type Action =
	| { type: ActionType.RequestsFetchInit }
	| { type: ActionType.RequestsFetchSuccess; payload: RequestsFetchSuccessPayload }
	| { type: ActionType.RequestsFetchFailure; payload: string }
	| { type: ActionType.SetSelectedIPAddresses; payload: string[] }
	| { type: ActionType.SetSortOrder; payload: boolean }
	| { type: ActionType.Reset }

export type ApiResponse = {
	requests: Request[];
};
