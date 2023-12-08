import { Box, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import axios from 'axios';

export default function CustomerSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('No results found');

  async function findCustomers(e) {
    e.preventDefault()
    console.log('Searching for customers...');
    // Get the value of the input field
    setQuery(document.getElementById('customer-query').value);
    console.log('Searching API for: ' + query);

    // Make a GET request to the API
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/customers/');
      console.log('Response:');
      setResult(response.data[0]['first_name']);
      console.log(result);
    } catch (error) {
      setResult('Error');
      console.error(error);
    }
  }

  return (
    <Box>
      <form className={'search-form'}>
        <TextField label="Customer Search" id="customer-query" />
        <IconButton type={'submit'} onClick={findCustomers} sx={{ ml: .5, borderRadius: 1}}>
          <SearchIcon sx={{ fontSize: 41 }} />
        </IconButton>
      </form>
      <Button variant='contained' sx={{ my: 1}}>Add Customer</Button>
      <Box id={'results'}>
        <h2 style={{ margin: 0, marginTop: 10, marginBottom: 5 }}>Results</h2>
        <p style={{ margin: 0, marginBottom: 15 }}>Searching for "{query}"</p>
        {result}
      </Box>
    </Box>
  );
}