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

export default function ViewVehicle() {
  // Grab and rename id URL param to vehicleId
  let { id: vehicleId } = useParams();

  // Vehicle info from fetch call
  const [vehicle, setVehicle] = useState([]);

  // Track modal state for the edit vehicle modal
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const handleVehicleModalOpen = () => setIsVehicleModalOpen(true);
  const handleVehicleModalClose = () => setIsVehicleModalOpen(false);

  // Tracks modal state for add estimate modal
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const handleEstimateModalOpen = (estimate = null ) => {
    setEditEstimate(estimate);
    setIsEstimateModalOpen(true);
  }
  const handleEstimateModalClose = () => setIsEstimateModalOpen(false);

  // Track modal state for the add service modal
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const handleServiceModalOpen = (estimate = null, service = null) => {
    setEditEstimate(estimate);
    setIsServiceModalOpen(true);
  }
  const handleServiceModalClose = () => setIsServiceModalOpen(false);

  // Stores whether estimate modal is in create or edit mode
  const [editEstimate, setEditEstimate] = useState(null)

  // Set empty vehicle form values
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [license, setLicense] = useState(null);
  const [vin, setVin] = useState(null);
  const [notes, setNotes] = useState('');

  // If true it will show estimates table but if false it will show services table
  const [isShowingEstimates, setIsShowingEstimates] = useState(true);

  /** GET vehicle and set states. */
  const handleVehicleGet = async () => {
    try {
      const response = await getVehicle(vehicleId);
      const vehicleData = response.data;

      setVehicle(vehicleData);

      // Set initial values for 'Edit Vehicle' form
      setMake(vehicleData.make);
      setModel(vehicleData.model);
      setYear(vehicleData.year);
      setColor(vehicleData.color);
      setLicense(vehicleData.license);
      setVin(vehicleData.vin);
      setNotes(vehicleData.notes);
    } catch (error) {
      console.error(error);
    }
  }

  /** PUT vehicle, refresh vehicle data, and close edit vehicle modal. */
  const handleVehicleUpdate = async () => {
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
      await updateVehicle(vehicleId, values);
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

  // Update vehicle data when a modal state changes
  useEffect(() => {
    const fetchData = async () => {
      await handleVehicleGet();
    };
    fetchData();
  }, [isVehicleModalOpen, isEstimateModalOpen, isServiceModalOpen]);

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
      <br />
      <Typography><strong>{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.color ? `(${vehicle.color})` : ''}</strong></Typography>
      <Typography><strong>Owners: {vehicle.list_owners}</strong></Typography>
      <Typography></Typography>
      <br/>
      <Box sx={{ display:'Flex', justifyContent:'center', gap: '5px' }}>
        <Button variant='outlined' onClick={handleVehicleModalOpen}>Edit</Button>
        <Button variant='outlined' color='error' onClick={handleVehicleDelete}>Delete</Button>
      </Box>
      <br/>
      <br/>
      <Typography><strong>VIN: {vehicle.vin ? vehicle.vin : 'n/a'}</strong></Typography>
      <br/>
      <Typography><strong>License: {vehicle.license ? vehicle.license : 'n/a'}</strong></Typography>
      <br/>
      <Typography><strong>Notes: {vehicle.notes ? vehicle.notes : 'n/a'}</strong></Typography>
      <br/>

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
              value={make}
              onChange={(e) => setMake(e.target.value)}
              sx={{ my: 1 }}
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
            <Button variant='contained' onClick={handleVehicleUpdate}>Submit</Button>
          </FormGroup>
        </Box>
      </Modal>
      {/* Modal end for editing vehicle */}

      {/* Estimate and Service Modals*/}
      <EstimateModal
          open={isEstimateModalOpen}
          handleClose={handleEstimateModalClose}
          vehicleId={parseInt(vehicleId)}
          estimate={editEstimate}
      />

      <ServiceModal
          open={isServiceModalOpen}
          handleClose={handleServiceModalClose}
          vehicleId={vehicle.id}
          handleVehicleGet={handleVehicleGet}
          estimate={editEstimate}
      />
      {/* End of Estimate and Service Modals*/}

      {/* Vehicle Estimates and Services Table Heading */}
      <Box onClick={()=> setIsShowingEstimates(!isShowingEstimates)} sx={{cursor:'pointer'}}>
        {isShowingEstimates && <Typography variant='h4'><strong>Estimates</strong> | <span style={{color:'gray'}}>Services</span></Typography>}
        {!isShowingEstimates && <Typography variant='h4'><span style={{color:'gray'}}>Estimates</span> | <strong>Services</strong></Typography>}
        <br/>
      </Box>
      {/* End of estimates and services table heading */}

      {/* Estimates Table */}
      {isShowingEstimates && <Box>
        <Button variant='outlined' onClick={() => handleEstimateModalOpen()}>Create Estimate</Button>
        <br/>
        <br/>
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
                    <IconButton>
                      <DeleteIcon onClick={() => handleEstimateDelete(estimate.id)} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>}
      {/* End of estimates table */}

      {/* Services Table */}
      {!isShowingEstimates && <Box>
        <Button variant='outlined' onClick={() => handleServiceModalOpen(null)} sx={{ mx: 1 }}>Schedule Services</Button>
        <br/>
        <br/>
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
                      <EditIcon onClick={() => handleServiceModalOpen(null, service)} />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon onClick={() => handleServiceDelete(service.id)} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>}
      {/* End of services table */}
    </Box>
  );
}