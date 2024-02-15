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
	isLoading: boolean;
	errorMessage: string;
	isError: boolean;
}

export enum ActionType {
	RequestsFetchInit = 'REQUESTS_FETCH_INIT',
	RequestsFetchSuccess = 'REQUESTS_FETCH_SUCCESS',
	RequestsFetchFailure = 'REQUESTS_FETCH_FAILURE',
}

export type Action =
	| { type: ActionType.RequestsFetchInit }
	| { type: ActionType.RequestsFetchSuccess; payload: Request[] }
	| { type: ActionType.RequestsFetchFailure; payload: string };

export type ApiResponse = {
	requests: Request[];
};
