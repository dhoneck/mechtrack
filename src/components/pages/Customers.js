import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer, TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';

import NavBar from '../layout/NavBar';

function CustomerSearch() {
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

  async function searchCustomers(e) {
    if (e) {
      e.preventDefault()
    }

    let searchQuery = document.getElementById('customer-query').value

    console.log('Searching for customers...');
    // Get the value of the input field
    setQuery(searchQuery);
    console.log(`document.getElementById('customer-query').value --> ${searchQuery}`)
    console.log('Searching API for: ' + searchQuery);

    // Make a GET request to the API
    try {
      console.log(`Query: ${searchQuery}`)
      let encodedParam = encodeURIComponent(searchQuery)
      let url = process.env.REACT_APP_API_URL + 'customers/?search=' + encodedParam
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
    searchCustomers(null);
  }, []);

  return (
    <Box sx={{
      textAlign: 'center',
      minWidth: '519px',
      maxWidth: '75%',
      margin: 'auto' }}
    >
      <form className='search-form'>
        <TextField label='Customer Search' id='customer-query' fullWidth />
        <IconButton type='submit' onClick={searchCustomers} sx={{ ml: .5, borderRadius: 1}}>
          <SearchIcon sx={{ fontSize: 41 }} />
        </IconButton>
      </form>
      <Link to='/customers/add' style={{ textDecoration: 'none' }}>
        <Button variant='contained' sx={{ my: 1}} >Add Customer</Button>
      </Link>

      <Box id='results'>
        <Typography variant='h4'>Results</Typography>
        <Typography>Searching for {query ? `"${query}"` : 'all customers'}</Typography>
        <TableContainer container={Paper} sx={{ textAlign: 'center' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First</TableCell>
                <TableCell>Last</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Vehicles</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(customer => (
                <TableRow key={customer.id}>
                  <TableCell><Link to={'/customers/' + customer.id}>{customer.first_name}</Link></TableCell>
                  <TableCell><Link to={'/customers/' + customer.id}>{customer.last_name}</Link></TableCell>
                  <TableCell><Link to={'/customers/' + customer.id}>{customer.phone}</Link></TableCell>
                  <TableCell><Link to={'/customers/' + customer.id}>{customer.vehicles.length}</Link></TableCell>
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
      <Typography variant='h2' align='center'>Customers</Typography>
      <NavBar active='Customers' />
      <CustomerSearch />
    </Box>
  );
}