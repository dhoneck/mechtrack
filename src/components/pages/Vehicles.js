import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import {
  Box,
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
  Typography, TablePagination, TableFooter
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import NavBar from '../layout/NavBar';

function VehicleSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);

  // Pagination handling
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  async function searchVehicles(e) {
    if (e) {
      e.preventDefault()
    }

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
      let url = process.env.REACT_APP_API_URL + 'vehicles/?search=' + encodedParam
      console.log(`API URL: ${url}`)
      // Do Axios GET request with bearer token
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Response:');
      console.log(response.data);
      setResult(response.data)
    } catch (error) {
      setResult('Error');
      console.error(error);
    }
  }

  useEffect(() => {
    searchVehicles(null);
  }, []);

  return (
    <Box sx={{
      textAlign: 'center',
      minWidth: '519px',
      maxWidth: '75%',
      margin: 'auto' }}
    >
      <form className='search-form'>
        <TextField label='Vehicle Search' id='vehicle-query' fullWidth />
        <IconButton type='submit' onClick={searchVehicles} sx={{ ml: .5, borderRadius: 1 }}>
          <SearchIcon sx={{ fontSize: 41 }} />
        </IconButton>
      </form>

      <Box id='results'>
        <Typography variant='h4'>Results</Typography>
        <Typography>Searching for {query ? `"${query}"` : 'all vehicles'}</Typography>
        <TableContainer container={Paper} sx={{ textAlign: 'center' }}>
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
              {result
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(vehicle => (
                <TableRow key={vehicle.id}>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.make}</Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.model}</Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.year}</Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.color}</Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.license}</Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.vin}</Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}><Tooltip title={vehicle.list_owners}>{vehicle.owner_count}</Tooltip></Link></TableCell>
                  <TableCell><Link to={'/vehicles/' + vehicle.id}>{vehicle.service_count}</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                count={result.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default function Customers() {
  return (
    <Box>
      <Typography variant='h2' align='center'>Vehicles</Typography>
      <NavBar active='Vehicles' />
      <VehicleSearch />
    </Box>
  );
}