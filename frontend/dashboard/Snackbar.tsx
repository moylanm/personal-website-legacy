import React from 'react';
import { AppState } from "./types";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { StyledTypography } from './styled';

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
        <StyledTypography>
          {state.excerptActionResponse}
        </StyledTypography>
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
        <StyledTypography>
          {state.errorMessage}
        </StyledTypography>
      </Alert>
    </Snackbar>
  );
};
