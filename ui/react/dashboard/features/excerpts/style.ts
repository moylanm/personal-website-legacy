import { styled } from '@mui/system';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AccordionSummary from '@mui/material/AccordionSummary';
import DialogTitle from '@mui/material/DialogTitle';

export const StyledTypography = styled(Typography)({
  fontStyle: 'Roboto, Helvetica, Arial, san-serif',
  padding: 0
});

export const StyledTextField = styled(TextField)({
  backgroundColor: '#FFFFFF'
});

export const StyledAccordionSummary = styled(AccordionSummary)({
  '&:hover': {
    backgroundColor: '#F1F3F6'
  }
});

export const StyledDialogTitle = styled(DialogTitle)({
  fontSize: '1rem'
});
