import React, { useMemo } from 'react';
import { IPAddress } from './types';
import {
  StyledBox,
  StyledGrid,
  StyledList,
  StyledListItem,
  StyledListItemButton,
  StyledListItemIcon,
  StyledListSubheader
} from './styled';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
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
      <StyledList
        subheader={<StyledListSubheader>IP Addresses</StyledListSubheader>}
        dense
      >
        <Grid container spacing={1}>
          {
            gridList.map((ipList) => (
              <StyledGrid container item spacing={1}>
                <GridRow ipAddresses={ipList} onIPAddrChange={onIPAddrChange} />
              </StyledGrid>
            ))
          }
        </Grid>
      </StyledList>
      <StyledBox>
        <Button type='button' variant='contained' onClick={onFetchDataClick}>Fetch Data</Button>
        <div className='divider' />
        <Button type='button' variant='contained' onClick={onClearDataClick}>Clear Data</Button>
      </StyledBox>
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
          <StyledListItem disablePadding>
            <StyledListItemButton onClick={() => onIPAddrChange(ipAddress)} dense>
              <StyledListItemIcon>
                <Checkbox
                  id={`list-item-checkbox-${ipAddress.value}`}
                  edge='start'
                  checked={ipAddress.selected}
                  disableRipple
                />
              </StyledListItemIcon>
              <ListItemText id={`list-item-text-${ipAddress.value}`}>
                {ipAddress.value}
              </ListItemText>
            </StyledListItemButton>
          </StyledListItem>
        </Grid>
      ))
    }
  </>
);

export default FilterForm;
