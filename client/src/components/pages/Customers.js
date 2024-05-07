import { useState } from 'react';
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
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';

import NavBar from '../layout/NavBar';

function CustomerSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);

  async function searchCustomers(e) {
    e.preventDefault()

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
      let url = 'http://127.0.0.1:8000/api/customers/?search=' + encodedParam
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
        <Typography>Searching for "{query}"</Typography>
        <TableContainer container={Paper} sx={{textAlign: 'center'}}>
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
              {result.map(customer => (
                <TableRow key={customer.id}>
                  <TableCell><Link to={'/customers/' + customer.id}>{customer.first_name}</Link></TableCell>
                  <TableCell><Link to={'/customers/' + customer.id}>{customer.last_name}</Link></TableCell>
                  <TableCell><Link to={'/customers/' + customer.id}>{customer.phone}</Link></TableCell>
                  <TableCell><Link to={'/customers/' + customer.id}>{customer.vehicles.length}</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
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
      <NavBar></NavBar>
      <CustomerSearch />
    </Box>
  );
}