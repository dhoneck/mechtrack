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

export default function ViewEstimate() {
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

  const { id, eid } = useParams();
  const [estimate, setEstimate] = useState({});

  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format('YYYY-MM-DD hh:mm a');
  }

  async function getEstimate() {
    try {
      let url = `http://127.0.0.1:8000/api/estimates/${eid}`
      let response = await axios.get(url);
      setEstimate(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getEstimate();
  });

  return (
    <Box sx={{
      textAlign: 'center',
      margin: '-25px auto 0',
      width: '670px'
    }}
    >
      <Typography variant='h1' sx={{fontSize: '28px'}}>SERVICE ESTIMATE</Typography>
      <Typography sx={{fontSize: '14px'}}>THIS IS NOT AN INVOICE</Typography>
      <Typography sx={{fontSize: '14px'}}>Last Modified - {formatDateTime(estimate.updated_at)}</Typography>

      <br />

      <Box sx={{ display:'flex', justifyContent:'space-around', gap:'20px'}}>
        {/*<Box>*/}
        {/*  <Typography variant='h2' sx={{fontSize: '20px'}}>Customer Information</Typography>*/}
        {/*  <Typography variant='h3' sx={{fontSize: '14px'}}>Name Placeholder</Typography>*/}
        {/*  <Typography variant='h4' sx={{fontSize: '14px'}}>+Phone Placeholder</Typography>*/}
        {/*  <Typography variant='h4' sx={{fontSize: '14px'}}>Email Placeholder</Typography>*/}
        {/*</Box>*/}
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
            {estimate.estimate_items && estimate.estimate_items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell sx={{textAlign:'right'}}>${item.part_price}</TableCell>
                <TableCell sx={{textAlign:'right'}}>${item.labor_price}</TableCell>
                <TableCell sx={{textAlign:'right'}}>${item.total_price}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell sx={{fontWeight:'bold'}}>SUB-TOTALS</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>${estimate.parts_total}</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>${estimate.labor_total}</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>${estimate.estimate_total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{fontWeight:'bold'}}>SALES TAX (5.5%)</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}></TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}></TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>${estimate.estimate_total * .055}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{fontWeight:'bold'}}>ESTIMATE TOTAL</TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}></TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}></TableCell>
              <TableCell sx={{fontWeight:'bold', textAlign:'right'}}>${estimate.estimate_total * 1.055}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <br />

      <Typography sx={{border: '2px solid black', fontSize: '12px'}}>THIS PRICE FOR THE AUTHORIZED REPAIRS WILL NOT BE EXCEEDED IF THE
        MOTOR VEHICLE IS DELIVERED TO THE SHOP WITHIN 5 DAYS</Typography>
      <br/>
      <Box sx={{border: '1px solid black'}}>
        <Typography sx={{border: '1px solid black', fontSize: '12px'}}>BALL JOINT TOLERANCES</Typography>
        <Typography sx={{
          border: '1px solid black',
          display: 'inline-block',
          width: 'calc(50% - 2px)',
          height: '40px',
          fontSize: '12px'
        }}>Left</Typography>
        <Typography sx={{
          border: '1px solid black',
          display: 'inline-block',
          width: 'calc(50% - 2px)',
          height: '40px',
          fontSize: '12px'
        }}>Right</Typography>
      </Box>
      <br/>
      <Typography sx={{border: '2px solid black', fontSize: '12px'}}>TO KEEP YOUR FINAL BILL DOWN, SOME PARTS MAY BE RETURNED TO THE
        MANUFACTURER, BUT ALL PARTS WILL BE NEW UNLESS OTHERWISE SPECIFIED</Typography>
      <br/>


      <Box sx={{border: '2px solid black', padding: '5px'}}>
        <Box sx={{display: 'inline-block', width: '70%', marginRight: '10px', textAlign: 'left'}}>
          <Typography sx={{fontSize: '12px'}}>YOU ARE ENTITLED TO A PRICE ESTIMATE FOR THE REPAIRS YOU HAVE AUTHORIZED. THE REPAIR PRICE MAY BE
            LESS THAN THE ESTIMATE, BUT WILL NOT EXCEED THE ESTIMATE WITHOUT YOUR PERMISSION. YOUR SIGNATURE WILL
            INDICATE YOUR ESTIMATE SELECTION.</Typography>
          <br/>
          <Typography sx={{fontSize: '12px'}}>1. I request an estimate in writing before you begin repairs</Typography>
          <hr/>
          <Typography sx={{fontSize: '12px'}}>2. Please proceed with repairs, but call me before continuing if the price will exceed
            $_______</Typography>
          <hr/>
          <Typography sx={{fontSize: '12px'}}>3. I do not want an estimate.</Typography>
          <hr/>
        </Box>

        <Box sx={{border: '2px solid black', display: 'inline-block', width: '25%'}}>
          <Typography sx={{fontSize: '12px'}}>Motor vehicle repair practices are regulated by chapter ATCP 132,
            Wis. Adm. Code, administered by the Bureau of Consumer Protection, Wisconsin Dept. of Agriculture, Trade and
            Consumer Protection, P.O. Box 8911, Madison, Wisconin 53708-8911.</Typography>
        </Box>

        <Box>
          <Box sx={{display: 'inline-block', width: '50%', textAlign: 'left'}}>
            <Typography sx={{fontSize: '12px'}}>CHECK ONE:</Typography>
            <Typography sx={{fontSize: '12px'}}>[ ] I DO WANT OLD PARTS RETURNED</Typography>
            <Typography sx={{fontSize: '12px'}}>[ ] I DO NOT WANT OLD PARTS RETURNED</Typography>
          </Box>
          <Box sx={{display: 'inline-block', width: '50%'}}>
            <Typography sx={{fontSize: '12px'}}>SIGNATURE ___________________________________</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}