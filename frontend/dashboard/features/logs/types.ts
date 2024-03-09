export type Request = {
	id: number;
	timestamp: string;
	ipAddress: string;
	method: string;
	path: string;
	referer: string;
	uaName: string;
	uaOS: string;
	uaDeviceType: string;
	uaDeviceName: string;
};

export type IPAddress = {
	value: string;
	selected: boolean;
};
