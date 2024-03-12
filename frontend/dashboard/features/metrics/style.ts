import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const CenterBox = styled(Box)({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	marginTop: '10px'
});

export const StyledTypography = styled(Typography)({
	fontWeight: 'bold',
	padding: '0'
});
