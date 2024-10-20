import type React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { StyledTypography } from './style';

type ResponseSnackbarProps = {
  response: string;
  severity: 'success' | 'error';
  handleClose: () => void;
};

const ResponseSnackbar: React.FC<ResponseSnackbarProps> = ({
  response,
  severity,
  handleClose
}) => {
  return (
    <Snackbar
      open={true}
      autoHideDuration={5000}
      onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={severity}
        variant='filled'
      >
        <StyledTypography>
          {response}
        </StyledTypography>
      </Alert>
    </Snackbar>
  );
};

export default ResponseSnackbar;
