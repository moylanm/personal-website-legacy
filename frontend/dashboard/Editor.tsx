import React, { useEffect, useRef, useState } from 'react';
import { Action, AppState, Excerpt } from './types';
import { deleteExcerpt, updateExcerpt } from './api';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const CHUNK_SIZE = 10;

type EditorProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const Editor: React.FC<EditorProps> = ({
  state,
  dispatch
}) => {
  const [displayCount, setDisplayCount] = useState(CHUNK_SIZE);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setDisplayCount(prevCount => Math.min(prevCount + CHUNK_SIZE, state.excerpts.length));
      }
    }, {
      rootMargin: '100px'
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [state.excerpts]);

  return (
    <>
      {state.excerpts.slice(0, displayCount).map((excerpt) => <Item key={excerpt.id} excerpt={excerpt} dispatch={dispatch} />)}
      {displayCount < state.excerpts.length && <div ref={loadMoreRef} className='message'>Loading more...</div>}
    </>
  );
};

type ItemProps = {
  excerpt: Excerpt;
  dispatch: React.Dispatch<Action>;
};

const Item: React.FC<ItemProps> = ({
  excerpt,
  dispatch
}) => {
  const authorRef = useRef<HTMLInputElement>();
  const workRef = useRef<HTMLInputElement>();
  const bodyRef = useRef<HTMLInputElement>();

  const handleDelete = () => {
    deleteExcerpt(
      dispatch,
      excerpt.id
    );
  };

  const handleUpdate = () => {
    updateExcerpt(
      dispatch,
      excerpt.id,
      authorRef.current!.value,
      workRef.current!.value,
      bodyRef.current!.value
    )
  };

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
        <TextField fullWidth label='Author' margin='normal' value={excerpt.author} inputRef={authorRef} />
        <TextField fullWidth label='Work' margin='normal' value={excerpt.work} inputRef={workRef} />
        <TextField fullWidth multiline rows={10} label='Body' value={excerpt.body} inputRef={bodyRef} />
      </AccordionDetails>
      <AccordionActions>
        <Button onClick={handleDelete}>Delete</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </AccordionActions>
    </Accordion>
  );
};

export default Editor;
