import { useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export default function ViewService() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const style2 = {
    my: 5
  }

  const { sid } = useParams();
  const [service, setService] = useState({});

  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format('YYYY-MM-DD hh:mm a');
  }

  async function getService() {
    try {
      let url = `${process.env.REACT_APP_API_URL}services/${sid}/`
      let response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('response.data');
      console.log(response.data);
      setService(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getService();
  }, []);

  return (
    <Box sx={{
      textAlign: 'center',
      margin: '-25px auto 0',
      width: '670px'
    }}
    >
      <Typography variant='h1' sx={{fontSize: '28px'}}>SERVICE INVOICE</Typography>
      <Typography sx={{fontSize: '14px'}}>Last Modified - {formatDateTime(service.updated_at)}</Typography>

      <br />

      <Box sx={{ display:'flex', justifyContent:'space-around', gap:'20px'}}>
        <Box>
          <Typography variant='h2' sx={{fontSize: '20px'}}>Vehicle Information</Typography>
          <Typography variant='h3' sx={{fontSize: '14px'}}>2013 Ford F150</Typography>
        </Box>
      </Box>
      <br/>

      <Typography variant='h2' sx={{fontSize: '20px'}}>Service Information</Typography>
      <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight:'bold'}}>DESCRIPTION</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>PARTS</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>LABOR</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>TOTAL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {service.service_items && service.service_items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell sx={{textAlign:'right'}}>${item.part_price}</TableCell>
                <TableCell sx={{textAlign:'right'}}>${item.labor_price}</TableCell>
                <TableCell sx={{textAlign:'right'}}>${item.service_item_total}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell sx={{fontWeight:'bold'}}>SUB-TOTALS</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>${service.parts_total}</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>${service.labor_total}</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>${service.service_subtotal}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{fontWeight:'bold'}}>SALES TAX (5.5%)</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}></TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}></TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>${service.sales_tax_total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{fontWeight:'bold'}}>SERVICE TOTAL</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}></TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}></TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>${service.service_total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}