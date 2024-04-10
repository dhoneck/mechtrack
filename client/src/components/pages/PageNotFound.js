import { Box, Typography } from '@mui/material';

import NavBar from '../layout/NavBar';

export default function PageNotFound() {
  return (
    <Box sx={{textAlign: 'center'}}>
      <Typography variant='h2' align='center'>Page Not Found</Typography>
      <NavBar></NavBar>
      <Typography>Please try one of the buttons above.</Typography>
    </Box>
  );
}