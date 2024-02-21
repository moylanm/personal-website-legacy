import { IPAddress } from './types';

export const updateIPAddresses = (existingIPs: IPAddress[], newIPs: string[]): IPAddress[] => {
	const existingIPsMap = new Map(existingIPs.map(ip => [ip.value, ip.selected]));

	newIPs.forEach(ipValue => {
		existingIPsMap.set(ipValue, existingIPsMap.has(ipValue) ? existingIPsMap.get(ipValue)! : true);
	});

	return Array.from(existingIPsMap, ([value, selected]) => ({ value, selected }));
};

export const formatDate = (dateString: string) => {
  return Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'medium',
    hour12: false
  }).format(Date.parse(dateString));
};
