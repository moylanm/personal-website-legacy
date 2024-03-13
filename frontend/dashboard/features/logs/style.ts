import { styled } from '@mui/system';
import TableContainer from '@mui/material/TableContainer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Grid from '@mui/material/Grid';

export const StyledTableContainer = styled(TableContainer)({
  width: 'initial',
  margin: '2px calc(-1 * ((100% - 550px) / 2)) 0'
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
  paddingLeft: '5px',
  minWidth: 0
});

export const StyledGrid = styled(Grid)({
  width: 'initial'
});
