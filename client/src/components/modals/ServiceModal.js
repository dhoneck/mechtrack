import { useEffect, useState } from 'react';

import axios from 'axios';
import dayjs from 'dayjs';

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid, IconButton, InputAdornment,
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
import {AddCircleOutline, RemoveCircleOutline} from "@mui/icons-material";

/** A modal form for scheduling auto service work */
function ServiceFormModal({ open, handleClose, vehicleId, getVehicleInfo=null, estimate=null, serviceId=null }) {

  // Store existing service, if exists
  const [serviceToEdit, setServiceToEdit] = useState(null);

  // Store status choices for status dropdown
  const [statusChoices, setStatusChoices] = useState([]);

  // Default service form values
  const [dateTime, setDateTime] = useState(dayjs().hour(11).minute(0).second(0));
  const [estimatedTime, setEstimatedTime] = useState('1 hr');
  const [services, setServices] = useState([{ id: null, description: '', part_price: '', labor_price: '' }]);
  const [customerNotes, setCustomerNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [mileage, setMileage] = useState(null);
  const [status, setStatus] = useState('Scheduled');


  // Store date being used in schedule preview widget
  const [previewDate, setPreviewDate] = useState(new Date());

  // Store services scheduled happening on preview date
  const [scheduledServices, setScheduledServices] = useState([]);

  // Define functions to handle form changes
  const handleDateTimeChange = (e) => {
      setDateTime(e);
      setPreviewDate(new Date(e));
    };

  const handleEstimatedTimeChange = (event) => {
    setEstimatedTime(event.target.value);
  };
  
  const handleAddService = () => setServices([...services, { id: null, description: '', part_price: '', labor_price: '' }]);

  const handleRemoveService = (index, id) => {
    if (services.length === 1) return;  // Ensure at least one service exists
    // Remove the service and reset services useState
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);

    // Add service item id to array that will be deleted upon form submission
    // An id means that it's an existing service item and will need to be deleted with a DELETE request, hence tracking
    // No id means that the service doesn't already exist and doesn't need a DELETE request
    if (id) {
      setItemsToDelete([...itemsToDelete, id]);
    }
  };

  // Store an array of service item IDs that need to be deleted
  const [itemsToDelete, setItemsToDelete] = useState([]);

  const handleDescriptionChange = (index, value) => {
    const newServices = [...services];
    newServices[index].description = value;
    setServices(newServices);
  };

  const handlePartPriceChange = (index, value) => {
    const newServices = [...services];
    newServices[index].part_price = value;
    setServices(newServices);
  };

  const handleLaborPriceChange = (index, value) => {
    const newServices = [...services];
    newServices[index].labor_price = value;
    setServices(newServices);
  };

  const handleInternalNotesChange = (event) => {
    setInternalNotes(event.target.value);
  };

  const handleCustomerNotesChange = (event) => {
    setInternalNotes(event.target.value);
  };

  const handleMileageChange = (event) => {
    setMileage(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  /** Searches for services on a particular date */
  const handlePreview = async (e) => {
    // Set date for schedule preview widget
    setPreviewDate(new Date(e));

    // Update dateTime with the new date while preserving the time
    setDateTime((prevDateTime) => dayjs(e).hour(prevDateTime.hour()).minute(prevDateTime.minute()));

    // Format date and endpoint URL
    let date = new Date(e);
    let dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let url = process.env.REACT_APP_API_URL + 'services/?service_date=' + dateStr;

    // Make a GET request to the API to get scheduled services for a particular date
    try {
      const response = await axios.get(url);
      setScheduledServices(response.data)
    } catch (error) {
      console.error(error);
    }
  }

   /** Make POST request to add new service for a vehicle */
  const handleSubmit = async () => {
    console.log('Attempting to schedule service');

    // const serviceData = {
    //   dateTime,
    //   estimatedTime,
    //   services,
    //   customerNotes,
    //   status,
    //   internalNotes,
    //   mileage,
    //   items: serviceItems,
    // };


    // Combine 'Schedule Service' form values to use in POST request
    let values = {
      'vehicle_id': vehicleId,
      'datetime': dateTime,
      'estimated_time': estimatedTime,
      'service_items': services,
      'customer_notes': customerNotes,
      'estimate_id': estimate ? estimate.id: null,
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

  function setFormValues() {
      setDateTime(dayjs(serviceToEdit.datetime));
      setEstimatedTime(serviceToEdit.estimated_time);
      setServices(serviceToEdit.service_items);
      setCustomerNotes(serviceToEdit.customer_notes);
      setInternalNotes(serviceToEdit.internal_notes);
      setMileage(serviceToEdit.mileage);
      setStatus(serviceToEdit.status);
  }

  async function getService() {
    console.log('Getting service');
    try {
      let url = `http://127.0.0.1:8000/api/services/${serviceId}/`;

      await axios.get(url)
        .then(function (response) {
          console.log('Service grabbed:');
          console.log(response.data);

          // Refresh vehicle info
          setServiceToEdit(response.data);

          setFormValues();
        });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log('In useEffect');
    // Assign estimate items to service items if an estimate was passed
    if (estimate) {
      console.log('An estimate was passed to service form as a template:');
      console.log(estimate);

      setServices(estimate.estimate_items);
    }

    // If serviceId was passed then get the service
    if (serviceId) {
      console.log('Service ID was passed');
      getService();
    }

    async function fetchStatusChoices() {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'status-choices/');
        setStatusChoices(response.data);
      } catch (error) {
        console.error('Error fetching status choices:', error);
      }
    }

    fetchStatusChoices();
  }, []);

  // Define modal style
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '1100px',
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

            {/* Service Details Section */}
            <Box sx={{flex: '4'}}>
              <Typography variant='h6' sx={{marginBottom: '15px'}}>Service Details</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                  <DateTimePicker
                    timeSteps={{ minutes: 15 }}
                    label='Service Date & Time'
                    sx={{ mb: 1, width: '100%' }}
                    value={dateTime}
                    onChange={handleDateTimeChange}
                  />
              </LocalizationProvider>
              <FormControl sx={{ mb: 1, width: '100%' }}>
                <InputLabel id='demo-simple-select-label'>Estimated Time</InputLabel>
                <Select
                  sx={{display: 'block'}}
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={estimatedTime}
                  label='Estimated Time'
                  onChange={handleEstimatedTimeChange}
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
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <Typography display="inline" sx={{ flexGrow: 1 }}>Description</Typography>
                <Typography display="inline" sx={{ width: '125px' }}>Part Price</Typography>
                <Typography display="inline" sx={{ width: '125px' }}>Labor Price</Typography>
                <Typography display="inline" sx={{ width: '40px' }}></Typography>
              </Box>
              {services.map((row, index) => (
                <Box key={index} data-id={row.id} sx={{ display: 'flex', flexDirection: 'row', gap: '10px', marginY: '10px' }}>
                  <TextField sx={{ flexGrow: 1 }} value={row.description} onChange={(e) => handleDescriptionChange(index, e.target.value)} />
                  <TextField
                    sx={{ width: '125px' }}
                    value={row.part_price}
                    onChange={(e) => handlePartPriceChange(index, e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  /><TextField
                    sx={{ width: '125px' }}
                    value={row.labor_price}
                    onChange={(e) => handleLaborPriceChange(index, e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                  <IconButton onClick={() => handleRemoveService(index, row.id)} disabled={services.length === 1}>
                    <RemoveCircleOutline />
                  </IconButton>
                </Box>
                ))}
                <Button onClick={handleAddService} startIcon={<AddCircleOutline />}>Add Item</Button>

              <TextField
                id='customer-notes'
                label='Customer Notes'
                variant='outlined'
                multiline
                rows={3}
                fullWidth
                value={customerNotes}
                onChange={handleCustomerNotesChange}
                sx={{ mb: 1 }}
              />

              {/* New fields */}
              <TextField
                id='internal-notes'
                label='Internal Notes'
                variant='outlined'
                multiline
                rows={3}
                fullWidth
                value={internalNotes}
                onChange={handleInternalNotesChange}
                sx={{ mb: 1 }}
              />

              <TextField
                id='mileage'
                label='Mileage'
                variant='outlined'
                fullWidth
                value={mileage}
                onChange={handleMileageChange}
                sx={{ mb: 1 }}
              />

              <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel id='status-select-label'>Status</InputLabel>
                <Select
                  labelId='status-select-label'
                  id='status-select'
                  value={status}
                  label='Status'
                  onChange={handleStatusChange}
                >
                  {statusChoices.map((statusOption) => (
                    <MenuItem key={statusOption[0]} value={statusOption[0]}>
                      {statusOption[1]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <Button variant='contained' onClick={handleSubmit}>Submit</Button>
            </Box>
            {/* End of service details section */}

            {/* Schedule Preview Section */}
            <Box sx={{flex: '5'}}>
              <Typography textAlign='center' variant='h6' sx={{marginBottom: '15px'}}>Preview Schedule</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginTop:'0px'}}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={dayjs(previewDate)}
                  onChange={handlePreview}
                  sx={{
                    '& .MuiPickersCalendarHeader-root': {
                      marginTop: 0,
                    },
                  }}
                />
              </LocalizationProvider>
              <Typography textAlign='center' variant='h6'>Scheduled Services</Typography>
              <TableContainer container={Paper} sx={{ textAlign: 'center', maxHeight: 300, overflow: 'auto' }}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ padding: '8px 3px' }}>Drop Off</TableCell>
                      <TableCell sx={{ padding: '8px 3px' }}>Estimated Time</TableCell>
                      <TableCell sx={{ padding: '8px 3px' }}>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {scheduledServices && scheduledServices.length > 0 ? (
                    scheduledServices.map(service => (
                      <TableRow key={service.id}>
                        <TableCell sx={{ padding: '8px 3px' }}>{new Date(service.datetime).toLocaleString([], { hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' })}</TableCell>
                        <TableCell sx={{ padding: '8px 3px' }}>{service.estimated_time}</TableCell>
                        <TableCell sx={{ padding: '8px 3px' }}>{service.service_items_str}</TableCell>
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
            {/* End of schedule preview section  */}
          </FormGroup>
        </Box>
      </Modal>
    </>
  );
}

export default ServiceFormModal;