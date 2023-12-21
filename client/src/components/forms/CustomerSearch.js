import { Box, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

export default function CustomerSearch() {
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
      // console.log(response.json());
      setResult(response.data)
      // setResult(response.data[0]['first_name']);
      // console.log(result);
    } catch (error) {
      setResult('Error');
      console.error(error);
    }
  }

  return (
    <Box>
      <form className={'search-form'}>
        <TextField label="Customer Search" id="customer-query" />
        <IconButton type={'submit'} onClick={searchCustomers} sx={{ ml: .5, borderRadius: 1}}>
          <SearchIcon sx={{ fontSize: 41 }} />
        </IconButton>
      </form>
      <Button as={ Link } to='/add-customer' variant='contained' sx={{ my: 1}} >Add Customer</Button>
      <Box id={'results'}>
        <h2 style={{margin: 0, marginTop: 10, marginBottom: 5}}>Results</h2>
        <p style={{margin: 0, marginBottom: 15}}>Searching for "{query}"</p>
        <ul>
          {
            result
              .map(customer =>
                <li key={customer.id}>{customer.first_name} {customer.last_name} - {customer.phone}</li>
              )
          }
        </ul>
      </Box>
    </Box>
  );
}