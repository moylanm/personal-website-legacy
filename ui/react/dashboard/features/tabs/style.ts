import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';

export const StyledBox = styled(Box)({
	backgroundColor: 'inherit'
});

export const StyledTab = styled(Tab)({
  opacity: 1,
  '&:hover': {
    backgroundColor: '#1876D2',
    color: '#FFFFFF'
  }
});
