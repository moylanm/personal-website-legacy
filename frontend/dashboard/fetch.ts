import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Action, ActionType, ApiResponse } from './types';

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
				const ipAddresses = [...new Set(requests.map(request => request.ipAddress))];
				const selectedIPAddresses = [...ipAddresses];

				dispatch({
					type: ActionType.InitialFetchSuccess,
					payload: { requests, ipAddresses, selectedIPAddresses }
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
	dispatch: React.Dispatch<Action>
) => {
	const source = axios.CancelToken.source();

	try {
		const response = await axios.get<ApiResponse>(`${API_ENDPOINT}`, {
			cancelToken: source.token
		});

		const requests = response.data.requests;
		const ipAddresses = [...new Set(requests.map(request => request.ipAddress))];

		dispatch({
			type: ActionType.RefetchSuccess,
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
      type: ActionType.RefetchFailure,
      payload: errorMessage
    });
	}

	return () => source.cancel('Fetch aborted: component unmounted or fetch reset');
}
