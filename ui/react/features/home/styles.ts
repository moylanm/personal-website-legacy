import { styled } from '@mui/system';
import type { LinkProps } from 'react-router-dom';
import type { TableContainerProps } from '@mui/material';
import { Link } from 'react-router-dom';
import { TableContainer } from '@mui/material';

export const StyledTableContainer = styled(TableContainer)<TableContainerProps>({
	marginBottom: '150px',
	marginLeft: 'auto',
	marginRight: 'auto',
	maxWidth: '800px',
	minHeight: '175px',
	overflow: 'auto'
});

export const StyledLink = styled(Link)<LinkProps>({
	'&:hover': {
		textDecoration: 'underline'
	},
	textDecoration: 'none',
	color: '#62CB31'
});

