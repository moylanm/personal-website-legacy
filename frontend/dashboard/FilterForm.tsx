import React from 'react';
import { IPAddress } from './types';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

type FormProps = {
  renderKey: number;
  ipAddresses: IPAddress[];
  onIPAddrChange: (value: string, selected: boolean) => void;
  onFetchDataClick: () => void;
  onClearDataClick: () => void;
};

const FilterForm: React.FC<FormProps> = ({
  renderKey,
  ipAddresses,
  onIPAddrChange,
  onFetchDataClick,
  onClearDataClick
}) => (
  <FormControl>
    <List
      key={renderKey}
      subheader={<ListSubheader sx={{ lineHeight: '36px' }}>IP Addresses</ListSubheader>}
      sx={{ border: '2px solid #CCC', padding: '0px 0px 0px 3px', maxHeight: 200, overflowY: 'scroll' }} dense>
      
      {ipAddresses.map((ipAddress) => (
        <ListItem
          key={renderKey}
          disablePadding
        >
          <ListItemButton sx={{ padding: 0 }} onClick={() => onIPAddrChange(ipAddress.value, ipAddress.selected)} dense>
            <ListItemIcon sx={{ minWidth: 0 }}>
              <Checkbox
                id={`list-item-checkbox-${ipAddress.value}`}
                edge='start'
                checked={ipAddress.selected}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText id={`list-item-text-${ipAddress.value}`}>
              {ipAddress.value}
            </ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
    <Box sx={{ marginTop: '10px' }}>
      <Button type='button' variant='contained' onClick={onFetchDataClick}>Refetch Data</Button>
      <div className='divider' />
      <Button type='button' variant='contained' onClick={onClearDataClick}>Clear Data</Button>
    </Box>
  </FormControl>
);

export default FilterForm;
