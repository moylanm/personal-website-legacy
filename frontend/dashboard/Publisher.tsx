import React, { useMemo } from 'react';
import { Action, ActionType, AppState } from './types';
import { publishExcerpt } from './api';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type SnackbarProps = {
  state: AppState;
  handleClose: () => void;
};

const SuccessSnackbar: React.FC<SnackbarProps> = ({
  state,
  handleClose
}) => {
  return (
    <Snackbar
      open={state.publishExcerptSuccess}
      autoHideDuration={5000}
      onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity='success'
        variant='filled'
      >
        <Typography sx={{
          fontStyle: 'Roboto, Helvetica, Arial, sans-serif',
          padding: 0
        }}>
          {state.publishExcerptResponse}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

const ErrorSnackbar: React.FC<SnackbarProps> = ({
  state,
  handleClose
}) => {
  return (
    <Snackbar
      open={state.publishExcerptError}
      autoHideDuration={5000}
      onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity='error'
        variant='filled'
      >
        <Typography sx={{
          fontStyle: 'Roboto, Helvetica, Arial, sans-serif',
          padding: 0
        }}>
          {state.errorMessage}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

const fontStyle = {
  fontStyle: 'Roboto, Helvetica, Arial, sans-serif'
}

type WorkOption = {
  author: string;
  work: string;
};

type PublisherProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const Publisher: React.FC<PublisherProps> = ({
  state,
  dispatch
}) => {
  const worksOptions = useMemo(() => {
    return state.authors.reduce<WorkOption[]>((acc, author) => {
      state.works[author].forEach(work => {
        acc.push({ author: author, work: work });
      });

      return acc;
    }, []);
  }, [state.authors, state.works]);

  const handleAuthorFieldChange = (_: React.SyntheticEvent<Element, Event>, value: string) => {
    dispatch({
      type: ActionType.SetAuthorField,
      payload: value
    });
  };

  const handleWorkFieldChange = (_: React.SyntheticEvent<Element, Event>, value: string) => {
    dispatch({
      type: ActionType.SetWorkField,
      payload: value
    });
  };

  const handleBodyFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionType.SetBodyField,
      payload: event.target.value
    });
  };

  const handleSnackbarClose = () => {
    dispatch({ type: ActionType.ResetPublisherState });
  };

  const resetForm = () => {
    dispatch({
      type: ActionType.ResetPublishForm
    });
  };

  const submitForm = () => {
    publishExcerpt(
      dispatch,
      state.authorField,
      state.workField,
      state.bodyField
    );
  };

  if (state.initialFetchError) {
    return <div className='error-message'>{state.errorMessage}</div>;
  }

  if (state.initialFetchLoading) {
    return <div className='message'>Loading...</div>
  }

  return (
    <>
      {state.publishExcerptError && <div className='error-message'>{state.errorMessage}</div>}
      <Autocomplete
        freeSolo
        inputValue={state.authorField}
        onInputChange={handleAuthorFieldChange}
        options={state.authors}
        renderOption={(props, option) => (
          <Typography {...props} sx={fontStyle}>
            {option}
          </Typography>
        )}
        renderInput={(authors) => 
          <TextField 
            {...authors}
            fullWidth
            id='author'
            label='Author'
            margin='normal'
          />}
      />
      <Autocomplete
        freeSolo
        inputValue={state.workField}
        onInputChange={handleWorkFieldChange}
        options={worksOptions.sort((a, b) => -b.author.localeCompare(a.author))}
        groupBy={(option) => option.author}
        getOptionLabel={(option) => typeof option === 'string' ? option : option.work}
        renderOption={(props, option) => (
          <Typography {...props} sx={fontStyle}>
            {option.work}
          </Typography>
        )}
        renderInput={(params) => 
          <TextField
            {...params}
            fullWidth
            id='work'
            label='Work'
            margin='normal'
          />}
      />
      <TextField
        fullWidth
        id='body'
        label='Body'
        margin='normal'
        onChange={handleBodyFieldChange}
        value={state.bodyField}
        multiline
        rows={10}
      />
      <Button variant='contained' onClick={resetForm}>Clear</Button>
      <div className='divider' />
      <Button variant='contained' onClick={submitForm}>Submit</Button>
      <SuccessSnackbar state={state} handleClose={handleSnackbarClose} />
      <ErrorSnackbar state={state} handleClose={handleSnackbarClose} />
    </>
  );
};

export default Publisher;
