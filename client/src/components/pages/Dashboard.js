import { Box, Typography } from '@mui/material';

import NavBar from '../layout/NavBar';

export default function Dashboard() {
  return (
    <Box>
      <Typography variant='h2' align='center'>Dashboard</Typography>
      <NavBar active='Dashboard' />
      <Typography align='center'>Dashboard content coming soon!</Typography>
    </Box>
  );
}