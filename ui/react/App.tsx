import type React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ThemeProvider } from '@emotion/react';
import { useAppSelector } from './app/hooks';
import { darkTheme, lightTheme } from './theme/theme';
import { Alert, AlertTitle, CssBaseline } from '@mui/material';
import { useGetExcerptsQuery } from './features/api/apiSlice';
import Footer from './components/Footer';

const App: React.FC = () => {
  const theme = useAppSelector((state) => state.theme);

  const {
    isSuccess: excerptsSuccess,
    isError: excerptsError,
  } = useGetExcerptsQuery();

  return (
   <>
      <ThemeProvider theme={theme.darkTheme ? darkTheme : lightTheme}>
        <CssBaseline />
        <Navbar />
        {excerptsError &&
          <Alert severity='error'>
            <AlertTitle>Error</AlertTitle>
            Excerpts could not load.
          </Alert>
        }
        {excerptsSuccess && <Outlet />}
        <Footer />
      </ThemeProvider>
   </>
  );
};

export default App;
