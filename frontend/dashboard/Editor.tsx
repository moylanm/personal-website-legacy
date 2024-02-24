import React, { useEffect, useRef, useState } from 'react';
import { Action, AppState, Excerpt } from './types';
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
      {state.excerpts.slice(0, displayCount).map((excerpt) => <Item key={excerpt.id} excerpt={excerpt} />)}
      {displayCount < state.excerpts.length && <div ref={loadMoreRef} className='message'>Loading more...</div>}
    </>
  );
};

type ItemProps = {
  excerpt: Excerpt;
};

const Item: React.FC<ItemProps> = ({
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

export default Editor;
