import React from 'react';
import { AppState } from "./types";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

type SnackbarProps = {
  state: AppState;
  handleClose: () => void;
};

export const SuccessSnackbar: React.FC<SnackbarProps> = ({
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

export const ErrorSnackbar: React.FC<SnackbarProps> = ({
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
