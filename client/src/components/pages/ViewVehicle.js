import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField,
  Typography
} from '@mui/material';
import {Link, useParams} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import NavBar from '../partials/NavBar';

export default function ViewVehicle() {
  // Get ID of customer from URL
  let { id } = useParams();

  // Vehicle information from fetch call
  const [vehicle, setVehicleInfo] = useState([]);

  // // Track modal state for the edit vehicle modal
  const [openVehicle, setOpenVehicle] = useState(false);
  const handleOpenVehicle = () => setOpenVehicle(true);
  const handleCloseVehicle = () => setOpenVehicle(false);

  // Set empty vehicle form values
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [license, setLicense] = useState(null);
  const [vin, setVin] = useState(null);
  const [notes, setNotes] = useState('');

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

  // Get customer info
  useEffect(() => {
    getVehicleInfo();
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
      <Typography variant='h2'>Vehicle Detail</Typography>
      <NavBar></NavBar>
      <br/>
      <Typography><strong>{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.color ? `(${vehicle.color})` : ''}</strong></Typography>
      <br/>
      <Button variant='outlined' onClick={handleOpenVehicle}>Edit</Button>
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
            <Button variant='contained' onClick={updateVehicle}>Submit</Button>
          </FormGroup>
        </Box>
      </Modal>
      {/* Modal end for editing vehicle */}

      <br/>
      <Typography variant='h4'>Service Record</Typography>
      <br/>
      <Button variant='outlined'>Add Service</Button>
      <br/>
      <br/>
      <Typography>No service records for this vehicle</Typography>
      <TableContainer container={Paper} sx={{textAlign: 'center'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Mileage</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicle.services ? vehicle.services.map(service => (
                <TableRow key={service.id}>
                  <TableCell>{service.date}</TableCell>
                  <TableCell>{service.services.join(', ')}</TableCell>
                  <TableCell>{service.mileage ? service.mileage : 'n/a'}</TableCell>
                  <TableCell>n/a</TableCell>
                  <TableCell>{service.completed ? service.completed : 'Not completed'}</TableCell>
                </TableRow>
              )) : 'No services found'}
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  );
}