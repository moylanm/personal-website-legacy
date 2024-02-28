import { styled } from '@mui/system';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import TableContainer from '@mui/material/TableContainer';

export const StyledTab = styled(Tab)({
  opacity: 1,
  '&:hover': {
    backgroundColor: '#1876D2',
    color: '#FFFFFF'
  }
});

export const StyledTypography = styled(Typography)({
  fontStyle: 'Roboto, Helvetica, Arial, san-serif',
  padding: 0
});

export const StyledAccordionSummary = styled(AccordionSummary)({
  '&:hover': {
    backgroundColor: '#F1F3F6'
  }
});

export const StyledBox = styled(Box)({
  margin: '10px 0px'
});

export const StyledList = styled(List)({
  border: '2px solid #CCC',
  maxHeight: 200,
  overflowY: 'scroll'
});

export const StyledListSubheader = styled(ListSubheader)({
  textAlign: 'center',
  lineHeight: '36px'
});

export const StyledListItem = styled(ListItem)({
  width: '190px',
  margin: '0px 0px 0px 3px'
});

export const StyledListItemButton = styled(ListItemButton)({
  padding: 0
});

export const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: 0
});

export const StyledGrid = styled(Grid)({
  width: 'initial'
});

export const StyledDialogTitle = styled(DialogTitle)({
  fontSize: '1rem'
});

export const StyledTableContainer = styled(TableContainer)({
  margin: '2px calc(-1 * ((100% - 550px) / 2)) 0'
});
