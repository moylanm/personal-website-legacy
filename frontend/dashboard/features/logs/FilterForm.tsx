import React, { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setIPAddressState } from './logsSlice';
import { useClearLogsMutation, useGetLogsQuery } from '../api/apiSlice';
import { IPAddress } from './types';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import {
  StyledBox,
  StyledGrid,
  StyledList,
  StyledListItem,
  StyledListItemButton,
  StyledListItemIcon,
  StyledListSubheader
} from './style';

const FilterForm = () => {
	const dispatch = useAppDispatch();
	const ipAddresses = useAppSelector(state => state.logs.ipAddresses);

	const { refetch: fetchLogs } = useGetLogsQuery();
	const [clearLogs] = useClearLogsMutation();

	const handleIPAddrChange = useCallback((ip: IPAddress) => {
		dispatch(setIPAddressState(ip));
	}, [dispatch, setIPAddressState]);

	const handleFetchLogs = useCallback(() => {
		fetchLogs();
	}, [fetchLogs]);

	const handleClearLogs = useCallback(() => {
		clearLogs();
	}, [clearLogs]);

	const gridList = useMemo(() => {
		const arr: IPAddress[][] = [];

		for (let i = 0; i < ipAddresses.length; i += 4) {
			arr.push(ipAddresses.slice(i, i + 4));
		}

		return arr;
	}, [ipAddresses]);

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
                <GridRow ipAddresses={ipList} onIPAddrChange={handleIPAddrChange} />
              </StyledGrid>
            ))
          }
        </Grid>
      </StyledList>
      <StyledBox>
        <Button type='button' variant='contained' onClick={handleFetchLogs}>Fetch Logs</Button>
        <div className='divider' />
        <Button type='button' variant='contained' onClick={handleClearLogs}>Clear Logs</Button>
      </StyledBox>
    </>
	);
};

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
