import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { toggleTheme } from '../theme/themeSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Logo } from './Logo';

const pages = [
  { url: '/', value: 'home'},
  { url: '/excerpts', value: 'excerpts'},
  { url: '/about', value: 'about'}
];

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                 <MenuItem
                  key={page.value}
                  component={Link}
                  to={page.url}
                  onClick={handleCloseNavMenu}
                >
                  <Typography sx={{ color: '#62CB21', textAlign: 'center' }}>
                    {page.value.toUpperCase()}
                  </Typography>
                 </MenuItem>
              ))}
            </Menu>
          </Box>
          <Logo sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
            }}
          />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
               <Button
                component={Link}
                to={page.url}
                key={page.value}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: '#62CB21', display: 'block' }}
               >
                  {page.value}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <DarkModeSwitch
              checked={theme.darkTheme}
              onChange={() => dispatch(toggleTheme())}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
