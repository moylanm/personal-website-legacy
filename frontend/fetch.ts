import { useEffect } from "react";
import axios from "axios";
import { Action, ActionType, Excerpt } from "./types";

const BASE_API_ENDPOINT = 'https://mylesmoylan.net/excerpts/json';

const fetchExcerpts = (
  dispatch: React.Dispatch<Action>
) => {
  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      dispatch({ type: ActionType.ExcerptsFetchInit });

      try {
        const response = await axios.get(`${BASE_API_ENDPOINT}`, {
          cancelToken: source.token
        });

        const excerpts = response.data['excerpts'].map((excerpt: Excerpt): Excerpt => ({
          id: excerpt.id,
          author: excerpt.author,
          work: excerpt.work,
          body: excerpt.body
        }));

        const uniqueAuthors = [...new Set<string>(excerpts.map((excerpt: Excerpt) => excerpt.author))];

        dispatch({
          type: ActionType.ExcerptsFetchSuccess,
          payload: { excerpts, uniqueAuthors }
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error fetching data:', error);
        }

        dispatch({ type: ActionType.ExcerptsFetchFailure });
      }
    };

    fetchData();

    return () => {
      source.cancel('Component unmounted, request canceled');
    };
  }, [])
};

export default fetchExcerpts;
