import { useEffect } from "react";
import axios from "axios";
import { Action, ActionType, ApiResponse } from "./types";

const BASE_API_ENDPOINT = 'https://mylesmoylan.net/excerpts/json';

const useFetchExcerpts = (
  dispatch: React.Dispatch<Action>
) => {
  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      dispatch({ type: ActionType.ExcerptsFetchInit });

      try {
        const response = await axios.get<ApiResponse>(`${BASE_API_ENDPOINT}`, {
          cancelToken: source.token
        });

        const excerpts = response.data.excerpts;
        const uniqueAuthors = [...new Set(excerpts.map(excerpt => excerpt.author))];

        dispatch({
          type: ActionType.ExcerptsFetchSuccess,
          payload: { excerpts, uniqueAuthors }
        });
      } catch (error) {
        let errorMessage = 'Failed to fetch data.';

        if (error.response) {
          errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
          errorMessage = 'Network error. Please try again.'
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
