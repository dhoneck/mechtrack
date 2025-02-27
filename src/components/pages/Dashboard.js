import { Box, Typography } from '@mui/material';

import UserInfo from '../layout/UserInfo';
import NavBar from '../layout/NavBar';

export default function Dashboard() {
  return (
    <Box>
      <UserInfo />
      <Typography variant='h2' align='center'>Dashboard</Typography>
      <NavBar active='Dashboard' />
      <Typography align='center'>Dashboard content coming soon!</Typography>
    </Box>
  );
}