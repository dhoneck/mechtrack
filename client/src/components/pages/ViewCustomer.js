import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  TextField,
  Typography
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import NavBar from '../partials/NavBar';

export default function ViewCustomer() {
  // Get ID of customer from URL
  let { id } = useParams();

  // Customer information from fetch call
  const [customerInfo, setCustomerInfo] = useState([]);

  // Track modal state for the edit user modal
  const [openUser, setOpenUser] = useState(false);
  const handleOpenUser = () => setOpenUser(true);
  const handleCloseUser = () => setOpenUser(false);

  // Track modal state for the new vehicle modal
  const [openVehicle, setOpenVehicle] = useState(false);
  const handleOpenVehicle = () => setOpenVehicle(true);
  const handleCloseVehicle = () => setOpenVehicle(false);

  // Set empty customer form values
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [acceptsTexts, setAcceptsTexts] = useState(false);
  const [acceptsEmails, setAcceptsEmails] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');

  // Set empty vehicle form values
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [license, setLicense] = useState(null);
  const [vin, setVin] = useState(null);
  const [notes, setNotes] = useState(false);

  /** Make GET request using ID from URL param to grab customer data  */
  const getCustomerInfo = async () => {
    try {
      let url = `http://127.0.0.1:8000/api/customers/${id}/`;

      await axios.get(url)
        .then(function (response) {
          console.log('response:')
          console.log(response.data)
          // Store customer data from response
          setCustomerInfo(response.data);

          // Set initial values for 'Edit User' form
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

  /** Make PUT request to update customer data */
  const updateCustomer = async () => {
    // Combine 'Edit User' form values to use in PUT request (don't include vehicles)
    let values = {
      'first_name': firstName,
      'last_name': lastName,
      'phone': phoneNumber,
      'email': email,
      'accepts_emails': acceptsEmails,
      'accepts_texts': acceptsTexts,
      'flagged': isFlagged,
      'notes': customerNotes,
    };

    try {
      let url = `http://127.0.0.1:8000/api/customers/${id}/`;

      await axios.put(url, values)
        .then(function () {
          // Close modal
          handleCloseUser();

          // Refresh customer info
          getCustomerInfo();
        });
    } catch (error) {
      console.error(error);
    }
  }

  // Get customer info
  useEffect(() => {
    getCustomerInfo();
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
      <Typography><strong>{customerInfo.first_name} {customerInfo.last_name}</strong></Typography>
      <br/>
      <Button variant='outlined' onClick={handleOpenUser}>Edit</Button>

      {/* Modal start for editing customer */}
      <Modal
        open={openUser}
        onClose={handleCloseUser}
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
            {/*<Button variant='contained'>Submit</Button>*/}
            <Button variant='contained' onClick={updateCustomer}>Submit</Button>
          </FormGroup>
        </Box>
      </Modal>
      {/* Modal end for editing customer */}

      <br/>
      <br/>
      <Typography>{customerInfo.phone}</Typography>
      <Typography>Accepts Texts: {String(customerInfo.accepts_texts)}</Typography>
      <br/>
      <Typography>{customerInfo.email}</Typography>
      <Typography>Accepts Emails: {String(customerInfo.accepts_emails)}</Typography>
      <br/>
      <Typography>Flagged: {String(customerInfo.flagged)}</Typography>
      <Typography>Notes: {customerInfo.notes}</Typography>
      <br/>
      <Typography variant='h4'>Vehicles</Typography>
      <br/>
      <Button variant='outlined'>Add Vehicle</Button>
      <br/>
      <br/>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '15px'}}>
       {customerInfo.vehicles && customerInfo.vehicles.map(vehicle => (
        <Card sx={{ maxWidth: 275 }} style={{backgroundColor: 'lightgray'}}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Typography>

          </CardContent>
          <CardActions>
            <Button size="small">Add Service</Button>
            <Button size="small">View Record</Button>
          </CardActions>
        </Card>
       ))}
      </Box>


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