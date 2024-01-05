import { Box, Typography } from '@mui/material';
import NavBar from '../partials/NavBar';

export default function NoPage() {
  return (
    <Box sx={{textAlign: 'center'}}>
      <Typography variant='h2' align='center'>Page Not Found</Typography>
      <NavBar></NavBar>
      <Typography>Please try one of the buttons below.</Typography>
    </Box>
  );
}