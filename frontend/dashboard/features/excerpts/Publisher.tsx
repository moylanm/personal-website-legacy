import React, { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetPublishForm, selectAllExcerpts, setAuthorField, setBodyField, setWorkField } from './excerptsSlice';
import { usePublishExcerptMutation } from '../api/apiSlice';
import { StyledTypography, StyledTextField } from './style';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

type WorksOption = {
  author: string;
  work: string;
};

const Publisher = () => {
  const dispatch = useAppDispatch();
  const excerpts = useAppSelector(selectAllExcerpts);
  const authorField = useAppSelector(state => state.excerpts.authorField);
  const workField = useAppSelector(state => state.excerpts.workField);
  const bodyField = useAppSelector(state => state.excerpts.bodyField);

  const [publishExcerpt, { isLoading }] = usePublishExcerptMutation();

  const handleAuthorFieldChange = useCallback((_: React.SyntheticEvent<Element, Event>, value: string) => {
    dispatch(setAuthorField(value));
  }, [dispatch, setAuthorField]);

  const handleWorkFieldChange = useCallback((_: React.SyntheticEvent<Element, Event>, value: string) => {
    dispatch(setWorkField(value));
  }, [dispatch, setWorkField]);

  const handleBodyFieldChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBodyField(event.target.value));
  }, [dispatch, setBodyField]);

  const clearForm = useCallback(() => {
    dispatch(resetPublishForm());
  }, [dispatch, resetPublishForm]);

  const submitForm = useCallback(() => {
    publishExcerpt({
      author: authorField,
      work: workField,
      body: bodyField
    });
  }, [publishExcerpt, authorField, workField, bodyField]);

  const authors = useMemo<string[]>(() => {
    return [...new Set(excerpts.map(excerpt => excerpt.author))];
  }, [excerpts]);

  const works = useMemo<{ [author: string]: string[] }>(() => {
    return excerpts.reduce((acc, excerpt) => {
      if (!acc[excerpt.author]) {
        acc[excerpt.author] = [];
      }

      if (!acc[excerpt.author].includes(excerpt.work)) {
        acc[excerpt.author].push(excerpt.work);
      }

      return acc;
    }, {});
  }, [excerpts]);

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
      <Button variant='contained' onClick={clearForm} disabled={isLoading}>Clear</Button>
      <div className='divider' />
      <Button variant='contained' onClick={submitForm} disabled={isLoading}>Publish</Button>
    </>
  );
};

export default Publisher;
