import React, { useEffect, useMemo } from 'react';
import { Action, ActionType, AppState } from './types';
import { publishExcerpt, fetchExcerpts } from './api';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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

  useEffect(() => {
    if (state.excerptActionSuccess) {
      resetForm();
      fetchExcerpts(dispatch, state.renderKey);
    }
  }, [state.excerptActionSuccess]);

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

  const resetForm = () => {
    dispatch({ type: ActionType.ResetPublishForm });
  };

  const submitForm = () => {
    publishExcerpt(
      dispatch,
      state.authorField,
      state.workField,
      state.bodyField
    );
  };

  return (
    <>
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
      <Button variant='contained' onClick={submitForm}>Publish</Button>
    </>
  );
};

export default Publisher;
