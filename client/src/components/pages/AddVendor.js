import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material'

import NavBar from '../layout/NavBar';

const style = {
  my: 5
}

export default function AddVendor() {
  // Hold form values
  const [vendorName, setVendorName] = useState('');
  const [vendorCode, setVendorCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');


  async function handleSubmit(event) {
    event.preventDefault();
    // Add +1 to phone number if it is not there
    let verifiedPhoneNumber = phoneNumber;
    if (phoneNumber.substring(0, 2) !== '+1' && phoneNumber.length === 10) {
      verifiedPhoneNumber = '+1' + phoneNumber;
      setPhoneNumber(phoneNumber);
    } else {
      console.log('Phone number is not correct!');
    }

    // Post the value of the form
    let url = 'http://127.0.0.1:8000/api/vendors/'
    let values = {
      'vendor_name': vendorName,
      'vendor_code': vendorCode,
      'phone_number': verifiedPhoneNumber,
      'email': email,
      'website': website,
      'notes': notes
    };
    console.log('Attempting to submit these values:');
    console.log(values);

    axios.post(url, values)
    .then(function (response) {
      console.log(response)
      if (response.status === 201) {
        let newVendID = response.data.id;
        window.location.replace(`/vendors/${newVendID}`)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <Box
      component='form'
      noValidate
      autoComplete='off'
      sx={{
        textAlign: 'center',
        margin: 'auto',
        minWidth: '519px',
        maxWidth: '75%',
      }}
    >
      <Typography variant='h2' align='center'>Add Vendor</Typography>
      <NavBar active='Vendors' />
      <FormGroup>
        <TextField
          style={style}
          required
          id='vendor-name'
          label='Vendor Name'
          variant='outlined'
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          sx={{ mb: 1 }}
        />
        <TextField
          id='vendor-code'
          label='Vendor Code'
          variant='outlined'
          value={vendorCode}
          onChange={(e) => setVendorCode(e.target.value)}
          sx={{ mb: 1 }}
        />
        <TextField
          id='phone-number'
          label='Phone Number'
          variant='outlined'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={{ mb: 1 }}
        />
        <TextField
          id='email'
          label='Email'
          variant='outlined'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 1 }}
        />
        <TextField
          id='website'
          label='Website'
          variant='outlined'
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          sx={{ mb: 1 }}
        />
        <TextField
          id='notes'
          label='Notes'
          variant='outlined'
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
      </FormGroup>
    </Box>
  );
}