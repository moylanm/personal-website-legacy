import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Action, ActionResponse, ActionType, FetchResponse } from './types';

const BASE_ENDPOINT = 'https://mylesmoylan.net/excerpts';

export const useInitialFetch = (
  currentRenderKey: number,
  dispatch: React.Dispatch<Action>
) => {
  useEffect(() => {
    fetchExcerpts(currentRenderKey, dispatch);
  }, [])
};

export const publishExcerpt = async (
  dispatch: React.Dispatch<Action>,
  author: string,
  work: string,
  body: string
) => {
  dispatch({ type: ActionType.ExcerptActionInit });

  const source = axios.CancelToken.source();

  try {
    const csrfToken = document.querySelector('input[name="csrf_token"]')!.getAttribute('value')!;

    const formData = new FormData();
    formData.append('csrf_token', csrfToken);
    formData.append('author', author);
    formData.append('work', work);
    formData.append('body', body);

    const response = await axios<ActionResponse>({
      method: 'POST',
      url: `${BASE_ENDPOINT}`,
      data: formData,
      cancelToken: source.token
    });

    dispatch({
      type: ActionType.ExcerptActionSuccess,
      payload: response.data.message
    });
  } catch (error) {
    const axiosError = error as AxiosError;

    let errorMessage = 'Failed to publish excerpt.';

    if (axiosError.response) {
      errorMessage = `Error ${axiosError.response.status} ${axiosError.response.statusText}`;
    } else if (axiosError.request) {
      errorMessage = 'Network error. Please try again.'
    } else {
      console.log('Error: ', axiosError.message);
    }

    dispatch({
      type: ActionType.ExcerptActionFailure,
      payload: errorMessage
    });
  }

  return () => source.cancel('Post aborted: component unmounted or fetch reset');
};

export const updateExcerpt = async (
  dispatch: React.Dispatch<Action>,
  id: number,
  author: string,
  work: string,
  body: string
) => {
  dispatch({ type: ActionType.ExcerptActionInit });

  const source = axios.CancelToken.source();

  try {
    const csrfToken = document.querySelector('input[name="csrf_token"]')!.getAttribute('value')!;

    const formData = new FormData();
    formData.append('csrf_token', csrfToken);
    formData.append('author', author);
    formData.append('work', work);
    formData.append('body', body);

    const response = await axios<ActionResponse>({
      method: 'PATCH',
      url: `${BASE_ENDPOINT}/${id}`,
      data: formData,
      cancelToken: source.token
    });

    dispatch({
      type: ActionType.ExcerptActionSuccess,
      payload: response.data.message
    });
  } catch (error) {
    const axiosError = error as AxiosError;

    let errorMessage = 'Failed to update excerpt.';

    if (axiosError.response) {
      errorMessage = `Error ${axiosError.response.status} ${axiosError.response.statusText}`;
    } else if (axiosError.request) {
      errorMessage = 'Network error. Please try again.'
    } else {
      console.log('Error: ', axiosError.message);
    }

    dispatch({
      type: ActionType.ExcerptActionFailure,
      payload: errorMessage
    });
  }

  return () => source.cancel('Post aborted: component unmounted or fetch reset');
};

export const deleteExcerpt = async (
  dispatch: React.Dispatch<Action>,
  id: number
) => {
  dispatch({ type: ActionType.ExcerptActionInit });

  const source = axios.CancelToken.source();

  try {
    const csrfToken = document.querySelector('input[name="csrf_token"]')!.getAttribute('value')!;

    const formData = new FormData();
    formData.append('csrf_token', csrfToken);

    const response = await axios<ActionResponse>({
      method: 'DELETE',
      url: `${BASE_ENDPOINT}/${id}`,
      data: formData,
      cancelToken: source.token
    });

    dispatch({
      type: ActionType.ExcerptActionSuccess,
      payload: response.data.message
    });
  } catch (error) {
    const axiosError = error as AxiosError;

    let errorMessage = 'Failed to delete excerpt.';

    if (axiosError.response) {
      errorMessage = `Error ${axiosError.response.status} ${axiosError.response.statusText}`;
    } else if (axiosError.request) {
      errorMessage = 'Network error. Please try again.'
    } else {
      console.log('Error: ', axiosError.message);
    }

    dispatch({
      type: ActionType.ExcerptActionFailure,
      payload: errorMessage
    });
  }

  return () => source.cancel('Post aborted: component unmounted or fetch reset');
};

export const fetchExcerpts = async (
  currentRenderKey: number,
  dispatch: React.Dispatch<Action>
) => {
  dispatch({ type: ActionType.FetchInit });

  const source = axios.CancelToken.source();

  try {
    const response = await axios.get<FetchResponse>(`${BASE_ENDPOINT}/json`, {
      cancelToken: source.token
    });

    const excerpts = response.data.excerpts;
    const authors = [...new Set(excerpts.map(excerpt => excerpt.author))];
    const works = excerpts.reduce((acc, excerpt) => {
      if (!acc[excerpt.author]) {
        acc[excerpt.author] = [];
      }

      if (!acc[excerpt.author].includes(excerpt.work)) {
        acc[excerpt.author].push(excerpt.work);
      }

      return acc;
    }, {});
    const renderKey = currentRenderKey + 1;

    dispatch({
      type: ActionType.FetchSuccess,
      payload: { excerpts, authors, works, renderKey }
    });
  } catch (error) {
    const axiosError = error as AxiosError;

    let errorMessage = 'Failed to fetch data';

    if (axiosError.response) {
      errorMessage = `Error ${axiosError.response.status} ${axiosError.response.statusText}`;
    } else if (axiosError.request) {
      errorMessage = 'Network error. Please try again.';
    } else {
      console.log('Error: ', axiosError.message);
    }

    dispatch({
      type: ActionType.FetchFailure,
      payload: errorMessage
    });
  }

  return () => source.cancel('Component unmounted, request canceled');
};
