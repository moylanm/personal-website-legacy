import React, { useCallback } from 'react';
import { useAppSelector } from '../../app/hooks';
import { useGetMetricsQuery } from '../api/apiSlice';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { CenterBox, StyledTypography } from './style';

const Metrics = () => {
	const metrics = useAppSelector(state => state.metrics.entities);
	const { refetch } = useGetMetricsQuery();

	const handleFetchMetrics = useCallback(() => {
		refetch();
	}, [refetch]);

	return (
		<>
			<CenterBox>
				<Button type='button' variant='contained' onClick={handleFetchMetrics}>Fetch Metrics</Button>
			</CenterBox>
			<Grid container spacing={1}>
				<Grid container item spacing={1}>
					<Grid item xs={6}>
						<List dense>
							<ListItem>
								<ListItemText>
									<StyledTypography>
										======= SYSTEM =======
									</StyledTypography>
								</ListItemText>
							</ListItem>
							<ListItem>
								<ListItemText primary={`Goroutines: ${metrics.goroutines}`} />
							</ListItem>
							{
								Object.entries(metrics.memstats).map(([key, value]) => (
									<ListItem>
										<ListItemText primary={`${key}: ${value}`} />
									</ListItem>
								))
							}
						</List>
					</Grid>
					<Grid item xs={6}>
						<List dense>
							<ListItem>
								<ListItemText>
									<StyledTypography>
										======= DATABASE =======
									</StyledTypography>
								</ListItemText>
							</ListItem>
							{
								Object.entries(metrics.database).map(([key, value]) => (
									<ListItem>
										<ListItemText primary={`${key}: ${value}`} />
									</ListItem>
								))
							}
						</List>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};

export default Metrics;
