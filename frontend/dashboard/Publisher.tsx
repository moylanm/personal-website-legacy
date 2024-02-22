import React from 'react';
import { Action, AppState } from './types';
import TextField from '@mui/material/TextField';

type PublisherProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const Publisher: React.FC<PublisherProps> = ({
  state,
  dispatch
}) => {

  if (state.isError) {
    return <div className='error-message'>{state.errorMessage}</div>;
  }

  if (state.isLoading) {
    return <div className='message'>Loading...</div>
  }

  return (
    <>
      <TextField fullWidth label='Author' variant='outlined' margin='normal' />
      <TextField fullWidth label='Work' variant='outlined' margin='normal' />
      <TextField fullWidth label='Body' variant='outlined' margin='normal' multiline rows={10} />
    </>
  );
};

export default Publisher;
