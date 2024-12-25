import { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  TextField,
  Typography
} from '@mui/material';

import NavBar from '../layout/NavBar';
import ServiceModal from "../modals/ServiceModal";

export default function ViewVendor() {
  // Get ID of vendor from URL
  let { id } = useParams();

  // Vendor information from fetch call
  const [vendorInfo, setVendorInfo] = useState([]);

  // Track modal state for the edit user modal
  const [openUser, setOpenUser] = useState(false);
  const handleOpenUser = () => setOpenUser(true);
  const handleCloseUser = () => setOpenUser(false);

  // Track modal state for the new vehicle modal
  const [openVehicle, setOpenVehicle] = useState(false);
  const handleOpenVehicle = () => setOpenVehicle(true);
  const handleCloseVehicle = () => setOpenVehicle(false);

  // Track modal state for vehicle linking modal
  const [openVehicleLink, setOpenVehicleLink] = useState(false);
  const handleOpenVehicleLink = () => setOpenVehicleLink(true);
  const handleCloseVehicleLink = () => setOpenVehicleLink(false);

  // Track modal state for vehicle unlinking modal
  const [openVehicleUnlink, setOpenVehicleUnlink] = useState(false);
  const handleOpenVehicleUnlink = () => setOpenVehicleUnlink(true);
  const handleCloseVehicleUnlink = () => setOpenVehicleUnlink(false);

  // Track vehicle that has the add service button clicked
  const [targetVehicle, setTargetVehicle] = useState(null);

  // Track modal state for the add service modal
  const [openService, setOpenService] = useState(false);
  const handleOpenService = (vehicleId) => {
    setTargetVehicle(vehicleId);
    setOpenService(true);
  }
  const handleCloseService = () => setOpenService(false);

  // Set empty vendor form values which will be populated by the fetched vendor data for editing vendor
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [acceptsTexts, setAcceptsTexts] = useState(false);
  const [acceptsEmails, setAcceptsEmails] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [vendorNotes, setVendorNotes] = useState('');

  // Set empty vehicle form values for adding a new vehicle
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [license, setLicense] = useState(null);
  const [vin, setVin] = useState(null);
  const [notes, setNotes] = useState('');

  // Hold all vehicles for linking purposes
  const [vehicles, setVehicles] = useState([]);

  // Hold vendor's vehicles for unlinking purposes
  const [vendorVehicles, setVendorVehicles] = useState([]);

  // Holds the vehicle that is attempting to be linked to a vendor
  const [vehicleLink, setVehicleLink] = useState('');

  function makeVehicleDescription(vehicle) {
    let id = vehicle.id;
    let color = vehicle.color ? vehicle.color : '';
    let year = vehicle.year ? vehicle.year : ''
    let make = vehicle.make ? vehicle.make : '';
    let model = vehicle.model ? vehicle.model : '';
    let license = vehicle.license ? vehicle.license : '';
    let otherOwners = vehicle.list_owners ? '| ' + vehicle.list_owners : '| No vendors associated';
    return `(ID: ${id}) ${color} ${year} ${make} ${model} ${license} ${otherOwners}`
  }

  /** Make GET request using ID from URL param to grab vendor data */
  const getVendorInfo = async () => {
    try {
      let url = `http://127.0.0.1:8000/api/vendors/${id}/`;

      await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(function (response) {
          console.log('Fetched Vendor Data:')
          console.log(response.data)

          // Store vendor data from response
          setVendorInfo(response.data);

          // Set initial values for 'Edit User' form
          setFirstName(response.data.first_name);
          setLastName(response.data.last_name);
          setPhoneNumber(response.data.phone);
          setEmail(response.data.email);
          setAcceptsTexts(response.data.accepts_texts);
          setAcceptsEmails(response.data.accepts_emails);
          setIsFlagged(response.data.flagged);
          setVendorNotes(response.data.notes);

          response.data.vehicles && setVendorVehicles(response.data.vehicles.map(vehicle => makeVehicleDescription(vehicle)));
        });

    } catch (error) {
      console.error(error);
    }
  }

  /** Make PUT request to update vendor data */
  const updateVendor = async () => {
    // Add +1 to phone number if it is not there
    let verifiedPhoneNumber = phoneNumber;
    if (phoneNumber.substring(0, 2) !== '+1' && phoneNumber.length === 10) {
      verifiedPhoneNumber = '+1' + phoneNumber;
      setPhoneNumber(phoneNumber);
    } else {
      console.log('Phone number is not correct!');
    }

    // Combine 'Edit User' form values to use in PUT request (don't include vehicles)
    let values = {
      'first_name': firstName,
      'last_name': lastName,
      'phone': verifiedPhoneNumber,
      'email': email,
      'accepts_emails': acceptsEmails,
      'accepts_texts': acceptsTexts,
      'flagged': isFlagged,
      'notes': vendorNotes,
    };

    try {
      let url = `http://127.0.0.1:8000/api/vendors/${id}/`;

      await axios.put(url, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(function () {
          // Close modal
          handleCloseUser();

          // Refresh vendor info
          getVendorInfo();
        });
    } catch (error) {
      console.error(error);
    }
  }

  /** Make POST request to add new vehicle for a vendor */
  const addVehicle = async () => {
    // Combine 'Add Vehicle' form values to use in POST request
    let values = {
      'make': make,
      'model': model,
      'year': year,
      'color': color,
      'license': license,
      'vin': vin,
      'notes': notes,
    };

    // Try to create a new vehicle
    try {
      let url = `http://127.0.0.1:8000/api/vehicles/`;

      await axios.post(url, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(function (response) {
          console.log('New vehicle created:');
          console.log(response.data);

          console.log('Associating vehicle with vendor...');
          let user_id = vendorInfo.id;
          let new_vehicle_id = response.data.id;

          let vendor_vehicle_values = {
            'vendor': user_id,
            'vehicle': new_vehicle_id
          }
          let url2 = `http://127.0.0.1:8000/api/vendor-vehicle/`;

          // Associate vehicle with vendor
          axios.post(url2, vendor_vehicle_values, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });

          // Close modal
          handleCloseVehicle();

          // Refresh vendor info
          getVendorInfo();
        });
    } catch (error) {
      console.error(error);
    }
  }

  /** Make POST request to link existing vehicle to existing vendor */
  const linkVehicle = async () => {
    console.log('Attempting to link vehicle to vendor');
    let vehicleID = parseInt(vehicleLink.split(' ')[1].slice(0, -1));
    let vendorID = parseInt(vendorInfo.id);
    let values = {
      'vendor': vendorID,
      'vehicle': vehicleID
    };

    try {
      let url = `http://127.0.0.1:8000/api/vendor-vehicle/`;

      await axios.post(url, values)
        .then(function () {
          // Close modal
          handleCloseVehicleLink();

          // Refresh vendor info
          getVendorInfo();
        });
    } catch (error) {
      console.error(error);
    }
  }

  /** Make DELETE request to unlink vehicle to vendor */
  const unlinkVehicle = async () => {
    console.log('Attempting to unlink vehicle from vendor');

    let vendorID = parseInt(vendorInfo.id);
    let vehicleID = parseInt(vehicleLink.split(' ')[1].slice(0, -1));

    try {
      let url = `http://127.0.0.1:8000/api/vendor-vehicle/delete-by-filter/?vendor=${vendorID}&vehicle=${vehicleID}`;

      await axios.delete(url)
        .then(function () {
          // Close modal
          handleCloseVehicleUnlink();

          // Refresh vendor info
          getVendorInfo();
        });
    } catch (error) {
      console.error(error);
    }
  }

   /** Make GET request to get all vehicle data */
  const getVehicles = async () => {
    // Try to get all vehicles
    try {
      let url = `http://127.0.0.1:8000/api/vehicles/`;

      await axios.get(url)
        .then(function (response) {
          console.log('All vehicles');
          console.log(response.data);
          let rawVehicleList = response.data;
          console.log(rawVehicleList);
          setVehicles(rawVehicleList.map(vehicle => makeVehicleDescription(vehicle)));
        });
    } catch (error) {
      console.error(error);
    }
  }

  // Get vendor info
  useEffect(() => {
    getVendorInfo();
    getVehicles();
  }, [openVehicle, openVehicleLink, openVehicleUnlink])

  // Custom styles
    const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
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
      <Typography variant='h2'>Vendor Detail</Typography>
      <NavBar active='Vendors' />
      <br/>
      <Typography><strong>{vendorInfo.vendor_name} {vendorInfo.vendor_code}</strong></Typography>
      <br/>
      <Button variant='outlined' onClick={handleOpenUser}>Edit</Button>
    </Box>
  );
}