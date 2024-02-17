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
	renderKey: number;
	isLoading: boolean;
	errorMessage: string;
	isInitError: boolean;
	isRefetchError: boolean;
}

export enum ActionType {
	InitialFetchInit = 'INITIAL_FETCH_INIT',
	InitialFetchSuccess = 'INITIAL_FETCH_SUCCESS',
	InitialFetchFailure = 'INITIAL_FETCH_FAILURE',
	RefetchSuccess = 'REFETCH_SUCCESS',
	RefetchFailure = 'REFETCH_FAILURE',
	SetSortOrder = 'SET_SORT_ORDER',
	SetSelectedIPAddresses = 'SET_SELECTED_IP_ADDRESSES',
	Reset = 'RESET'
}

type InitialFetchSuccessPayload = {
	requests: Request[];
	ipAddresses: string[];
	selectedIPAddresses: string[];
};

type RefetchSuccessPayload = {
	requests: Request[];
	ipAddresses: string[];
	renderKey: number;
};

export type Action =
	| { type: ActionType.InitialFetchInit }
	| { type: ActionType.InitialFetchSuccess; payload: InitialFetchSuccessPayload }
	| { type: ActionType.InitialFetchFailure; payload: string }
	| { type: ActionType.RefetchSuccess; payload: RefetchSuccessPayload }
	| { type: ActionType.RefetchFailure; payload: string }
	| { type: ActionType.SetSelectedIPAddresses; payload: string[] }
	| { type: ActionType.SetSortOrder; payload: boolean }
	| { type: ActionType.Reset }

export type ApiResponse = {
	requests: Request[];
};
