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
import {Link, useParams} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
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
  const [notes, setNotes] = useState('');

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

  /** Make POST request to update customer data */
  const addVehicle = async () => {
    // Combine 'Add Vehicle' form values to use in POST request
    let values = {
      'make': make,
      'model': model,
      'year': year,
      'color': color,
      'license': license,
      'vin': vin,
      'notes': notes,
    };

    // Try to create a new vehicle
    try {
      let url = `http://127.0.0.1:8000/api/vehicles/`;

      await axios.post(url, values)
        .then(function (response) {
          console.log('New vehicle response');
          console.log(response);
          console.log(response.data);
          let user_id = customerInfo.id;
          let new_vehicle_id = response.data.id;

          let customer_vehicle_values = {
            'customer': user_id,
            'vehicle': new_vehicle_id
          }
          let url2 = `http://127.0.0.1:8000/api/customer-vehicle/`;

          // Associate vehicle with customer
          axios.post(url2, customer_vehicle_values);

          // Close modal
          handleCloseVehicle();

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
            <Button variant='contained' onClick={updateCustomer}>Submit</Button>
          </FormGroup>
        </Box>
      </Modal>
      {/* Modal end for editing customer */}

      {/* Modal start for adding vehicle */}
      <Modal
        open={openVehicle}
        onClose={handleCloseVehicle}
        aria-labelledby="vehicle-modal-title"
        aria-describedby="vehicle-modal-description"
      >
        <Box sx={style}>
          <Typography id="vehicle-modal-title" variant="h6" component="h2">
            Add Vehicle
          </Typography>
          <FormGroup>
            <TextField
              style={style2}
              required id='make'
              label='Make'
              variant='outlined'
              value={make}
              onChange={(e) => setMake(e.target.value)}
              sx={{mb: 1}}
            />
            <TextField
              required id='model'
              label='Model'
              variant='outlined'
              value={model}
              onChange={(e) => setModel(e.target.value)}
              sx={{mb: 1}}
            />
            <TextField
              required id='year'
              label='Year'
              variant='outlined'
              value={year}
              onChange={(e) => setYear(e.target.value)}
              sx={{mb: 1}}
            />
            <TextField
              id='color'
              label='Color'
              variant='outlined'
              value={color}
              onChange={(e) => setColor(e.target.value)}
              sx={{mb: 1}}
            />
            <TextField
              id='license'
              label='License'
              variant='outlined'
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              sx={{mb: 1}}
            />
            <TextField
              id='vin'
              label='VIN'
              variant='outlined'
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              sx={{mb: 1}}
            />
            <TextField
              id='notes'
              label='Vehicle Notes'
              variant='outlined'
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{mb: 1}}
            />
            <Button variant='contained' onClick={addVehicle}>Submit</Button>
          </FormGroup>
        </Box>
      </Modal>
      {/* Modal end for adding vehicle */}

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
      <Button variant='outlined' onClick={handleOpenVehicle}>Add Vehicle</Button>
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
            <Button as={Link} to={'/vehicles/' + vehicle.id} size="small">View Record</Button>
          </CardActions>
        </Card>
       ))}
      </Box>
    </Box>
  );
}