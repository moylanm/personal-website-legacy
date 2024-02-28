import { styled } from '@mui/system';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';

export const StyledTypography = styled(Typography)({
  fontStyle: 'Roboto, Helvetica, Arial, san-serif',
  padding: 0
});

export const StyledAccordionSummary = styled(AccordionSummary)({
  '&:hover': {
    backgroundColor: '#F1F3F6'
  }
});
