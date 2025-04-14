import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

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
import { getVehicle, updateVehicle, deleteVehicle } from '../../api/vehiclesAPI';
import { deleteEstimate } from '../../api/estimatesAPI';
import { deleteService } from '../../api/servicesAPI';
import { formatDateTime } from '../../utils/dateUtils';
import {getCurrentBranch} from "../../api/usersAPI";

export default function ViewVehicle() {
  // Grab vehicle ID from URL param
  let { id: vehicleId } = useParams();

  // Vehicle info from fetch call
  const [vehicle, setVehicle] = useState([]);

  // Vehicle modal states
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const handleVehicleModalOpen = () => setIsVehicleModalOpen(true);
  const handleVehicleModalClose = () => setIsVehicleModalOpen(false);

  // Estimate modal states
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const handleEstimateModalOpen = (estimate = null ) => {
    setEstimate(estimate);
    setIsEstimateModalOpen(true);
  }
  const handleEstimateModalClose = () => setIsEstimateModalOpen(false);

  // Service modal states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const handleServiceModalOpen = (estimate = null, service = null) => {
    setEstimate(estimate);
    setServiceId(service);
    setIsServiceModalOpen(true);
  }
  const handleServiceModalClose = () => {
    setIsServiceModalOpen(false);
  }

  // Estimate and service data to pass to modals
  const [estimate, setEstimate] = useState(null);
  const [serviceId, setServiceId] = useState(null);

  // If true it will show services table but if false it will show estimates table
  const [isShowingServices, setIsShowingServices] = useState(true);

  // State variables for vehicle form
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: null,
    color: '',
    license: null,
    vin: null,
    notes: '',
  });

  /** Update a specific field in the vehicle form. */
  const handleFieldChange = (field, value) => {
    setVehicleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /** GET vehicle and set states. */
  const handleVehicleGet = async () => {
    try {
      const response = await getVehicle(vehicleId);
      const vehicleData = response.data;

      setVehicle(vehicleData);
      setVehicleForm({
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        color: vehicleData.color,
        license: vehicleData.license,
        vin: vehicleData.vin,
        notes: vehicleData.notes,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /** PUT vehicle, refresh vehicle data, and close edit vehicle modal. */
  const handleVehicleUpdate = async () => {
    try {
      await updateVehicle(vehicleId, vehicleForm);
      await handleVehicleGet();
      handleVehicleModalClose();
    } catch (error) {
      console.error(error);
    }
  }

  /** DELETE vehicle and redirect to vehicles page. */
  const handleVehicleDelete = async () => {
    try {
      // Verify deletion of vehicle
      const confirmation = window.confirm('Are you sure you want to delete this vehicle?\nThis action cannot be undone.');
      if (!confirmation) {
        return;
      }
      await deleteVehicle(vehicleId);
      window.location = process.env.REACT_APP_BASE_URL + 'vehicles';
    } catch (error) {
      console.error(error);
    }
  };

  /** DELETE estimate and refresh vehicle data. */
  const handleEstimateDelete = async (id) => {
    try {
      // Verify deletion of estimate
      const confirmation = window.confirm('Are you sure you want to delete this estimate?\nThis action cannot be undone.');
      if (!confirmation) {
        return;
      }
      await deleteEstimate(id);
      await handleVehicleGet();
    } catch (error) {
      console.error(error);
    }
  };

  /** DELETE service and refresh vehicle data. */
  const handleServiceDelete = async (id) => {
    try {
      // Verify deletion of service
      const confirmation = window.confirm('Are you sure you want to delete this service?\nThis action cannot be undone.');
      if (!confirmation) {
        return;
      }
      await deleteService(id);
      await handleVehicleGet();
    } catch (error) {
      console.error(error);
    }
  };

  // Update vehicle data on component mount
  useEffect(() => {
    console.log('ViewVehicle useEffect');
    const fetchData = async () => {
      await handleVehicleGet();
    };
    fetchData();
  }, []);

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

  return (
    <Box sx={{ textAlign: 'center', minWidth: '519px', maxWidth: '75%', margin: 'auto' }}>
      <Typography variant='h2'>Vehicle Detail</Typography>
      <NavBar active="Vehicles" />
      <Typography sx={{ mt:3, mb: 1 }}><strong>{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.color ? `(${vehicle.color})` : ''}</strong></Typography>
      <Typography sx={{ my:1 }}><strong>Owners: {vehicle.list_owners}</strong></Typography>
      <Box sx={{ display:'Flex', justifyContent:'center', gap: '5px', my: 1 }}>
        <Button variant='outlined' onClick={handleVehicleModalOpen}>Edit</Button>
        <Button variant='outlined' color='error' onClick={handleVehicleDelete}>Delete</Button>
      </Box>
      <Typography sx={{ my:1 }}><strong>VIN: {vehicle.vin ? vehicle.vin : 'n/a'}</strong></Typography>
      <Typography sx={{ my:1 }}><strong>License: {vehicle.license ? vehicle.license : 'n/a'}</strong></Typography>
      <Typography sx={{ my:1 }}><strong>Notes: {vehicle.notes ? vehicle.notes : 'n/a'}</strong></Typography>

      {/* Edit Vehicle Modal */}
      <Modal
        open={isVehicleModalOpen}
        onClose={handleVehicleModalClose}
        aria-labelledby="vehicle-modal-title"
        aria-describedby="vehicle-modal-description"
      >
        <Box sx={style}>
          <Typography id="vehicle-modal-title" variant="h6" component="h2">
            Edit Vehicle
          </Typography>
          <FormGroup>
            <TextField
              required id='make'
              label='Make'
              variant='outlined'
              value={vehicleForm.make}
              onChange={(e) => handleFieldChange('make', e.target.value)}
              sx={{ my: 1 }}
            />
            <TextField
              required id='model'
              label='Model'
              variant='outlined'
              value={vehicleForm.model}
              onChange={(e) => handleFieldChange('model', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              required id='year'
              label='Year'
              variant='outlined'
              value={vehicleForm.year}
              onChange={(e) => handleFieldChange('year', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              id='color'
              label='Color'
              variant='outlined'
              value={vehicleForm.color}
              onChange={(e) => handleFieldChange('color', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              id='license'
              label='License'
              variant='outlined'
              value={vehicleForm.license}
              onChange={(e) => handleFieldChange('license', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              id='vin'
              label='VIN'
              variant='outlined'
              value={vehicleForm.vin}
              onChange={(e) => handleFieldChange('vin', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              id='notes'
              label='Vehicle Notes'
              variant='outlined'
              multiline
              rows={4}
              value={vehicleForm.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button variant='contained' onClick={handleVehicleUpdate}>Submit</Button>
          </FormGroup>
        </Box>
      </Modal>
      {/* Modal end for editing vehicle */}

      {/* Estimate and Service Modals*/}
      <EstimateModal
          open={isEstimateModalOpen}
          handleClose={handleEstimateModalClose}
          vehicleId={vehicle.id}
          estimate={estimate}
          refreshFunction={handleVehicleGet}
      />

      <ServiceModal
          open={isServiceModalOpen}
          handleClose={handleServiceModalClose}
          vehicleId={vehicle.id}
          refreshFunction={handleVehicleGet}
          estimate={estimate}
          serviceId={serviceId}
      />
      {/* End of Estimate and Service Modals*/}

      {/* Vehicle Estimates and Services Table Heading */}
      <Box onClick={()=> setIsShowingServices(!isShowingServices)} sx={{ cursor:'pointer', mt: 1, mb: 1 }}>
        {!isShowingServices && <Typography variant='h4'>
          <strong>Estimates</strong>
          <span style={{color:'gray'}}> | Services</span>
        </Typography>}
        {isShowingServices && <Typography variant='h4'>
          <span style={{color:'gray'}}>Estimates | </span>
          <strong>Services</strong></Typography>}

      </Box>
      {/* End of estimates and services table heading */}

      {/* Estimates Table */}
      {!isShowingServices && <Box>
        <Button variant='outlined' sx={{ mb: 1 }} onClick={() => handleEstimateModalOpen()}>Create Estimate</Button>
        <TableContainer container={Paper} sx={{ textAlign: 'center' }}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Last Modified</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Parts</TableCell>
                <TableCell>Labor</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Scheduled</TableCell>
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
                  <TableCell>{estimate.scheduled}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleServiceModalOpen(estimate)}>
                      <ScheduleIcon />
                    </IconButton>
                    <Link to={'/estimates/' + estimate.id} target='_blank'>
                      <IconButton>
                        <VisibilityIcon />
                      </IconButton>
                    </Link>
                    <IconButton onClick={() => handleEstimateModalOpen(estimate)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEstimateDelete(estimate.id)} >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {vehicle.estimates && vehicle.estimates.length == 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
                      No estimates found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>}
      {/* End of estimates table */}

      {/* Services Table */}
      {isShowingServices && <Box>
        <Button variant='outlined' sx={{ mb: 1 }} onClick={() => handleServiceModalOpen()}>Schedule Services</Button>
        <TableContainer container={Paper} sx={{ textAlign: 'center' }}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Service Date & Time</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Estimated Time</TableCell>
                <TableCell>Mileage</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicle.services && vehicle.services.map(service => (
                <TableRow key={service.id}>
                  <TableCell>{formatDateTime(service.datetime)}</TableCell>
                  <TableCell>{service.service_items_str}</TableCell>
                  <TableCell>{service.estimated_time}</TableCell>
                  <TableCell>{service.mileage ? service.mileage : 'n/a'}</TableCell>
                  <TableCell>{service.service_subtotal ? '$' + service.service_subtotal + ' Tax' : 'n/a'}</TableCell>
                  <TableCell>{service.status ? service.status : 'n/a'}</TableCell>
                  <TableCell>
                    <Link to={'/services/' + service.id} target='_blank'>
                      <IconButton>
                        <VisibilityIcon />
                      </IconButton>
                    </Link>
                    <IconButton>
                      <EditIcon onClick={() => handleServiceModalOpen(null, service.id)} />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon onClick={() => handleServiceDelete(service.id)} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {vehicle.services && vehicle.services.length == 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
                      No services found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>}
      {/* End of services table */}
    </Box>
  );
}