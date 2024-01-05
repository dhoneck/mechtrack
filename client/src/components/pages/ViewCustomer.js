import {Box, Button, Checkbox, FormControlLabel, FormGroup, Modal, TextField, Typography} from '@mui/material';
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { useEffect, useState} from 'react';
import NavBar from '../partials/NavBar';
import * as React from 'react';

export default function ViewCustomer() {
  let { id } = useParams();

  const [result, setResult] = useState([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Hold form values
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [acceptsTexts, setAcceptsTexts] = useState(false);
  const [acceptsEmails, setAcceptsEmails] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');

  const fetchData = async () => {
    // Make a GET request to the API
    try {
      let url = `http://127.0.0.1:8000/api/customers/${id}/`
      console.log(`API URL: ${url}`)
      const response = await axios.get(url)
        .then(function (response) {
          console.log('In then statement!')
          console.log(response.data);
          setResult(response.data);
          // Set values
          setFirstName(response.data.first_name);
          setLastName(response.data.last_name);
          setPhoneNumber(response.data.phone);
          setEmail(response.data.email);
          setAcceptsTexts(response.data.accepts_texts);
          setAcceptsEmails(response.data.accepts_emails);
          setIsFlagged(response.data.flagged);
          setCustomerNotes(response.data.notes);

        });
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [])

  const style2 = {
  my: 5
}

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    // height: 750,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={{textAlign: 'center'}}>
      <Typography variant='h2'>Customer Detail</Typography>
      <NavBar></NavBar>
      <br/>
      <Typography><strong>{result.first_name} {result.last_name}</strong></Typography>
      <br/>
      <Button variant='outlined' onClick={handleOpen}>Edit</Button>

      {/* Modal Start */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit User
          </Typography>
          <FormGroup>
            <TextField
              style={style2}
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
            <Button variant='contained'>Submit</Button>
            {/*<Button variant='contained' onClick={handleSubmit}>Submit</Button>*/}
          </FormGroup>
        </Box>
      </Modal>
      {/* Modal End */}

      <br/>
      <br/>
      <Typography>{result.phone}</Typography>
      <Typography>Accepts Texts: {String(result.accepts_texts)}</Typography>
      <br/>
      <Typography>{result.email}</Typography>
      <Typography>Accepts Emails: {String(result.accepts_emails)}</Typography>
      <br/>
      <Typography>Flagged: {String(result.flagged)}</Typography>
      <Typography>Notes: {result.notes}</Typography>
      <br/>
      <Typography variant='h4'>Vehicles</Typography>
      <br/>
      <Button variant='outlined'>Add Vehicle</Button>
      <br/>
      <br/>
      <Typography>No vehicles for this customer</Typography>
      <br/>
      <Typography variant='h4'>Service Record</Typography>
      <br/>
      <Button variant='outlined'>Add Service</Button>
      <br/>
      <br/>
      <Typography>No service records for this customer</Typography>
    </Box>
  );
}