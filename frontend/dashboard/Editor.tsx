import React, { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import { Action, AppState, Excerpt } from './types';
import { deleteExcerpt, fetchExcerpts, updateExcerpt } from './api';
import useIntersectionObserver from './useIntersectionObserver';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const FONT_STYLE = 'Roboto, Helvetica, Arial, sans-serif';
const CHUNK_SIZE = 15;

const DeleteDialog = React.lazy(() => import('./DeleteDialog'));

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

  useIntersectionObserver(
    loadMoreRef,
    (entries) => {
      if (entries[0].isIntersecting) {
        setDisplayCount(prevCount => Math.min(prevCount + CHUNK_SIZE, state.excerpts.length))
      }
    },
    {
      rootMargin: '500px'
    }
  );

  useEffect(() => {
    if (state.excerptActionSuccess) {
      fetchExcerpts(dispatch, state.renderKey);
    }
  }, [state.excerptActionSuccess]);

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

const Item: React.FC<ItemProps> = React.memo(({
  excerpt,
  dispatch
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const authorRef = useRef<HTMLInputElement>();
  const workRef = useRef<HTMLInputElement>();
  const bodyRef = useRef<HTMLInputElement>();

  const handleClickOpenDialog = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleDelete = useCallback(() => {
    handleCloseDialog();

    deleteExcerpt(
      dispatch,
      excerpt.id
    );
  }, [dispatch, excerpt.id]);

  const handleUpdate = useCallback(() => {
    updateExcerpt(
      dispatch,
      excerpt.id,
      authorRef.current!.value,
      workRef.current!.value,
      bodyRef.current!.value
    );
  }, [dispatch, excerpt.id]);

  return (
    <>
      <Accordion>
        <AccordionSummary sx={{ '&:hover': { backgroundColor: '#F1F3F6' } }}>
          <Typography sx={{
            fontStyle: FONT_STYLE,
            padding: 0
          }}>
            {`${excerpt.id}: ${excerpt.author} - ${excerpt.work}`}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            id={`author-${excerpt.id}`}
            label='Author'
            margin='normal'
            defaultValue={excerpt.author}
            inputRef={authorRef}
          />
          <TextField
            fullWidth
            id={`work-${excerpt.id}`}
            label='Work'
            margin='normal'
            defaultValue={excerpt.work}
            inputRef={workRef}
          />
          <TextField
            fullWidth
            multiline
            rows={10}
            id={`body-${excerpt.id}`}
            label='Body'
            margin='normal'
            defaultValue={excerpt.body}
            inputRef={bodyRef}
          />
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={handleClickOpenDialog}>Delete</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </AccordionActions>
      </Accordion>
      <Suspense fallback={<div className='message'>Loading...</div>}>
        <DeleteDialog excerpt={excerpt} open={openDialog} handleClose={handleCloseDialog} handleConfirm={handleDelete} />
      </Suspense>
    </>
  );
});

export default Editor;
