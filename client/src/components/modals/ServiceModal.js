import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Modal, Paper,
  Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';


function ServiceFormModal({ open, handleClose, vehicleId, getVehicleInfo=null, estimate=null }) {
  console.log('Here is the estimate from the schedule service form');
  console.log(estimate)

  // Set service form values
  const [dateTime, setDateTime] = useState(dayjs());
  const [estimatedTime, setEstimatedTime] = useState('1 hr');
  const [services, setServices] = useState([]);
  const [scheduledServices, setScheduledServices] = useState([]);
  const [customerNotes, setCustomerNotes] = useState('');

  const [previewDate, setPreviewDate] = useState(new Date());

  // Define available services
  let serviceOptions = [];
  if (estimate) {
    for (const item of estimate.estimate_items) {
      serviceOptions.push(`${item.description} - $${item.estimate_item_total} + tax`);
    }
  } else {
    serviceOptions = [
      'Oil lube and filter',
      'Diagnostic',
      'Tire rotation',
      'Brake replacement',
      'Alignment',
      'Transmission',
      'Electrical systems',
      'Other',
    ];
  }

  // Define modal style
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '1000px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handlePreview = async (e) => {
    setPreviewDate(new Date(e));
    console.log('handlePreview');
    console.log(e);
    console.log('Look up services based on date');
    let date = new Date(e);
    let dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let url = 'http://127.0.0.1:8000/api/services/?service_date=' + dateStr;

    // Make a GET request to the API
    try {
      console.log(`API URL: ${url}`)
      const response = await axios.get(url);
      setScheduledServices(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  /** Tracks which services are selected in the checkbox inputs */
  const handleCheckboxChange = (service) => (event) => {
    if (event.target.checked) {
      setServices([...services, service]);
    } else {
      setServices(services.filter((item) => item !== service));
    }
  };

   /** Make POST request to add new service for a vehicle */
  const scheduleServices = async () => {
    console.log('Attempting to schedule service');

    // Combine 'Schedule Service' form values to use in POST request
    let values = {
      'vehicle': vehicleId,
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
          handleClose();

          // Refresh vehicle info
          getVehicleInfo();
        });
    } catch (error) {
      console.error(error);
      console.error(values);
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='service-modal-title'
        aria-describedby='service-modal-description'
      >
        <Box sx={style}>
          <Typography id='service-modal-title' sx={{ mb: 2 }} variant='h5' component='h2'>
            {estimate ? 'Schedule Service From Estimate' : 'Schedule Service'}
          </Typography>
          <FormGroup sx={{display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <Box sx={{flex: '4'}}>
              <Typography variant='h6' sx={{marginBottom: '15px'}}>Service Details</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                  <DateTimePicker
                    timeSteps={{ minutes: 15 }}
                    label='Service Date & Time'
                    sx={{ mb: 1, width: '300px' }}
                    value={dateTime}
                    onChange={(e) => setDateTime(e)}
                  />
              </LocalizationProvider>
              <FormControl sx={{ mb: 1, width: '300px' }}>
                <InputLabel id='demo-simple-select-label'>Estimated Time</InputLabel>
                <Select
                  sx={{display: 'block'}}
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={estimatedTime}
                  label='Estimated Time'
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
              <Typography variant='h6'>Services</Typography>
              <Grid container>
                {serviceOptions.map((service, index) => (
                  <Grid item xs={estimate ? 12 : 6} key={index}>
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={services.includes(service)}
                          onChange={handleCheckboxChange(service)}
                          color='primary'
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
                fullWidth
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button variant='contained' onClick={scheduleServices}>Submit</Button>
            </Box>
            <Box sx={{flex: '5'}}>
              <Typography textAlign='center' variant='h6' sx={{marginBottom: '15px'}}>Preview Schedule</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginTop:'0px'}}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  defaultValue={dayjs(new Date())}
                  onChange={(e)=> { handlePreview(e) }}
                  sx={{
                    '& .MuiPickersCalendarHeader-root': {
                      marginTop: 0,
                    },
                  }}
                />
              </LocalizationProvider>
              <Typography textAlign='center' variant='h6'>Scheduled Services</Typography>
              <TableContainer container={Paper} sx={{ textAlign: 'center' }}>
                <Table size={'small'}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Drop Off</TableCell>
                      <TableCell>Estimated Time</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {scheduledServices && scheduledServices.length > 0 ? (
                    scheduledServices.map(service => (
                      <TableRow key={service.id}>
                        <TableCell>{new Date(service.datetime).toLocaleString()}</TableCell>
                        <TableCell>{service.estimated_time}</TableCell>
                        <TableCell>{service.services}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} sx={{textAlign:'center'}}>No Services Scheduled for {previewDate.toDateString()}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </FormGroup>
        </Box>
      </Modal>
    </>
  );
}

export default ServiceFormModal;