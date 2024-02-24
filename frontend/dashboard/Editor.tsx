import React, { useEffect, useRef, useState } from 'react';
import { Action, ActionType, AppState, Excerpt } from './types';
import { deleteExcerpt, updateExcerpt } from './api';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const CHUNK_SIZE = 15;

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
  }, [state.excerpts]);

  const handleSnackbarClose = () => {
    dispatch({ type: ActionType.ResetActionState });
  };

  return (
    <>
      {state.excerpts.slice(0, displayCount).map((excerpt) => <Item key={excerpt.id} excerpt={excerpt} dispatch={dispatch} />)}
      {displayCount < state.excerpts.length && <div ref={loadMoreRef} className='message'>Loading more...</div>}
      <SuccessSnackbar state={state} handleClose={handleSnackbarClose} />
      <ErrorSnackbar state={state} handleClose={handleSnackbarClose} />
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
  const [openDialog, setOpenDialog] = useState(false);

  const authorRef = useRef<HTMLInputElement>();
  const workRef = useRef<HTMLInputElement>();
  const bodyRef = useRef<HTMLInputElement>();

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = () => {
    handleCloseDialog();

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
    );
  };

  return (
    <>
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
          <TextField fullWidth label='Author' margin='normal' defaultValue={excerpt.author} inputRef={authorRef} />
          <TextField fullWidth label='Work' margin='normal' defaultValue={excerpt.work} inputRef={workRef} />
          <TextField fullWidth multiline rows={10} label='Body' margin='normal' defaultValue={excerpt.body} inputRef={bodyRef} />
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={handleClickOpenDialog}>Delete</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </AccordionActions>
      </Accordion>
      <DeleteDialog excerpt={excerpt} open={openDialog} handleClose={handleCloseDialog} handleConfirm={handleDelete} />
    </>
  );
};

type DeleteDialogProps = {
  excerpt: Excerpt;
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
};

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  excerpt,
  open,
  handleClose,
  handleConfirm
}) => {
  return (
    <Dialog
    onClose={handleClose}
    open={open}
    >
    <DialogTitle sx={{ fontSize: '1rem' }}>
      {`${excerpt.id}: ${excerpt.author} - ${excerpt.work}`}
    </DialogTitle>
    <DialogContent>
      <Typography sx={{
        fontStyle: 'Roboto, Helvetica, Arial, sans-serif',
        padding: 0
      }}>
      Are you sure you want to delete this excerpt?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleConfirm}>Delete</Button>
    </DialogActions>
    </Dialog>
  );
};

type SnackbarProps = {
  state: AppState;
  handleClose: () => void;
};

const SuccessSnackbar: React.FC<SnackbarProps> = ({
  state,
  handleClose
}) => {
  return (
    <Snackbar
      open={state.excerptActionSuccess}
      autoHideDuration={5000}
      onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity='success'
        variant='filled'
      >
        <Typography sx={{
          fontStyle: 'Roboto, Helvetica, Arial, sans-serif',
          padding: 0
        }}>
          {state.excerptActionResponse}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

const ErrorSnackbar: React.FC<SnackbarProps> = ({
  state,
  handleClose
}) => {
  return (
    <Snackbar
      open={state.excerptActionError}
      autoHideDuration={5000}
      onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity='error'
        variant='filled'
      >
        <Typography sx={{
          fontStyle: 'Roboto, Helvetica, Arial, sans-serif',
          padding: 0
        }}>
          {state.errorMessage}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default Editor;
