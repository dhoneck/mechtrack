import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import {
  Autocomplete,
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
  const [currentBranch, setCurrentBranch] = useState(null);
  const [currentBranchName, setCurrentBranchName] = useState(null);
  const [defaultPricing, setDefaultPricing] = useState([]);
  const [statusChoices, setStatusChoices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    vehicle_id: null,
    branch_id: null,
    datetime: dayjs().hour(11).minute(0).second(0),
    estimated_time: '1 hr',
    service_items: [{ id: null, description: '', part_price: '', labor_price: '' }],
    customer_notes: '',
    internal_notes: '',
    mileage: null,
    status: 'Scheduled',
    estimate: null,
  });
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const [previewDate, setPreviewDate] = useState(new Date());
  const [scheduledServices, setScheduledServices] = useState([]);

  /** Update a specific field in the vehicle form. */
  const handleFieldChange = (field, value) => {
    setServiceForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field == 'datetime') {
      setPreviewDate(new Date(value));
    }
  };

  /** Adds a blank row to the service_items. */
  const handleAddRow = () => {
    setServiceForm((prev) => ({
      ...prev,
      service_items: [...prev.service_items, { id: null, description: '', part_price: '', labor_price: '' }],
    }));
  };

  /** Updates specific field within the service_items Service Form. */
  const updateRowField = (index, field, value) => {
    const updatedRows = [...serviceForm.service_items];
    updatedRows[index][field] = value;
    handleFieldChange('service_items', updatedRows);
  };

  /** Removes a service_items row. */
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

  /** Searches for services on a particular date. */
  const handleSchedulePreview = async (e) => {
    // Set date for schedule preview widget
    setPreviewDate(new Date(e));

    // Update dateTime with the new date while preserving the time
    handleFieldChange('datetime', e);


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

  function filterObject(data, allowedKeys, nestedKey = null, nestedAllowedKeys = null) {
    // Filter top-level keys
    const filteredData = Object.keys(data).reduce((acc, key) => {
      if (allowedKeys.includes(key)) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    // If there's a nested key to filter
    if (nestedKey && nestedKey in data && nestedAllowedKeys) {
      filteredData[nestedKey] = data[nestedKey].map(item =>
        Object.keys(item).reduce((acc, key) => {
          if (nestedAllowedKeys.includes(key)) {
            acc[key] = item[key];
          }
          return acc;
        }, {})
      );
    }

    return filteredData;
  }

  const allowedKeys = ['vehicle_id', 'branch_id', 'datetime', 'estimated_time', 'service_items', 'customer_notes', 'internal_notes', 'mileage', 'status', 'estimate'];
  const nestedAllowedKeys = ['id', 'description', 'part_price', 'labor_price'];

  /** Submit form for either creating or editting a service */
  const handleSubmit = async () => {
    // Try to create a new service
    try {
      handleFieldChange('vehicle_id', vehicleId);
      handleFieldChange('branch_id', currentBranch);

      console.log('service form to be submitted:');
      console.log(serviceForm);
      if (!serviceId) {
        await createService(serviceForm);
      } else {
        const filteredServiceData = filterObject(serviceForm, allowedKeys, "service_items", nestedAllowedKeys);
      }

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

      if (!service.service_items) {
        handleFieldChange('service_items', [{ id: null, description: '', part_price: '', labor_price: '' }]);
      }

      setServiceForm(service);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (estimate) handleFieldChange('service_items', estimate.estimate_items);
    if (serviceId) handleServiceGet();

    const fetchData = async () => {
      try {
        const branchResponse = await getCurrentBranch();
        setCurrentBranch(branchResponse.data.current_branch);
        setCurrentBranchName(branchResponse.data.current_branch_name);
        const pricingResponse = await getPricing(branchResponse.data.current_branch);
        setDefaultPricing(pricingResponse.data.default_pricing);
        const statusResponse = await getStatusChoices();
        setStatusChoices(statusResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
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
                    value={ serviceForm.datetime ? dayjs(serviceForm.datetime) : dayjs() }
                    onChange={(e) => handleFieldChange('datetime', e)}
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
                  <Autocomplete
                    disablePortal
                    freeSolo
                    sx={{ flexGrow: 1 }}
                    options={defaultPricing}
                    getOptionLabel={(option) => option.name}
                    inputValue={row.description}
                    onInputChange={(event, newInputValue) => {
                      updateRowField(index, 'description', newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                      />
                    )}
                    onChange={(event, newValue) => {
                      updateRowField(index, 'description', newValue?.description || '');
                      updateRowField(index, 'part_price', newValue?.part_price || '');
                      updateRowField(index, 'labor_price', newValue?.labor_price || '');
                    }}
                  />
                  <TextField
                    sx={{ width: '125px' }}
                    value={row.part_price}
                    onChange={(e) => updateRowField(index, 'part_price', e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      },
                    }}
                  /><TextField
                    sx={{ width: '125px' }}
                    value={row.labor_price}
                    onChange={(e) => updateRowField(index, 'labor_price', e.target.value)}
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