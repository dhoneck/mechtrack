import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import axios from 'axios';
import dayjs from 'dayjs';

import {
  Box,
  Button,
  FormGroup,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ScheduleIcon from '@mui/icons-material/Schedule';
import VisibilityIcon from '@mui/icons-material/Visibility';

import NavBar from '../layout/NavBar';
import EstimateModal from '../modals/EstimateModal';
import ServiceModal from '../modals/ServiceModal';

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

  // Stores whether estimate modal is in create or edit mode
  const [editEstimate, setEditEstimate] = useState(false)

  // Tracks modal state for estimate modal
  const [openEstimate, setOpenEstimate] = useState(false);
  const handleOpenEstimate = (edit = false ) => {
    setEditEstimate(edit);
    setOpenEstimate(true);
  }
  const handleCloseEstimate = () => setOpenEstimate(false);

  // Set empty vehicle form values
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [license, setLicense] = useState(null);
  const [vin, setVin] = useState(null);
  const [notes, setNotes] = useState('');

  /** Formats a datetime string using dayjs */
  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format('YYYY-MM-DD hh:mm a');
  }

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

  /** Make PUT request to update vehicle data */
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

      <br/>

      {/* Estimate modal and table display */}
      <Typography variant='h4'>Estimates</Typography>
      <br/>

      <Button variant='outlined' onClick={() => handleOpenEstimate()}>Create Estimate</Button>
      <EstimateModal open={openEstimate} handleClose={handleCloseEstimate} vehicleId={id} edit={editEstimate}/>

      <br/>
      <br/>
      <TableContainer container={Paper} sx={{ textAlign: 'center' }}>
        <Table size={'small'}>
          <TableHead>
            <TableRow>
              <TableCell>Last Modified</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Parts</TableCell>
              <TableCell>Labor</TableCell>
              <TableCell>Total</TableCell>
              <TableCell sx={{ paddingLeft: '24px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicle.estimates && vehicle.estimates.map(estimate => (
              <TableRow key={estimate.id} id={estimate.id}>
                <TableCell>{formatDateTime(estimate.updated_at)}</TableCell>
                <TableCell>{estimate.estimate_items_str}</TableCell>
                <TableCell>${estimate.parts_total}</TableCell>
                <TableCell>${estimate.labor_total}</TableCell>
                <TableCell>${estimate.estimate_subtotal} + Tax</TableCell>
                <TableCell>
                  <IconButton sx={{ }}><ScheduleIcon /></IconButton>
                  <Link to={'estimate/' + estimate.id} target='_blank'>
                    <IconButton sx={{ }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Link>
                  <IconButton onClick={() => handleOpenEstimate(true)} sx={{ }}><EditIcon /></IconButton>
                  <IconButton sx={{ }}>
                    <DeleteIcon onClick={() => deleteEstimate(estimate.id)} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <br/>

      {/* Service modal and table display */}
      <ServiceModal
        open={openService}
        handleClose={handleCloseService}
        vehicleId={vehicle.id}
        getVehicleInfo={getVehicleInfo}
      ></ServiceModal>
      <Typography variant='h4' sx={{ marginTop:'20px'}}>Services</Typography>
      <br/>
      <Button variant='outlined' onClick={handleOpenService} sx={{ mx: 1 }}>Schedule Services</Button>
      <br/>
      <br/>
      <TableContainer container={Paper} sx={{ textAlign: 'center' }}>
          <Table size={'small'}>
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