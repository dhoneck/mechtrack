import { useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material'

import axios from 'axios';

const style = {
  my: 5
}

export default function AddCustomer() {
  // Hold form values
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [acceptsTexts, setAcceptsTexts] = useState(false);
  const [acceptsEmails, setAcceptsEmails] = useState(false);
  const [isFlagged, setsIsFlagged] = useState(false);
  const [customerNotes, setsCustomerNotes] = useState('');


  async function handleSubmit(event) {
    event.preventDefault();

    // Post the value of the form
    let url = 'http://127.0.0.1:8000/api/customers/'
    let values = {
      'first_name': firstName,
      'last_name': lastName,
      'phone': phoneNumber,
      'email': email,
      'accepts_emails': acceptsEmails,
      'accepts_texts': acceptsTexts,
      'flagged': isFlagged,
      'notes': customerNotes
    };
    console.log('Attempting to submit these values:');
    console.log(values);

    axios.post(url, values)
    .then(function (response) {
      console.log(response)
      if (response.status === 201) {
        let newCustID = response.data.id;
        window.location.replace(`/customers/${newCustID}`)
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
    >
      <Typography variant='h2' align='center'>Add Customer</Typography>
      <FormGroup>
        <TextField
          style={style}
          required id='first-name'
          label='First Name'
          variant='outlined'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          required id='last-name'
          label='Last Name'
          variant='outlined'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          required id='phone-number'
          label='Phone Number'
          variant='outlined'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <TextField
          id='email'
          label='Email'
          variant='outlined'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControlLabel
          control={<Checkbox />}
          label='Accepts Texts'
          checked={acceptsTexts}
          onChange={(e) => setAcceptsTexts(!acceptsTexts)}
        />
        <FormControlLabel
          control={<Checkbox />}
          label='Accepts Emails'
          checked={acceptsEmails}
          onChange={(e) => setAcceptsEmails(!acceptsEmails)}
        />
        <FormControlLabel
          control={<Checkbox />}
          label='Flagged'
          checked={isFlagged}
          onChange={(e) => setsIsFlagged(!isFlagged)}
        />
        <TextField
          id='customer-notes'
          label='Customer Notes'
          variant='outlined'
          multiline
          rows={4}
          value={customerNotes}
          onChange={(e) => setsCustomerNotes(e.target.value)}
        />
        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
      </FormGroup>
    </Box>
  );
}