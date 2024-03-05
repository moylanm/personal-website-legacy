import React, { useCallback, useMemo } from 'react';
import { Action, ActionType } from './types';
import { publishExcerpt } from './api';
import { StyledTextField, StyledTypography } from './styled';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

type WorksOption = {
  author: string;
  work: string;
};

type PublisherProps = {
  dispatch: React.Dispatch<Action>;
  authors: string[];
  works: { [author: string]: string[] };
  authorField: string;
  workField: string;
  bodyField: string;
}

const Publisher: React.FC<PublisherProps> = ({
  dispatch,
  authors,
  works,
  authorField,
  workField,
  bodyField
}) => {
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
      authorField,
      workField,
      bodyField
    );
  }, [dispatch, authorField, workField, bodyField]);

  const sortedWorksOptions = useMemo(() => {
    const worksOptions = authors.reduce<WorksOption[]>((acc, author) => {
      works[author].forEach(work => {
        acc.push({ author: author, work: work });
      });

      return acc;
    }, []);

    return worksOptions.sort((a, b) => -b.author.localeCompare(a.author));
  }, [authors, works]);

  return (
    <>
      <Autocomplete
        freeSolo
        inputValue={authorField}
        onInputChange={handleAuthorFieldChange}
        options={authors}
        renderOption={(props, option) => (
          <StyledTypography {...props}>
            {option}
          </StyledTypography>
        )}
        renderInput={(authors) => 
          <StyledTextField 
            {...authors}
            fullWidth
            id='author'
            label='Author'
            margin='normal'
          />}
      />
      <Autocomplete
        freeSolo
        inputValue={workField}
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
          <StyledTextField
            {...params}
            fullWidth
            id='work'
            label='Work'
            margin='normal'
          />}
      />
      <StyledTextField
        fullWidth
        id='body'
        label='Body'
        margin='normal'
        onChange={handleBodyFieldChange}
        value={bodyField}
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
