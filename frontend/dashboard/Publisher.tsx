import React, { useMemo } from 'react';
import { Action, ActionType, AppState } from './types';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';

const dropdownStyle = {
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

  if (state.isError) {
    return <div className='error-message'>{state.errorMessage}</div>;
  }

  if (state.isLoading) {
    return <div className='message'>Loading...</div>
  }

  return (
    <>
      <Autocomplete
        freeSolo
        inputValue={state.authorField}
        onInputChange={handleAuthorFieldChange}
        options={state.authors}
        renderOption={(props, option) => (
          <Typography {...props} sx={dropdownStyle}>
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
          <Typography {...props} sx={dropdownStyle}>
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
      
    </>
  );
};

export default Publisher;
