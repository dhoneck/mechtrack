import { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import {
  Autocomplete,
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

import NavBar from '../layout/NavBar';
import ServiceModal from "../modals/ServiceModal";

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

  // Track modal state for vehicle linking modal
  const [openVehicleLink, setOpenVehicleLink] = useState(false);
  const handleOpenVehicleLink = () => setOpenVehicleLink(true);
  const handleCloseVehicleLink = () => setOpenVehicleLink(false);

  // Track modal state for vehicle unlinking modal
  const [openVehicleUnlink, setOpenVehicleUnlink] = useState(false);
  const handleOpenVehicleUnlink = () => setOpenVehicleUnlink(true);
  const handleCloseVehicleUnlink = () => setOpenVehicleUnlink(false);

  // Track vehicle that has the add service button clicked
  const [targetVehicle, setTargetVehicle] = useState(null);

  // Track modal state for the add service modal
  const [openService, setOpenService] = useState(false);
  const handleOpenService = (vehicleId) => {
    setTargetVehicle(vehicleId);
    setOpenService(true);
  }
  const handleCloseService = () => setOpenService(false);

  // Set empty customer form values which will be populated by the fetched customer data for editing customer
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [acceptsTexts, setAcceptsTexts] = useState(false);
  const [acceptsEmails, setAcceptsEmails] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');

  // Set empty vehicle form values for adding a new vehicle
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [license, setLicense] = useState(null);
  const [vin, setVin] = useState(null);
  const [notes, setNotes] = useState('');

  // Hold all vehicles for linking purposes
  const [vehicles, setVehicles] = useState([]);

  // Hold customer's vehicles for unlinking purposes
  const [customerVehicles, setCustomerVehicles] = useState([]);

  // Holds the vehicle that is attempting to be linked to a customer
  const [vehicleLink, setVehicleLink] = useState('');

  function makeVehicleDescription(vehicle) {
    let id = vehicle.id;
    let color = vehicle.color ? vehicle.color : '';
    let year = vehicle.year ? vehicle.year : ''
    let make = vehicle.make ? vehicle.make : '';
    let model = vehicle.model ? vehicle.model : '';
    let license = vehicle.license ? vehicle.license : '';
    let otherOwners = vehicle.list_owners ? '| ' + vehicle.list_owners : '| No customers associated';
    return `(ID: ${id}) ${color} ${year} ${make} ${model} ${license} ${otherOwners}`
  }

  /** Make GET request using ID from URL param to grab customer data */
  const getCustomerInfo = async () => {
    try {
      let url = `http://127.0.0.1:8000/api/customers/${id}/`;
      await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(function (response) {
          console.log('Fetched Customer Data:')
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

          response.data.vehicles && setCustomerVehicles(response.data.vehicles.map(vehicle => makeVehicleDescription(vehicle)));
        });

    } catch (error) {
      console.error(error);
    }
  }

  /** Make PUT request to update customer data */
  const updateCustomer = async () => {
    // Add +1 to phone number if it is not there
    let verifiedPhoneNumber = phoneNumber;
    if (phoneNumber.substring(0, 2) !== '+1' && phoneNumber.length === 10) {
      verifiedPhoneNumber = '+1' + phoneNumber;
      setPhoneNumber(phoneNumber);
    } else {
      console.log('Phone number is not correct!');
    }

    // Combine 'Edit User' form values to use in PUT request (don't include vehicles)
    let values = {
      'first_name': firstName,
      'last_name': lastName,
      'phone': verifiedPhoneNumber,
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

  /** Make POST request to add new vehicle for a customer */
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
          console.log('New vehicle created:');
          console.log(response.data);

          console.log('Associating vehicle with customer...');
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

  /** Make POST request to link existing vehicle to existing customer */
  const linkVehicle = async () => {
    console.log('Attempting to link vehicle to customer');
    let vehicleID = parseInt(vehicleLink.split(' ')[1].slice(0, -1));
    let customerID = parseInt(customerInfo.id);
    let values = {
      'customer': customerID,
      'vehicle': vehicleID
    };

    try {
      let url = `http://127.0.0.1:8000/api/customer-vehicle/`;

      await axios.post(url, values)
        .then(function () {
          // Close modal
          handleCloseVehicleLink();

          // Refresh customer info
          getCustomerInfo();
        });
    } catch (error) {
      console.error(error);
    }
  }

  /** Make DELETE request to unlink vehicle to customer */
  const unlinkVehicle = async () => {
    console.log('Attempting to unlink vehicle from customer');

    let customerID = parseInt(customerInfo.id);
    let vehicleID = parseInt(vehicleLink.split(' ')[1].slice(0, -1));

    try {
      let url = `http://127.0.0.1:8000/api/customer-vehicle/delete-by-filter/?customer=${customerID}&vehicle=${vehicleID}`;

      await axios.delete(url)
        .then(function () {
          // Close modal
          handleCloseVehicleUnlink();

          // Refresh customer info
          getCustomerInfo();
        });
    } catch (error) {
      console.error(error);
    }
  }

   /** Make GET request to get all vehicle data */
  const getVehicles = async () => {
    // Try to get all vehicles
    try {
      let url = `http://127.0.0.1:8000/api/vehicles/`;

      await axios.get(url)
        .then(function (response) {
          console.log('All vehicles');
          console.log(response.data);
          let rawVehicleList = response.data;
          console.log(rawVehicleList);
          setVehicles(rawVehicleList.map(vehicle => makeVehicleDescription(vehicle)));
        });
    } catch (error) {
      console.error(error);
    }
  }

  // Get customer info
  useEffect(() => {
    getCustomerInfo();
    getVehicles();
  }, [openVehicle, openVehicleLink, openVehicleUnlink])

  // Custom styles
    const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const style2 = {
    my: 5
  }

  return (
    <Box sx={{
      textAlign: 'center',
      minWidth: '519px',
      maxWidth: '75%',
      margin: 'auto' }}
    >
      <Typography variant='h2'>Customer Detail</Typography>
      <NavBar active='Customers' />
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
              sx={{ mb: 1 }}
            />
            <TextField
              required id='last-name'
              label='Last Name'
              variant='outlined'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              required id='phone-number'
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
              sx={{ mb: 1 }}
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
              sx={{ mb: 1 }}
            />
            <TextField
              required id='model'
              label='Model'
              variant='outlined'
              value={model}
              onChange={(e) => setModel(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              required id='year'
              label='Year'
              variant='outlined'
              value={year}
              onChange={(e) => setYear(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              id='color'
              label='Color'
              variant='outlined'
              value={color}
              onChange={(e) => setColor(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              id='license'
              label='License'
              variant='outlined'
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              id='vin'
              label='VIN'
              variant='outlined'
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              id='notes'
              label='Vehicle Notes'
              variant='outlined'
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button variant='contained' onClick={addVehicle}>Submit</Button>
          </FormGroup>
        </Box>
      </Modal>
      {/* Modal end for adding vehicle */}

      {/* Modal start for linking vehicle */}
      <Modal
        open={openVehicleLink}
        onClose={handleCloseVehicleLink}
        aria-labelledby="vehicle-link-modal-title"
        aria-describedby="vehicle-link-modal-description"
      >
        <Box sx={style}>
          <Typography id="vehicle-link-modal-title" variant="h6" component="h2">
            Link Vehicle
          </Typography>
          <FormGroup>
            <Autocomplete
              ListboxProps={{ style: { maxHeight: 250, overflow: 'auto' } }}
              sx={{ my: 2 }}
              id="free-solo-demo"
              options={vehicles.map((option) => option)}
              renderInput={(params) => <TextField {...params} label="Existing Vehicles" />}
              onChange={(e, v) => {setVehicleLink(v)}}
            />
            <Button variant='contained' onClick={linkVehicle}>Submit</Button>
          </FormGroup>
        </Box>
      </Modal>
      {/* Modal end for linking vehicle */}

      {/*Modal start for unlinking vehicle*/}
      <Modal
        open={openVehicleUnlink}
        onClose={handleCloseVehicleUnlink}
        aria-labelledby="vehicle-unlink-modal-title"
        aria-describedby="vehicle-unlink-modal-description"
      >
        <Box sx={style}>
          <Typography id="vehicle-unlink-modal-title" variant="h6" component="h2">
            Unlink Vehicle
          </Typography>
          <FormGroup>
            <Autocomplete
              ListboxProps={{ style: { maxHeight: 250, overflow: 'auto' } }}
              sx={{ my: 2 }}
              id="free-solo-demo"
              options={customerVehicles && customerVehicles.map((option) => option)}
              renderInput={(params) => <TextField {...params} label="Existing Vehicles" />}
              onChange={(e, v) => {setVehicleLink(v)}}
            />
            <Button variant='contained' onClick={unlinkVehicle}>Submit</Button>
          </FormGroup>
        </Box>
      </Modal>
      {/*Modal end for unlinking vehicle*/}

      <br/>
      <br/>
      <Typography>{customerInfo.phone}</Typography>
      <Typography>Accepts Texts: {customerInfo.accepts_texts ? 'Yes' : 'No'}</Typography>
      <br/>
      <Typography>{customerInfo.email}</Typography>
      <Typography>Accepts Emails: {customerInfo.accepts_emails ? 'Yes' : 'No'}</Typography>
      <br/>
      <Typography>Flagged: {customerInfo.flagged  ? 'Yes' : 'No'}</Typography>
      <Typography>Notes: {customerInfo.notes}</Typography>
      <br/>
      <Typography variant='h4'>Vehicles</Typography>
      <br/>
      <Button sx={{ width: 225, mx: 1 }} variant='outlined' onClick={handleOpenVehicle}>Add New Vehicle</Button>
      <Button sx={{ width: 225, mx: 1 }} variant='outlined' onClick={handleOpenVehicleLink}>Link Existing Vehicle</Button>
      <Button sx={{ width: 225, mx: 1 }} variant='outlined' onClick={handleOpenVehicleUnlink}>Unlink Vehicle</Button>
      <br/>
      <br/>

      <ServiceModal
        open={openService}
        handleClose={handleCloseService}
        vehicleId={targetVehicle}
      ></ServiceModal>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap:'wrap'}}>
       {customerInfo.vehicles && customerInfo.vehicles.map(vehicle => (
        <Card sx={{ maxWidth: 275 }} style={{ backgroundColor: 'lightgray' }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Typography>

          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => handleOpenService(vehicle.id)}>Add Service</Button>
            <Button as={Link} to={'/vehicles/' + vehicle.id} size="small">View Record</Button>
          </CardActions>
        </Card>
       ))}
      </Box>
    </Box>
  );
}