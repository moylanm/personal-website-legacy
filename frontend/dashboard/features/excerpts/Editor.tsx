import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectExcerptIds, selecteExcerptById } from './excerptsSlice';
import { StyledAccordionSummary, StyledTypography } from './style';
import { RootState } from '../../app/store';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionActions from '@mui/material/AccordionActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const DeleteDialog = React.lazy(() => import('./DeleteDialog'));

const CHUNK_SIZE = 15;

const Editor = () => {
  const [displayCount, setDisplayCount] = useState(CHUNK_SIZE);
  const loadMoreRef = useRef(null);

  const dispatch = useDispatch();
  const excerptIds = useSelector(selectExcerptIds);

  const excerptStatus = useSelector((state: RootState) => state.excerpts.status);
  const error = useSelector((state: RootState) => state.excerpts.error);

  useEffect(() => {
    if (excerptStatus === 'idle') {
      // dispatch(fetchExcerpts())
    }
  }, [excerptStatus, dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setDisplayCount(prevCount => Math.min(prevCount + CHUNK_SIZE, excerptIds.length));
      }
    }, {
      rootMargin: '500px'
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [excerptIds]);

  return (
    <>
      {excerptStatus === 'failed' && <div className='error-message'>{error}</div>}
      {excerptIds.slice(0, displayCount).map((excerptId) => <Item key={excerptId} excerptId={excerptId} />)}
      {displayCount < excerptIds.length && <div ref={loadMoreRef} className='message'>Loading more...</div>}
    </>
  );
};

type ItemProps = {
  excerptId: number;
};

const Item: React.FC<ItemProps> = ({ excerptId }) => {
  const excerpt = useSelector((state: RootState) => selecteExcerptById(state, excerptId));

  const [openDialog, setOpenDialog] = useState(false);

  const authorRef = useRef<HTMLInputElement>();
  const workRef = useRef<HTMLInputElement>();
  const bodyRef = useRef<HTMLInputElement>();

  const handleOpenDialog = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleDelete = useCallback(() => {
    handleCloseDialog();

    // dispatch delete
  }, []);

  const handleUpdate = useCallback(() => {
    // dispatch update
  }, []);

  return (
    <>
      <Accordion>
        <StyledAccordionSummary>
          <StyledTypography>
            {`${excerpt.id}: ${excerpt.author} - ${excerpt.work}`}
          </StyledTypography>
        </StyledAccordionSummary>
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
            id={`work-${excerpt.work}`}
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
          <Button onClick={handleOpenDialog}>Delete</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </AccordionActions>
      </Accordion>
      <Suspense fallback={<div className='message'>Loading...</div>}>
        <DeleteDialog excerpt={excerpt} open={openDialog} handleClose={handleCloseDialog} handleConfirm={handleDelete} />
      </Suspense>
    </>
  );
};

export default Editor;
