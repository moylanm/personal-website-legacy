import type React from 'react';
import { useCallback, useMemo, useReducer } from 'react';
import List from './List';
import FilterForm from './FilterForm';
import useFetchExcerpts from './useFetchExcerpts';
import { reducer, initialState } from './reducer';
import { ActionType } from './types';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useFetchExcerpts(dispatch);

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

  const handleWorkChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: ActionType.SetSelectedWork,
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

    let filteredExcerpts = state.selectedAuthor
      ? state.excerpts.filter(excerpt => excerpt.author === state.selectedAuthor)
      : [...state.excerpts];

    if (state.selectedWork) {
      filteredExcerpts = filteredExcerpts.filter(excerpt => excerpt.work === state.selectedWork);
    }

    return state.reverseSort ? filteredExcerpts.reverse() : filteredExcerpts;
  }, [state.excerpts, state.randomExcerpt, state.selectedAuthor, state.selectedWork, state.reverseSort]);

  if (state.isError) {
    return <div className='error-message'>{state.errorMessage}</div>;
  }

  if (state.isLoading) {
    return <div className='message'>Loading excerpts...</div>;
  }

  return (
    <>
      <FilterForm
        authors={state.authors}
        works={state.works}
        selectedSortOrder={state.reverseSort}
        selectedAuthor={state.selectedAuthor}
        selectedWork={state.selectedWork}
        onSortChange={handleSortChange}
        onAuthorChange={handleAuthorChange}
        onWorkChange={handleWorkChange}
        onRandomClick={handleRandomClick}
        onReset={handleReset}
      /> 
      <List key={state.resetKey} excerpts={sortedAndFilteredExcerpts} />
    </>
  );
};

export default App;
