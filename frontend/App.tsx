import React, {useEffect, useMemo, useReducer} from 'react';
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
        dispatch({
          type: ActionType.LoadExcerptsAndAuthors,
          payload: response.data['excerpts'].map((item: Excerpt): Excerpt => ({
            id: item.id,
            author: item.author,
            work: item.work,
            body: item.body
          }))
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error fetching data:', error);
        }
        dispatch({ type: ActionType.SetError, payload: true });
      } finally {
        dispatch({ type: ActionType.SetLoading, payload: false });
      }
    };

    fetchData();

    return () => {
      source.cancel('Component unmounted, request canceled');
    };
  }, [])

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionType.SetSortOrder,
      payload: event.target.value === 'oldest'
    });
  }

  const handleAuthorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: ActionType.SetSelectedAuthor,
      payload: event.target.value
    });
  }

  const handleRandomClick = () => {
    if (state.excerpts.length === 0) return;

    const randomIndex = Math.floor(Math.random() * state.excerpts.length);

    dispatch({
      type: ActionType.SetRandomExcerpt,
      payload: state.excerpts[randomIndex]
    });
  }

  const handleReset = () => {
    dispatch({
      type: ActionType.SetReset
    });
  }
  
  const sortedAndFilteredExcerpts = useMemo(() => {
    if (state.randomExcerpt) return [state.randomExcerpt];

    return state.excerpts
      .filter(excerpt => !state.selectedAuthor || excerpt.author === state.selectedAuthor)
      .sort((a, b) => state.reverseSort ? a.id - b.id : b.id - a.id);
  }, [state.excerpts, state.randomExcerpt, state.selectedAuthor, state.reverseSort]);

  if (state.isError) {
    return <div className='message'>There was an error...</div>
  }

  if (state.isLoading) {
    return <div className='message'>Loading...</div>;
  }

  return (
    <>
      <FilterForm
        selectedSortOrder={state.reverseSort}
        onSortChange={handleSortChange}
        selectedAuthor={state.selectedAuthor}
        uniqueAuthors={state.uniqueAuthors}
        onAuthorChange={handleAuthorChange}
        onRandomClick={handleRandomClick}
        onReset={handleReset}
      />  
      <List excerpts={sortedAndFilteredExcerpts} />
    </>
  );
}

export default App
