import React from 'react';
import { useGetExcerptsQuery } from './features/api/apiSlice';
import TabBar from './features/tabs/TabBar';

const App = () => {
  const {
    isLoading: excerptsLoading,
    isSuccess: excerptsSuccess,
    isError: excerptsError,
    error: excerptsErrorMessage
  } = useGetExcerptsQuery();

  return (
    <>
      {excerptsLoading && <div className='message'>Loading...</div>}
      {excerptsError && <div className='error-message'>{excerptsErrorMessage.toString()}</div>}
      {excerptsSuccess && <TabBar />}
    </>
  );
};

export default App;
