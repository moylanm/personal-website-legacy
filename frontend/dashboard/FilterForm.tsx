import React, { useMemo } from 'react';
import { IPAddress } from './types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

type FormProps = {
  ipAddresses: IPAddress[];
  onIPAddrChange: (ipToChange: IPAddress) => void;
  onFetchDataClick: () => void;
  onClearDataClick: () => void;
};

const FilterForm: React.FC<FormProps> = ({
  ipAddresses,
  onIPAddrChange,
  onFetchDataClick,
  onClearDataClick
}) => {
  const gridList = useMemo(() => {
    const arr: IPAddress[][] = [];

    for (let i = 0; i < ipAddresses.length; i += 4) {
      arr.push(ipAddresses.slice(i, i + 4));
    }

    return arr;
  }, [ipAddresses])

  return (
    <>
      <List
        subheader={<ListSubheader sx={{ textAlign: 'center', lineHeight: '36px' }}>IP Addresses</ListSubheader>}
        sx={{ border: '2px solid #CCC', maxHeight: 200, overflowY: 'scroll' }}
        dense
      >
        <Grid container spacing={1}>
          {
            gridList.map((ipList) => (
              <Grid container item spacing={1} sx={{ width: 'initial' }}>
                <GridRow ipAddresses={ipList} onIPAddrChange={onIPAddrChange} />
              </Grid>
            ))
          }
        </Grid>
      </List>
      <Box sx={{ margin: '10px 0px' }}>
        <Button type='button' variant='contained' onClick={onFetchDataClick}>Fetch Data</Button>
        <div className='divider' />
        <Button type='button' variant='contained' onClick={onClearDataClick}>Clear Data</Button>
      </Box>
    </>
  );
}

type GridRowProps = {
  ipAddresses: IPAddress[];
  onIPAddrChange: (ipToChange: IPAddress) => void;
};

const GridRow: React.FC<GridRowProps> = ({
  ipAddresses,
  onIPAddrChange
}) => (
  <>
    {
      ipAddresses.map((ipAddress) => (
        <Grid item xs={true}>
          <ListItem sx={{ width: '190px', margin: '0px 0px 0px 3px' }} disablePadding>
            <ListItemButton sx={{ padding: 0 }} onClick={() => onIPAddrChange(ipAddress)} dense>
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
        </Grid>
      ))
    }
  </>
);

export default FilterForm;
