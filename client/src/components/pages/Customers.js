import { Box, Typography } from '@mui/material';
import NavBar from '../partials/NavBar';
import CustomerSearch from '../forms/CustomerSearch';

export default function Customers() {
  return (
    <Box>
      <Typography variant='h2' align='center'>Customers</Typography>
      <NavBar></NavBar>
      <CustomerSearch />
    </Box>
  );
}