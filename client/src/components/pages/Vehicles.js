import { Box, Typography } from '@mui/material';
import NavBar from '../partials/NavBar';
import VehicleSearch from '../forms/VehicleSearch'

export default function Customers() {
  return (
    <Box>
      <Typography variant='h2' align='center'>Vehicles</Typography>
      <NavBar></NavBar>
      <VehicleSearch />
    </Box>
  );
}