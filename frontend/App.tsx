import React, {useCallback, useEffect, useMemo, useReducer } from 'react';
import axios from 'axios';
import List from './List';
import FilterForm from './FilterForm';
import { reducer, initialState } from './reducer';
import { ActionType, Excerpt } from './types';

const BASE_API_ENDPOINT = 'https://mylesmoylan.net/excerpts/json';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
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
          type: ActionType.LoadExcerptsAndAuthors,
          payload: { excerpts, uniqueAuthors }
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error fetching data:', error);
          dispatch({ type: ActionType.SetError, payload: true });
        }
      } finally {
        dispatch({ type: ActionType.SetLoading, payload: false });
      }
    };

    fetchData();

    return () => {
      source.cancel('Component unmounted, request canceled');
    };
  }, [])

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionType.SetSortOrder,
      payload: event.target.value === 'oldest'
    });
  }, []);

  const handleAuthorChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: ActionType.SetSelectedAuthor,
      payload: event.target.value
    });
  }, []);

  const handleRandomClick = useCallback(() => {
    if (state.excerpts.length === 0) return;

    const randomIndex = Math.floor(Math.random() * state.excerpts.length);

    dispatch({
      type: ActionType.SetRandomExcerpt,
      payload: state.excerpts[randomIndex]
    });
  }, [state.excerpts]);

  const handleReset = useCallback(() => {
    dispatch({
      type: ActionType.Reset,
      payload: state.resetKey + 1
    });
  }, [state.resetKey]);
  
  const sortedAndFilteredExcerpts = useMemo(() => {
    if (state.randomExcerpt) return [state.randomExcerpt];

    const filteredExcerpts = state.selectedAuthor
      ? state.excerpts.filter(excerpt => excerpt.author === state.selectedAuthor)
      : [...state.excerpts];

    return state.reverseSort ? filteredExcerpts.reverse() : filteredExcerpts;
  }, [state.excerpts, state.randomExcerpt, state.selectedAuthor, state.reverseSort]);

  if (state.isError) {
    return <div className='error-message'>There was an error fetching the excerpts. Please try again later.</div>;
  }

  if (state.isLoading) {
    return <div className='loading-message'>Loading...</div>;
  }

  return (
    <>
      <FilterForm
        selectedSortOrder={state.reverseSort}
        onSortChange={handleSortChange}
        uniqueAuthors={state.uniqueAuthors}
        selectedAuthor={state.selectedAuthor}
        onAuthorChange={handleAuthorChange}
        onRandomClick={handleRandomClick}
        onReset={handleReset}
      />  
      <List key={state.resetKey} excerpts={sortedAndFilteredExcerpts} />
    </>
  );
}

export default App
