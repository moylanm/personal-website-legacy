import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Action, ActionType, ApiResponse } from './types';

const API_ENDPOINT = 'https://mylesmoylan.net/dashboard/request-logs'

const useFetchRequests = (
	dispatch: React.Dispatch<Action>
) => {
	useEffect(() => {
		const source = axios.CancelToken.source();

		const fetchData = async () => {
			dispatch({ type: ActionType.RequestsFetchInit });

			try {
				const response = await axios.get<ApiResponse>(`${API_ENDPOINT}`, {
					cancelToken: source.token
				});

				dispatch({
					type: ActionType.RequestsFetchSuccess,
					payload: response.data.requests
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
          type: ActionType.RequestsFetchFailure,
          payload: errorMessage
        });
			}
		};

		fetchData();

		return () => {
			source.cancel('Component unmounted, request calceled');
		};
	}, []);
};

export default useFetchRequests;
