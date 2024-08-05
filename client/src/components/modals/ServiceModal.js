import React, {useState} from 'react';
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
  Typography,
} from '@mui/material';
import {DateTimePicker, LocalizationProvider,} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {StaticDatePicker} from '@mui/x-date-pickers/StaticDatePicker';

/** A modal form for scheduling auto service work */
function ServiceFormModal({ open, handleClose, vehicleId, getVehicleInfo=null, estimate=null }) {
  if (estimate) {
    console.log('Estimate passed to service form:');
    console.log(estimate);
  }

  // Set default service form values
  const [dateTime, setDateTime] = useState(dayjs());
  const [estimatedTime, setEstimatedTime] = useState('1 hr');
  const [services, setServices] = useState([]);
  const [scheduledServices, setScheduledServices] = useState([]);
  const [customerNotes, setCustomerNotes] = useState('');

  // Track date being used in schedule preview widget
  const [previewDate, setPreviewDate] = useState(new Date());

  // Define available services
  let serviceOptions = [];
  if (estimate) {  // Add service options matching a quote
    for (const item of estimate.estimate_items) {
      console.log('item');
      console.log(item);
      serviceOptions.push(
        { description: item.description, part_price: item.part_price, labor_price: item.labor_price });
    }
  } else {  // Add default service options
    serviceOptions = [
      { description: 'Oil lube and filter', part_price: 0.00, labor_price: 0.00 },
      { description: 'Diagnostic', part_price: 0.00, labor_price: 0.00 },
      { description: 'Tire rotation', part_price: 0.00, labor_price: 0.00 },
      { description: 'Brake replacement', part_price: 0.00, labor_price: 0.00 },
      { description: 'Alignment', part_price: 0.00, labor_price: 0.00 },
      { description: 'Transmission', part_price: 0.00, labor_price: 0.00 },
      { description: 'Electrical systems', part_price: 0.00, labor_price: 0.00 },
      { description: 'Other', part_price: 0.00, labor_price: 0.00 },
    ];
  }

  /** Searches for services on a particular date */
  const handlePreview = async (e) => {
    // Set date for schedule preview widget
    setPreviewDate(new Date(e));

    // Format date and endpoint URL
    let date = new Date(e);
    let dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let url = 'http://127.0.0.1:8000/api/services/?service_date=' + dateStr;

    // Make a GET request to the API to get scheduled services for a particular date
    try {
      const response = await axios.get(url);
      setScheduledServices(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  /** Tracks which services are selected in the service option checkboxes */
  const handleCheckboxChange = (service) => (event) => {
    if (event.target.checked) {
      setServices([...services, { description: service.description, part_price: 0.00, labor_price: 0.00 }]);
    } else {
      setServices(services.filter((item) => item.description !== service.description));
    }
  };

   /** Make POST request to add new service for a vehicle */
  const scheduleServices = async () => {
    console.log('Attempting to schedule service');

    // Combine 'Schedule Service' form values to use in POST request
    let values = {
      'vehicle_id': vehicleId,
      'datetime': dateTime,
      'estimated_time': estimatedTime,
      'service_items': services,
      'customer_notes': customerNotes,
    };

    console.log('Service values');
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
                {serviceOptions.map((serviceOption, index) => (
                  <Grid item xs={estimate ? 12 : 6} key={index}>
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={services.some((s1) => s1.description === serviceOption.description)}
                          onChange={handleCheckboxChange(serviceOption)}
                          color='primary'
                        />
                      }
                      label={serviceOption.description}
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