import {useState} from 'react';

import axios from 'axios';

import {Box, Button, IconButton, InputAdornment, Modal, TextField, Typography,} from '@mui/material';
import {AddCircleOutline, RemoveCircleOutline,} from '@mui/icons-material';

/** Modal form for creating or editing an estimate */
function EstimateFormModal({open, handleClose, vehicleId, edit=false}) {
  // Store an array of estimate item values (i.e. description, part price, and labor price)
  const [rows, setRows] = useState([{ description: '', part_price: '', labor_price: '' }]);

  /** Add new blank row for estimate */
  const handleAddRow = () => setRows([...rows, { description: '', part_price: '', labor_price: '' }]);

  /** Remove row containing an estimate item */
  const handleRemoveRow = (index) => {
    if (rows.length === 1) return; // Ensure at least one row
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  /** Update description for specified row */
  const handleDescriptionChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].description = value;
    setRows(newRows);
  };

  /** Update part price for specified row */
  const handlePartPriceChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].part_price = value;
    setRows(newRows);
  };

  /** Update labor price for specified row */
  const handleLaborPriceChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].labor_price = value;
    setRows(newRows);
  };

  /** Handle estimate form submission */
  const handleSubmit = async () => {
    console.log('Attempting to submit estimate');
    console.log('Unmodified estimate items');
    console.log(rows);

    // Remove rows that do not have a description
    const estimate_items = rows.filter(row => row.description);
    console.log('Filtered estimate items');
    console.log(estimate_items);

    // Construct POST values for creating an estimate
    let values = {
      vehicle_id: vehicleId,
      estimate_items,
    }

    console.log('Values');
    console.log(values);

    // Estimate endpoint URL
    let url = 'http://127.0.0.1:8000/api/estimates/'

    // Send POST to create new estimate
    try {
      const response = await axios.post(url, values);
      console.log('Response');
      console.log(response);

      if (response.status === 201) {
        console.log('Estimate created successfully!');

        // Reset form
        setRows([{ description: '', labor_price: '', part_price: '' }]);

        // Close modal
        handleClose();
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request error:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 550, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Create Estimate
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <Typography display="inline" sx={{ flexGrow: 1 }}>Description</Typography>
            <Typography display="inline" sx={{ width: '125px' }}>Part Price</Typography>
            <Typography display="inline" sx={{ width: '125px' }}>Labor Price</Typography>
            <Typography display="inline" sx={{ width: '40px' }}></Typography>
          </Box>
          {rows.map((row, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'row', gap: '10px', marginY: '10px' }}>
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
              <IconButton onClick={() => handleRemoveRow(index)} disabled={rows.length === 1}>
                <RemoveCircleOutline />
              </IconButton>
            </Box>
          ))}
          <Button onClick={handleAddRow} startIcon={<AddCircleOutline />}>Add Item</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </Box>
      </Modal>
    </>
  );
}

export default EstimateFormModal;
