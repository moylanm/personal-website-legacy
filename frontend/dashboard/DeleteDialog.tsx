import React from 'react';
import { Excerpt } from './types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { StyledDialogTitle, StyledTypography } from './styled';

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
    <Dialog open={open} onClose={handleClose}>
      <StyledDialogTitle>
        {`${excerpt.id}: ${excerpt.author} - ${excerpt.work}`}
      </StyledDialogTitle>
      <DialogContent>
        <StyledTypography>
          Are you sure you want to delete this excerpt?
        </StyledTypography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
});

export default DeleteDialog;
