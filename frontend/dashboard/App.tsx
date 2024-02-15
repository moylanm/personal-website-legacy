import React, { useReducer } from 'react';
import List from './List';
import useFetchRequests from './useFetchRequests';
import { reducer, initialState } from './reducer';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  useFetchRequests(dispatch);

  if (state.isError) {
    return <div className='error-message'>{state.errorMessage}</div>;
  }

  if (state.isLoading) {
    return <div className='loading-message'>Loading requests...</div>;
  }

  return <List requests={state.requests} />
};

export default App;
