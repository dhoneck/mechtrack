import {Link, useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Grid,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import NavBar from '../layout/NavBar';
import EstimateModal from '../modals/EstimateModal';

export default function ViewVehicle() {
  // Get ID of customer from URL
  let { id } = useParams();

  // Vehicle information from fetch call
  const [vehicle, setVehicleInfo] = useState([]);

  // Track modal state for the edit vehicle modal
  const [openVehicle, setOpenVehicle] = useState(false);
  const handleOpenVehicle = () => setOpenVehicle(true);
  const handleCloseVehicle = () => setOpenVehicle(false);

  // Track modal state for the add service modal
  const [openService, setOpenService] = useState(false);
  const handleOpenService = () => setOpenService(true);
  const handleCloseService = () => setOpenService(false);

  // Set empty vehicle form values
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [license, setLicense] = useState(null);
  const [vin, setVin] = useState(null);
  const [notes, setNotes] = useState('');

  // Set service form values
  const [dateTime, setDateTime] = useState(dayjs());
  const [estimatedTime, setEstimatedTime] = useState('1 hr');
  const [services, setServices] = useState([]);
  const [customerNotes, setCustomerNotes] = useState('');

  const serviceOptions = [
    'Oil lube and filter',
    'Diagnostic',
    'Tire rotation',
    'Brake replacement',
    'Alignment',
    'Transmission',
    'Electrical systems',
    'Other',
  ];


  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format('YYYY-MM-DD hh:mm a');
  }

  const handleCheckboxChange = (service) => (event) => {
    if (event.target.checked) {
      setServices([...services, service]);
    } else {
      setServices(services.filter((item) => item !== service));
    }
  };

  /** Make GET request using ID from URL param to grab customer data  */
  const getVehicleInfo = async () => {
    try {
      let url = `http://127.0.0.1:8000/api/vehicles/${id}/`;

      await axios.get(url)
        .then(function (response) {
          console.log('response:')
          console.log(response.data)
          // Store vehicle data from response
          setVehicleInfo(response.data);
          console.log('vehicle:');
          console.log(response.data);

          // Set initial values for 'Edit Vehicle' form
          setMake(response.data.make);
          setModel(response.data.model);
          setYear(response.data.year);
          setColor(response.data.color);
          setLicense(response.data.license);
          setVin(response.data.vin);
          setNotes(response.data.notes);
        });

    } catch (error) {
      console.error(error);
    }
  }

  // /** Make PUT request to update vehicle data */
  const updateVehicle = async () => {
    console.log('Attempting to update vehicle');

    // Combine 'Edit Vehicle' form values to use in PUT request
    let values = {
      'make': make,
      'model': model,
      'year': year,
      'color': color,
      'license': license,
      'vin': vin,
      'notes': notes,
    };

    try {
      let url = `http://127.0.0.1:8000/api/vehicles/${id}/`;

      await axios.put(url, values)
        .then(function () {
          // Close modal
          handleCloseVehicle();

          // Refresh vehicle info
          getVehicleInfo();
        });
    } catch (error) {
      console.error(error);
    }
  }

  /** Make POST request to add new service for a vehicle */
  const scheduleServices = async () => {
    console.log('Attempting to schedule service');

    // Combine 'Schedule Service' form values to use in POST request
    let values = {
      'vehicle': vehicle.id,
      'datetime': dateTime,
      'estimated_time': estimatedTime,
      'services': services,
      'customer_notes': customerNotes,
    };

    console.log(values);

    // Try to create a new vehicle
    try {
      let url = `http://127.0.0.1:8000/api/services/`;

      await axios.post(url, values)
        .then(function (response) {
          console.log('Service Scheduled:');
          console.log(response.data);

          // Close modal
          handleCloseService();

          // Refresh vehicle info
          getVehicleInfo();
        });
    } catch (error) {
      console.error(error);
      console.error(values)
    }
  }

  /** Make DELETE request to delete an estimate */
  const deleteEstimate = async (id) => {
    console.log(`Attempting to delete estimate #${id}`);
    try {
      let url = `http://127.0.0.1:8000/api/estimates/${id}`;

      // Verify deletion of estimate
      const confirmation = window.confirm('Are you sure you want to delete this estimate?\nThis action cannot be undone.');
      if (!confirmation) {
        return;
      }

      await axios.delete(url)
        .then(function (response) {
          console.log('Estimate Deleted:');
          console.log(response.data);

          // Refresh vehicle info
          getVehicleInfo();
        });
    } catch (error) {
      console.error(error);
    }
  };

  /** Make DELETE request to delete an vehicle */
  const deleteVehicle = async () => {
    console.log(`Attempting to delete vehicle #${id}`);
    try {
      let url = `http://127.0.0.1:8000/api/vehicles/${id}/`;

      // Verify deletion of vehicle
      const confirmation = window.confirm('Are you sure you want to delete this vehicle?\nThis action cannot be undone.');
      if (!confirmation) {
        return;
      }

      await axios.delete(url)
        .then(function (response) {
          console.log('Vehicle Deleted:');
          console.log(response.data);

          // Redirect to vehicles search
          window.location = 'http://localhost:3000/vehicles'
        });
    } catch (error) {
      console.error(error);
    }
  };

  // Get customer info
  useEffect(() => {
    getVehicleInfo();
  }, [])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
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
      <Typography variant='h2'>Vehicle Detail</Typography>
      <NavBar active="Vehicles" />
      <br />
      <Typography><strong>{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.color ? `(${vehicle.color})` : ''}</strong></Typography>
      <Typography><strong>Owners: {vehicle.list_owners}</strong></Typography>
      <Typography></Typography>
      <br/>
      <Box sx={{ display:'Flex', justifyContent:'center', gap: '5px' }}>
        <Button variant='outlined' onClick={handleOpenVehicle}>Edit</Button>
        <Button variant='outlined' color='error' onClick={deleteVehicle}>Delete</Button>
      </Box>
      <br/>
      <br/>
      <Typography><strong>VIN: {vehicle.vin ? vehicle.vin : 'n/a'}</strong></Typography>
      <br/>
      <Typography><strong>License: {vehicle.license ? vehicle.license : 'n/a'}</strong></Typography>
      <br/>
    <Typography><strong>Notes: {vehicle.notes ? vehicle.notes : 'n/a'}</strong></Typography>
      <br/>


      {/* Modal start for editing vehicle */}
      <Modal
        open={openVehicle}
        onClose={handleCloseVehicle}
        aria-labelledby="vehicle-modal-title"
        aria-describedby="vehicle-modal-description"
      >
        <Box sx={style}>
          <Typography id="vehicle-modal-title" variant="h6" component="h2">
            Edit Vehicle
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
            <Button variant='contained' onClick={updateVehicle}>Submit</Button>
          </FormGroup>
        </Box>
      </Modal>
      {/* Modal end for editing vehicle */}

      {/* Modal start for adding service */}
      <Modal
        open={openService}
        onClose={handleCloseService}
        aria-labelledby="service-modal-title"
        aria-describedby="service-modal-description"
      >
        <Box sx={style}>
          <Typography id="service-modal-title" sx={{ mb: 2 }} variant="h6" component="h2">
            Schedule Service
          </Typography>
          <FormGroup>
            <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                <DateTimePicker
                  timeSteps={{ minutes: 15 }}
                  label='Service Date & Time'
                  sx={{ mb: 1 }}
                  value={dateTime}
                  onChange={(e) => setDateTime(e)}
                />
            </LocalizationProvider>
            <FormControl sx={{ mb: 1 }}>
              <InputLabel id="demo-simple-select-label">Estimated Time</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={estimatedTime}
                label="Estimated Time"
                onChange={(e) => setEstimatedTime(e.target.value)}
              >
                <MenuItem value={'1 hr'}>1 hr</MenuItem>
                <MenuItem value={'2 hrs'}>2 hrs</MenuItem>
                <MenuItem value={'3 hrs'}>3 hrs</MenuItem>
                <MenuItem value={'4 hrs'}>4 hrs</MenuItem>
                <MenuItem value={'5 hrs'}>5 hrs</MenuItem>
                <MenuItem value={'6 hrs'}>6 hrs</MenuItem>
                <MenuItem value={'7 hrs'}>7 hrs</MenuItem>
                <MenuItem value={'8 hrs'}>8 hrs</MenuItem>
                <MenuItem value={'1+ day'}>1+ day</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="h6">Services</Typography>
            <Grid container spacing={2}>
              {serviceOptions.map((service, index) => (
                <Grid item xs={6} key={index}>
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={services.includes(service)}
                        onChange={handleCheckboxChange(service)}
                        color="primary"
                      />
                    }
                    label={service}
                  />
                </Grid>
              ))}
            </Grid>
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
            <Button variant='contained' onClick={scheduleServices}>Submit</Button>
          </FormGroup>
        </Box>
      </Modal>
      {/* Modal end for adding service */}

      <br/>
      <Typography variant='h4'>Estimates</Typography>
      <br/>
      <EstimateModal vehicle_id={id}></EstimateModal>
      <br/>
      <br/>
      <TableContainer container={Paper} sx={{ textAlign: 'center' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Last Modified</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Parts</TableCell>
              <TableCell>Labor</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicle.estimates && vehicle.estimates.map(estimate => (
              <TableRow key={estimate.id} id={estimate.id}>
                <TableCell>{formatDateTime(estimate.updated_at)}</TableCell>
                <TableCell>{estimate.estimate_items_str}</TableCell>
                <TableCell>${estimate.parts_total}</TableCell>
                <TableCell>${estimate.labor_total}</TableCell>
                <TableCell>${estimate.estimate_total} + Tax</TableCell>
                <TableCell>
                  <IconButton sx={{ padding:'0 8px 0 0' }}><ScheduleIcon /></IconButton>
                  <IconButton sx={{ paddingY:'0' }}><Link to={'estimate/' + estimate.id} target='_blank'><VisibilityIcon /></Link></IconButton>
                  <IconButton sx={{ paddingY:'0' }}><EditIcon  /></IconButton>
                  <IconButton sx={{ paddingY:'0' }}>
                    <DeleteIcon onClick={() => deleteEstimate(estimate.id)} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <br/>
      <Typography variant='h4' sx={{ marginTop:'20px'}}>Services</Typography>
      <br/>
      <Button variant='outlined' sx={{ mx: 1 }} onClick={setOpenService}>Schedule Services</Button>
      <br/>
      <br/>
      <TableContainer container={Paper} sx={{ textAlign: 'center' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service Date & Time</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Estimated Time</TableCell>
                <TableCell>Mileage</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicle.services && vehicle.services.map(service => (
                <TableRow key={service.id}>
                  <TableCell>{formatDateTime(service.datetime)}</TableCell>
                  <TableCell>{service.services.join(', ')}</TableCell>
                  <TableCell>{service.estimated_time}</TableCell>
                  <TableCell>{service.mileage ? service.mileage : 'n/a'}</TableCell>
                  <TableCell>n/a</TableCell>
                  <TableCell>{service.completed ? service.completed : 'Not completed'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  );
}