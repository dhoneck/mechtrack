import React, { useState } from 'react';
import axios from 'axios';
import dayjs from "dayjs";

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
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


function ServiceFormModal({ open, handleClose, vehicleId, getVehicleInfo }) {
  // Set service form values
  const [dateTime, setDateTime] = useState(dayjs());
  const [estimatedTime, setEstimatedTime] = useState('1 hr');
  const [services, setServices] = useState([]);
  const [customerNotes, setCustomerNotes] = useState('');

  // Define available services
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

  // Define modal style
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
    </>
  );
}

export default ServiceFormModal;