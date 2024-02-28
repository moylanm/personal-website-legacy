import { AxiosError } from 'axios';
import { Action, ErrorResponse, ErrorType, IPAddress } from './types';

export const handleError = (dispatch: React.Dispatch<Action>, actionType: ErrorType, error: any) => {
  const axiosError = error as AxiosError<ErrorResponse>;
  let errorMessage = 'An error occurred';

  if (axiosError.response) {
		if (axiosError.response.data.errors) {
			errorMessage = `Error ${axiosError.response.status}: validation error`;
		} else {
			errorMessage = `Error ${axiosError.response.status}: ${axiosError.response.data.error}`;
		}
  } else if (axiosError.request) {
    errorMessage = 'Network error';
  } else {
    console.log('Error: ', axiosError.message);
  }

  dispatch({
    type: actionType,
    payload: errorMessage
  });
};

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
