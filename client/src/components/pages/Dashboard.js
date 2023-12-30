import { Box, Typography } from '@mui/material';
import NavBar from '../partials/NavBar';

export default function Dashboard() {
  return (
    <Box>
      <Typography variant='h2' align='center'>Dashboard</Typography>
      <NavBar></NavBar>
      <Typography align='center'>Dashboard content coming soon!</Typography>
    </Box>
  );
}