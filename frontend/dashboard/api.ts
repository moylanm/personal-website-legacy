import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { IPAddress, Action, ActionType, ApiResponse } from './types';

const API_ENDPOINT = 'https://mylesmoylan.net/dashboard/request-logs'

export const useInitialFetch = (
	dispatch: React.Dispatch<Action>
) => {
	useEffect(() => {
		const source = axios.CancelToken.source();

		const fetchData = async () => {
			dispatch({ type: ActionType.InitialFetchInit });

			try {
				const response = await axios.get<ApiResponse>(`${API_ENDPOINT}`, {
					cancelToken: source.token
				});

				const requests = response.data.requests;
				const uniqueIPAddresses = [...new Set(requests.map(request => request.ipAddress))];
				const ipAddresses = uniqueIPAddresses.map(ipAddress => <IPAddress>{value: ipAddress, selected: true});

				dispatch({
					type: ActionType.InitialFetchSuccess,
					payload: { requests, ipAddresses }
				});
			} catch (error) {
				const axiosError = error as AxiosError;

        let errorMessage = 'Failed to fetch data.';

        if (axiosError.response) {
          errorMessage = `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
        } else if (axiosError.request) {
          errorMessage = 'Network error. Please try again.';
        } else {
          console.log('Error: ', axiosError.message);
        }

        dispatch({
          type: ActionType.InitialFetchFailure,
          payload: errorMessage
        });
			}
		};

		fetchData();

		return () => {
			source.cancel('Component unmounted, request canceled')
		};
	}, []);
};

export const refetchData = async (
	dispatch: React.Dispatch<Action>,
	currentIPAddresses: IPAddress[],
	currentRenderKey: number
) => {
	const source = axios.CancelToken.source();

	try {
		const response = await axios.get<ApiResponse>(`${API_ENDPOINT}`, {
			cancelToken: source.token
		});

		const requests = response.data.requests;
		const uniqueIPAddresses = [...new Set(requests.map(request => request.ipAddress))];
		const ipAddresses = updateIPAddresses(currentIPAddresses, uniqueIPAddresses);
		const renderKey = currentRenderKey + 1;

		dispatch({
			type: ActionType.RefetchSuccess,
			payload: { requests, ipAddresses, renderKey }
		});
	} catch (error) {
		const axiosError = error as AxiosError;

    let errorMessage = 'Failed to fetch data.';

    if (axiosError.response) {
      errorMessage = `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
    } else if (axiosError.request) {
      errorMessage = 'Network error. Please try again.';
    } else {
      console.log('Error: ', axiosError.message);
    }

    dispatch({
      type: ActionType.RefetchFailure,
      payload: errorMessage
    });
	}

	return () => source.cancel('Fetch aborted: component unmounted or fetch reset');
}

const updateIPAddresses = (existingIPs: IPAddress[], newIPs: string[]): IPAddress[] => {
	const existingIPsMap = new Map(existingIPs.map(ip => [ip.value, ip.selected]));

	newIPs.forEach(ipValue => {
		existingIPsMap.set(ipValue, existingIPsMap.has(ipValue) ? existingIPsMap.get(ipValue)! : true);
	});

	return Array.from(existingIPsMap, ([value, selected]) => ({ value, selected }));
};

export const clearLogs = async (
	dispatch: React.Dispatch<Action>,
	currentRenderKey: number
) => {
	const source = axios.CancelToken.source();

	try {
		const csrfToken = document.querySelector('input[name="csrf_token"]')!.getAttribute('value')!;

		const formBody = new FormData();
		formBody.append('csrf_token', csrfToken);

		await axios({
			method: 'POST',
			url: `${API_ENDPOINT}`,
			data: formBody,
			cancelToken: source.token
		});

		const renderKey = currentRenderKey + 1;

		dispatch({
			type: ActionType.ClearLogsSuccess,
			payload: renderKey
		});
	} catch (error) {
		const axiosError = error as AxiosError;

    let errorMessage = 'Failed to clear data.';

    if (axiosError.response) {
      errorMessage = `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
    } else if (axiosError.request) {
      errorMessage = 'Network error. Please try again.';
    } else {
      console.log('Error: ', axiosError.message);
    }

    dispatch({
      type: ActionType.ClearLogsFailure,
      payload: errorMessage
    });
	}
};
