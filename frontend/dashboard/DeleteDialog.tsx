import React from 'react';
import { Excerpt } from './types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type DeleteDialogProps = {
  excerpt: Excerpt;
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
};

const DeleteDialog: React.FC<DeleteDialogProps> = React.memo(({
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
});

export default DeleteDialog;
