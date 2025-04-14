import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import {
  Box,
  Button,
  FormControl,
  FormGroup,
  IconButton,
  InputAdornment,
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

import { getPricing } from '../../api/branchesAPI';
import { getCurrentBranch } from '../../api/usersAPI';
import {
  createService,
  getService,
  getServicesByDate,
  createServiceItem,
  updateServiceItem,
  deleteServiceItem,
  getStatusChoices,
} from '../../api/servicesAPI';

/** A modal form for scheduling auto service work
 * @param {boolean} open - Whether the modal is open or closed
 * @param {function} handleClose - Function to close the modal
 * @param {number} vehicleId - ID of the vehicle associated with the service
 * @param {object} estimate - Existing estimate object to edit (optional)
 * @param {number} serviceId - ID of the service to edit (optional)
 * @param {function} refreshFunction - Function to refresh the parent component (optional)
 * */
function ServiceModal({ open, handleClose, vehicleId, estimate=null, serviceId=null, refreshFunction=null, }) {

  // Store status choices for status dropdown
  const [statusChoices, setStatusChoices] = useState([]);

  // Store the default pricing for the current branch or use business pricing if not available
  const [defaultPricing, setDefaultPricing] = useState([]);

  const [currentBranch, setCurrentBranch] = useState(null);
  const [currentBranchName, setCurrentBranchName] = useState(null);

  // Default service form values
  const [serviceForm, setServiceForm] = useState({
    vehicle_id: vehicleId,
    datetime: dayjs().hour(11).minute(0).second(0),
    estimated_time: '1 hr',
    service_items: [{ id: null, description: '', part_price: '', labor_price: '' }],
    customer_notes: '',
    internal_notes: '',
    mileage: null,
    status: 'Scheduled',
  });

  /** Update a specific field in the vehicle form. */
  const handleFieldChange = (field, value) => {
    console.log('Value in handleFieldChange:', value);
    setServiceForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Store date being used in schedule preview widget
  const [previewDate, setPreviewDate] = useState(new Date());

  // Store services scheduled happening on preview date
  const [scheduledServices, setScheduledServices] = useState([]);

  // Store an array of service item IDs that need to be deleted
  const [itemsToDelete, setItemsToDelete] = useState([]);

  // Define functions to handle form changes
  const handleDateTimeChange = (e) => {
      handleFieldChange('datetime', e);
      setPreviewDate(new Date(e));
    };
  
  const handleAddRow = () => {
    setServiceForm((prev) => ({
      ...prev,
      service_items: [...prev.service_items, { id: null, description: '', part_price: '', labor_price: '' }],
    }));
  };

  const handleRemoveRow = (index, id) => {
    if (serviceForm.service_items.length === 1) return;  // Ensure at least one service exists
    // Remove the service and reset services useState
    const newServices = [...serviceForm.service_items];
    newServices.splice(index, 1);
    handleFieldChange('service_items', newServices);

    // Add service item id to array that will be deleted upon form submission
    // An id means that it's an existing service item and will need to be deleted with a DELETE request, hence tracking
    // No id means that the service doesn't already exist and doesn't need a DELETE request
    if (id) {
      setItemsToDelete([...itemsToDelete, id]);
    }
  };

  const handleDescriptionChange = (index, value) => {
    const newServices = [...serviceForm.service_items];
    newServices[index].description = value;
    handleFieldChange('service_items', newServices);
  };

  const handlePartPriceChange = (index, value) => {
    const newServices = [...serviceForm.service_items];
    newServices[index].part_price = value;
    handleFieldChange('service_items', newServices);
  };

  const handleLaborPriceChange = (index, value) => {
    const newServices = [...serviceForm.service_items];
    newServices[index].labor_price = value;
    handleFieldChange('service_items', newServices);
  };

  /** Searches for services on a particular date */
  const handleSchedulePreview = async (e) => {
    console.log('Preview date:', e);
    // Set date for schedule preview widget
    setPreviewDate(new Date(e));

    // Update dateTime with the new date while preserving the time
    const lastDateTime = serviceForm.datetime;
    handleFieldChange('datetime', dayjs(e).hour(lastDateTime.hour()).minute(lastDateTime.minute()));

    // Format date and endpoint URL
    let date = new Date(e);
    let dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let url = process.env.REACT_APP_API_URL + 'services/?service_date=' + dateStr;

    // Make a GET request to the API to get scheduled services for a particular date
    try {
      const response = await getServicesByDate(dateStr);
      const services = response.data;
      setScheduledServices(services)
    } catch (error) {
      console.error(error);
    }
  }

   /** Make POST request to add new service for a vehicle */
  const handleSubmit = async () => {
    // Try to create a new service
    try {
      console.log('serviceForm to submit');
      console.log(serviceForm);
      await createService(serviceForm);

      // Refresh the parent component if a refresh function was provided
      if (refreshFunction) { refreshFunction(); }

      // Close modal
      handleClose();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleServiceGet() {
    try {
      const response = await getService(serviceId);
      const service = response.data;
      console.log('handleServiceGet service:');
      console.log(service);
      if (!service.service_items) {
        console.log('Adding default service item');
        handleFieldChange('service_items', [{ id: null, description: '', part_price: '', labor_price: '' }]);
      }

      setServiceForm(service);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log('vehicleId:', vehicleId);

    console.log('serviceForm from useEffect');
    console.log(serviceForm)
    // Assign estimate items to service items if an estimate was passed
    if (estimate) {
      handleFieldChange('service_items', estimate.estimate_items);
    }

    // If serviceId was passed then get the service because
    if (serviceId) {
      console.log('Service ID was passed');
      handleServiceGet();
    }

    async function fetchStatusChoices() {
      try {
        const response = await getStatusChoices();
        const statusChoices = response.data;
        setStatusChoices(statusChoices);
      } catch (error) {
        console.error('Error fetching status choices:', error);
      }
    }

    async function fetchDefaultPricing() {
      try {
        const branchResponse = await getCurrentBranch();
        let currentBranch = branchResponse.data.current_branch;
        let currentBranchName = branchResponse.data.current_branch_name;

        if (!currentBranch) {
          console.warn('No current branch for user selected, will not look for service pricing');
          return;
        }

        setCurrentBranch(currentBranch);
        setCurrentBranchName(currentBranchName);

        const pricingResponse = await getPricing(currentBranch);
        const pricing = pricingResponse.data.default_pricing;
        setDefaultPricing(pricing);
      } catch (error) {
         console.error('Error fetching default pricing:', error);
      }
    }

    fetchDefaultPricing();
    fetchStatusChoices();
  }, [vehicleId, open]);

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
          <Typography id='service-modal-title' variant='h5' component='h2'>
            {estimate ? 'Schedule Service From Estimate' : 'Schedule Service'}
          </Typography>
          {currentBranch && <Typography sx={{mb: 1}}>{currentBranchName ? `(${currentBranchName})` : ''}</Typography>}
          <FormGroup sx={{display: 'flex', flexDirection: 'row', gap: '20px' }}>

            {/* Service Details Section */}
            <Box sx={{flex: '4'}}>
              <Typography variant='h6' sx={{marginBottom: '15px'}}>Service Details</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                  <DateTimePicker
                    timeSteps={{ minutes: 15 }}
                    label='Service Date & Time'
                    sx={{ mb: 1, width: '100%' }}
                    value={serviceForm.datetime}
                    onChange={(e) => handleDateTimeChange(e.target.value)}
                  />
              </LocalizationProvider>
              <FormControl sx={{ mb: 1, width: '100%' }}>
                <InputLabel id='demo-simple-select-label'>Estimated Time</InputLabel>
                <Select
                  sx={{display: 'block'}}
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={serviceForm.estimated_time}
                  label='Estimated Time'
                  onChange={(e) => handleFieldChange('estimated_time', e.target.value)}
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
              {serviceForm.service_items && serviceForm.service_items.map((row, index) => (
                <Box key={index} data-id={row.id} sx={{ display: 'flex', flexDirection: 'row', gap: '10px', marginY: '10px' }}>
                  <TextField sx={{ flexGrow: 1 }} value={row.description} onChange={(e) => handleDescriptionChange(index, e.target.value)} />
                  <TextField
                    sx={{ width: '125px' }}
                    value={row.part_price}
                    onChange={(e) => handlePartPriceChange(index, e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      },
                    }}
                  /><TextField
                    sx={{ width: '125px' }}
                    value={row.labor_price}
                    onChange={(e) => handleLaborPriceChange(index, e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      },
                    }}
                  />
                  <IconButton onClick={() => handleRemoveRow(index, row.id)} disabled={serviceForm.service_items.length === 1}>
                    <RemoveCircleOutline />
                  </IconButton>
                </Box>
                ))}
                <Button onClick={handleAddRow} startIcon={<AddCircleOutline />}>Add Item</Button>

              <TextField
                id='customer-notes'
                label='Customer Notes'
                variant='outlined'
                multiline
                rows={3}
                fullWidth
                value={serviceForm.customerNotes}
                onChange={(e) => handleFieldChange('customer_notes', e.target.value)}
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
                value={serviceForm.internalNotes}
                onChange={(e) => handleFieldChange('internal_notes', e.target.value)}
                sx={{ mb: 1 }}
              />

              <TextField
                id='mileage'
                label='Mileage'
                variant='outlined'
                fullWidth
                value={serviceForm.mileage}
                onChange={(e) => handleFieldChange('mileage', e.target.value)}
                sx={{ mb: 1 }}
              />

              <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel id='status-select-label'>Status</InputLabel>
                <Select
                  labelId='status-select-label'
                  id='status-select'
                  value={serviceForm.status}
                  label='Status'
                  onChange={(e) => handleFieldChange('status', e.target.value)}
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
                  onChange={handleSchedulePreview}
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

export default ServiceModal;