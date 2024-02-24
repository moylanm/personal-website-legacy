import React from 'react';
import { Action, AppState, Excerpt } from './types';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type ExcerptItemProps = {
  excerpt: Excerpt;
};

const ExcerptItem: React.FC<ExcerptItemProps> = ({
  excerpt
}) => {
  return (
    <Accordion>
      <AccordionSummary>
        <Typography sx={{
          fontStyle: 'Roboto, Helvetica, Arial, sans-serif',
          padding: 0
        }}>
          {`${excerpt.id}: ${excerpt.author} - ${excerpt.work}`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TextField fullWidth label='Author' margin='normal' value={excerpt.author} />
        <TextField fullWidth label='Work' margin='normal' value={excerpt.work} />
        <TextField fullWidth multiline rows={10} label='Body' value={excerpt.body} />
      </AccordionDetails>
      <AccordionActions>
        <Button>Delete</Button>
        <Button>Update</Button>
      </AccordionActions>
    </Accordion>
  );
};

type EditorProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const Editor: React.FC<EditorProps> = ({
  state,
  dispatch
}) => {
  return (
    <>
      {state.excerpts.map(excerpt => <ExcerptItem excerpt={excerpt} />)}
    </>
  );
};

export default Editor;
