import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { updateIPAddresses } from './utils';
import {
  Action,
  ExcerptActionResponse,
  ActionType,
  ExcerptsFetchResponse,
  IPAddress,
  LogsFetchResponse
} from './types';

const EXCERPTS_ENDPOINT = 'https://mylesmoylan.net/excerpts';
const LOGS_ENDPOINT = 'https://mylesmoylan.net/dashboard/request-logs';

export const useInitialFetch = (
  dispatch: React.Dispatch<Action>,
  currentRenderKey: number
) => {
  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      dispatch({ type: ActionType.SetupInit });

      try {
        const excerptsResponse = await axios.get<ExcerptsFetchResponse>(`${EXCERPTS_ENDPOINT}/json`, {
          cancelToken: source.token
        });

        const logsResponse = await axios.get<LogsFetchResponse>(`${LOGS_ENDPOINT}`, {
          cancelToken: source.token
        });

        const excerpts = excerptsResponse.data.excerpts;
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

        const requests = logsResponse.data.requests;
        const uniqueIPAddresses = [...new Set(requests.map(request => request.ipAddress))];
        const ipAddresses = uniqueIPAddresses.map(ipAddress => <IPAddress>{value: ipAddress, selected: true});

        const renderKey = currentRenderKey + 1;

        dispatch({
          type: ActionType.SetupSuccess,
          payload: { excerpts, authors, works, requests, ipAddresses, renderKey }
        });
      } catch (error) {
        const axiosError = error as AxiosError;

        let errorMessage = 'Failed to setup state.';

        if (axiosError.response) {
          errorMessage = `Error ${axiosError.response.status} ${axiosError.response.statusText}`;
        } else if (axiosError.request) {
          errorMessage = 'Network error. Please try again.';
        } else {
          console.log('Error: ', axiosError.message);
        }

        dispatch({
          type: ActionType.SetupError,
          payload: errorMessage
        });
      }
    };

    fetchData();

    return () => source.cancel('Component unmounted, request canceled');
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

    const response = await axios<ExcerptActionResponse>({
      method: 'POST',
      url: `${EXCERPTS_ENDPOINT}`,
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
      type: ActionType.ExcerptActionError,
      payload: errorMessage
    });
  }

  return () => source.cancel('Component unmounted, request canceled');
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

    const response = await axios<ExcerptActionResponse>({
      method: 'PATCH',
      url: `${EXCERPTS_ENDPOINT}/${id}`,
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
      type: ActionType.ExcerptActionError,
      payload: errorMessage
    });
  }

  return () => source.cancel('Component unmounted, request canceled');
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

    const response = await axios<ExcerptActionResponse>({
      method: 'DELETE',
      url: `${EXCERPTS_ENDPOINT}/${id}`,
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
      type: ActionType.ExcerptActionError,
      payload: errorMessage
    });
  }

  return () => source.cancel('Component unmounted, request canceled');
};

export const fetchExcerpts = async (
  dispatch: React.Dispatch<Action>,
  currentRenderKey: number
) => {
  dispatch({ type: ActionType.ExcerptsFetchInit });

  const source = axios.CancelToken.source();

  try {
    const response = await axios.get<ExcerptsFetchResponse>(`${EXCERPTS_ENDPOINT}/json`, {
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
      type: ActionType.ExcerptsFetchSuccess,
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
      type: ActionType.ExcerptsFetchError,
      payload: errorMessage
    });
  }

  return () => source.cancel('Component unmounted, request canceled');
};

export const fetchLogs = async (
  dispatch: React.Dispatch<Action>,
  currentIPAddresses: IPAddress[],
  currentRenderKey: number
) => {
  dispatch({ type: ActionType.LogsFetchInit });

	const source = axios.CancelToken.source();

	try {
		const response = await axios.get<LogsFetchResponse>(`${LOGS_ENDPOINT}`, {
			cancelToken: source.token
		});

		const requests = response.data.requests;
		const uniqueIPAddresses = [...new Set(requests.map(request => request.ipAddress))];
		const ipAddresses = updateIPAddresses(currentIPAddresses, uniqueIPAddresses);
		const renderKey = currentRenderKey + 1;

		dispatch({
			type: ActionType.LogsFetchSuccess,
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
      type: ActionType.LogsFetchError,
      payload: errorMessage
    });
	}

  return () => source.cancel('Component unmounted, request canceled');

};

export const clearLogs = async (
  dispatch: React.Dispatch<Action>,
  currentRenderKey: number
) => {
  dispatch({ type: ActionType.LogsClearInit });

	const source = axios.CancelToken.source();

	try {
		const csrfToken = document.querySelector('input[name="csrf_token"]')!.getAttribute('value')!;

		const formBody = new FormData();
		formBody.append('csrf_token', csrfToken);

		await axios({
			method: 'POST',
			url: `${LOGS_ENDPOINT}`,
			data: formBody,
			cancelToken: source.token
		});

		const renderKey = currentRenderKey + 1;

		dispatch({
			type: ActionType.LogsClearSuccess,
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
      type: ActionType.LogsClearError,
      payload: errorMessage
    });
	}

  return () => source.cancel('Component unmounted, request canceled');
};
