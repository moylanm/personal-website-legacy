import React, { useCallback, useEffect, useMemo } from 'react';
import { Action, ActionType, AppState } from './types';
import { publishExcerpt, fetchExcerpts } from './api';
import { StyledTypography } from './styled';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

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

  const sortedWorksOptions = useMemo(() => {
    return worksOptions.sort((a, b) => -b.author.localeCompare(a.author));
  }, [worksOptions]);

  useEffect(() => {
    if (state.excerptActionSuccess) {
      resetForm();
      fetchExcerpts(dispatch, state.renderKey);
    }
  }, [state.excerptActionSuccess]);

  const handleAuthorFieldChange = useCallback((_: React.SyntheticEvent<Element, Event>, value: string) => {
    dispatch({
      type: ActionType.SetAuthorField,
      payload: value
    });
  }, [dispatch]);

  const handleWorkFieldChange = useCallback((_: React.SyntheticEvent<Element, Event>, value: string) => {
    dispatch({
      type: ActionType.SetWorkField,
      payload: value
    });
  }, [dispatch]);

  const handleBodyFieldChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionType.SetBodyField,
      payload: event.target.value
    });
  }, [dispatch]);

  const resetForm = useCallback(() => {
    dispatch({ type: ActionType.ResetPublishForm });
  }, [dispatch]);

  const submitForm = useCallback(() => {
    publishExcerpt(
      dispatch,
      state.authorField,
      state.workField,
      state.bodyField
    );
  }, [dispatch, state.authorField, state.workField, state.bodyField]);

  return (
    <>
      <Autocomplete
        freeSolo
        inputValue={state.authorField}
        onInputChange={handleAuthorFieldChange}
        options={state.authors}
        renderOption={(props, option) => (
          <StyledTypography {...props}>
            {option}
          </StyledTypography>
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
        options={sortedWorksOptions}
        groupBy={(option) => option.author}
        getOptionLabel={(option) => typeof option === 'string' ? option : option.work}
        renderOption={(props, option) => (
          <StyledTypography {...props}>
            {option.work}
          </StyledTypography>
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
