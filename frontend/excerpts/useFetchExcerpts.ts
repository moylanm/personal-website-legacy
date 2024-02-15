import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Action, ActionType, ApiResponse } from './types';

const API_ENDPOINT = 'https://mylesmoylan.net/excerpts/json';

const useFetchExcerpts = (
  dispatch: React.Dispatch<Action>
) => {
  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      dispatch({ type: ActionType.ExcerptsFetchInit });

      try {
        const response = await axios.get<ApiResponse>(`${API_ENDPOINT}`, {
          cancelToken: source.token
        });

        const excerpts = response.data.excerpts;
        const uniqueAuthors = [...new Set(excerpts.map(excerpt => excerpt.author))];
        const authorWorks = excerpts.reduce((acc, excerpt) => {
          if (!acc[excerpt.author]) {
            acc[excerpt.author] = [];
          }

          if (!acc[excerpt.author].includes(excerpt.work)) {
            acc[excerpt.author].push(excerpt.work);
          }

          return acc;
        }, {});

        dispatch({
          type: ActionType.ExcerptsFetchSuccess,
          payload: { excerpts, uniqueAuthors, authorWorks }
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
          type: ActionType.ExcerptsFetchFailure,
          payload: errorMessage
        });
      }
    };

    fetchData();

    return () => {
      source.cancel('Component unmounted, request canceled');
    };
  }, [])
};

export default useFetchExcerpts;
