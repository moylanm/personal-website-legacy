import React from 'react';
import { Action, AppState } from './types';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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
  const worksOptions = state.authors.reduce<WorkOption[]>((acc, author) => {
    state.works[author].forEach(work => {
      acc.push({ author: author, work: work})
    });

    return acc;
  }, []);

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
        options={state.authors}
        renderInput={(authors) => <TextField {...authors} label='Author' margin='normal' />}
      />
      <Autocomplete
        freeSolo
        options={worksOptions.sort((a, b) => -b.author.localeCompare(a.author))}
        groupBy={(option) => option.author}
        getOptionLabel={(option) => option.work}
        renderInput={(params) => <TextField {...params} label='Work' margin='normal' />}
      />
      <TextField fullWidth label='Body' variant='outlined' margin='normal' multiline rows={10} />
    </>
  );
};

export default Publisher;
