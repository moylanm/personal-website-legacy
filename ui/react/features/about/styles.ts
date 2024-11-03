import { Card, Container, Grid2 } from '@mui/material';
import { styled } from '@mui/material';

export const StyledContainer = styled(Container)({
	marginTop: '150px',
	marginBottom: '150px',
	marginLeft: 'auto',
	marginRight: 'auto',
	maxWidth: '800px'
});

export const StyledGrid2 = styled(Grid2)({
	alignItems: 'center',
	justifyContent: 'center',
});

export const StyledCard = styled(Card)({
	padding: '30px'
})
