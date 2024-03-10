import React, { useCallback } from 'react';
import { useGetExcerptsQuery, useGetLogsQuery } from './features/api/apiSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { resetStatus } from './features/excerpts/excerptsSlice';
import TabBar from './features/tabs/TabBar';
import ResponseSnackbar from './components/Snackbar';

const App = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(state => state.excerpts.status);
  const error = useAppSelector(state => state.excerpts.error);
  const statusMessage = useAppSelector(state => state.excerpts.statusMessage);

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

  const handleSnackbarClose = useCallback(() => {
    dispatch(resetStatus());
  }, [dispatch, resetStatus]);

  return (
    <>
      {isLoading && <div className='message'>Loading...</div>}
      {excerptsError && <div className='error-message'>{excerptsErrorMessage.toString()}</div>}
      {logsError && <div className='error-message'>{logsErrorMessage.toString()}</div>}
      {isSuccess && <TabBar />}

      {status === 'succeeded' &&
        <ResponseSnackbar severity='success' response={statusMessage} handleClose={handleSnackbarClose} />}
      {status === 'failed' &&
        <ResponseSnackbar severity='error' response={error?.message!} handleClose={handleSnackbarClose} />}
    </>
  );
};

export default App;
