import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TextField,
  Typography
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'


export default function VehicleSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);

  async function searchVehicles(e) {
    e.preventDefault()

    let searchQuery = document.getElementById('vehicle-query').value

    console.log('Searching for vehicles...');
    // Get the value of the input field
    setQuery(searchQuery);
    console.log(`document.getElementById('vehicle-query').value --> ${searchQuery}`)
    console.log('Searching API for: ' + searchQuery);

    // Make a GET request to the API
    try {
      console.log(`Query: ${searchQuery}`)
      let encodedParam = encodeURIComponent(searchQuery)
      let url = 'http://127.0.0.1:8000/api/vehicles/?search=' + encodedParam
      console.log(`API URL: ${url}`)
      const response = await axios.get(url);
      console.log('Response:');
      console.log(response.data);
      setResult(response.data)
    } catch (error) {
      setResult('Error');
      console.error(error);
    }
  }

  return (
    <Box sx={{
      textAlign: 'center',
      minWidth: '519px',
      maxWidth: '75%',
      margin: 'auto' }}
    >
      <form className='search-form'>
        <TextField label='Vehicle Search' id='vehicle-query' fullWidth />
        <IconButton type='submit' onClick={searchVehicles} sx={{ ml: .5, borderRadius: 1}}>
          <SearchIcon sx={{ fontSize: 41 }} />
        </IconButton>
      </form>

      <Box id='results'>
        <Typography variant='h4'>Results</Typography>
        <Typography>Searching for "{query}"</Typography>
        <TableContainer container={Paper} sx={{textAlign: 'center'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Make</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>License</TableCell>
                <TableCell>Vin</TableCell>
                <TableCell>Owners</TableCell>
                <TableCell>Services</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.map(vehicle => (
                <TableRow key={vehicle.id}>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.make}</Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.model}</Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.year}</Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.color}</Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.license}</Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.vin}</Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}><Tooltip title={vehicle.list_owners}>{vehicle.owner_count}</Tooltip></Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>n/a</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}