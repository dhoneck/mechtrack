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
  const [isFlagged, setIsFlagged] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');


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
    let url = 'http://127.0.0.1:8000/api/customers/'
    let values = {
      'first_name': firstName,
      'last_name': lastName,
      'phone': verifiedPhoneNumber,
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

  let navigate = useNavigate();

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
      <Typography variant='h2' align='center'>Add Customer</Typography>
      <Button variant='contained' sx={{my: 1}} onClick={() => navigate(-1)}>Back</Button>
      <FormGroup>
        <TextField
          style={style}
          required id='first-name'
          label='First Name'
          variant='outlined'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{mb: 1}}
        />
        <TextField
          required id='last-name'
          label='Last Name'
          variant='outlined'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{mb: 1}}
        />
        <TextField
          required id='phone-number'
          label='Phone Number'
          variant='outlined'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={{mb: 1}}
        />
        <TextField
          id='email'
          label='Email'
          variant='outlined'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{mb: 1}}
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
          onChange={(e) => setIsFlagged(!isFlagged)}
        />
        <TextField
          id='customer-notes'
          label='Customer Notes'
          variant='outlined'
          multiline
          rows={4}
          value={customerNotes}
          onChange={(e) => setCustomerNotes(e.target.value)}
          sx={{mb: 1}}
        />
        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
      </FormGroup>
    </Box>
  );
}