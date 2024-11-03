import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';

export const Logo: React.FC<{ sx: SxProps<Theme> }> = ({ sx }) => {
  return <Box
    sx={sx}
    component='img'
    alt='logo'
    src='/static/img/yin-yang.png'
  />;
};
