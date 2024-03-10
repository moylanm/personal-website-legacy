import React from 'react';
import { useGetExcerptsQuery, useGetLogsQuery } from './features/api/apiSlice';
import TabBar from './features/tabs/TabBar';

const App = () => {
  const {
    isLoading: excerptsLoading,
    isSuccess: excerptsSuccess,
    isError: excerptsError,
    error: excerptsErrorMessage
  } = useGetExcerptsQuery();

  const {
    isLoading: logsLoading,
    isSuccess: logsSuccess,
    isError: logsError,
    error: logsErrorMessage
  } = useGetLogsQuery();

  const isLoading = excerptsLoading || logsLoading;
  const isSuccess = excerptsSuccess && logsSuccess;

  return (
    <>
      {isLoading && <div className='message'>Loading...</div>}
      {excerptsError && <div className='error-message'>{excerptsErrorMessage.toString()}</div>}
      {logsError && <div className='error-message'>{logsErrorMessage.toString()}</div>}
      {isSuccess && <TabBar />}
    </>
  );
};

export default App;
