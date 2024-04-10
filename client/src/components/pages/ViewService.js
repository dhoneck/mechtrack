import { useParams } from 'react-router-dom';
import {
  Box,
  Typography
} from '@mui/material';

import NavBar from '../layout/NavBar';

export default function ViewService() {
  // Get ID of customer from URL
  let { id } = useParams();


  // Get customer info
  // useEffect(() => {
  //   getServiceInfo();
  // }, [])

  // Custom styles
    const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const style2 = {
    my: 5
  }

  return (
    <Box sx={{textAlign: 'center'}}>
      <Typography variant='h2'>Service Detail</Typography>
      <NavBar></NavBar>
    </Box>
  );
}