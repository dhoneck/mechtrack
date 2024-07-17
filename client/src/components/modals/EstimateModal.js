import {useState, useEffect} from 'react';

import axios from 'axios';

import {Box, Button, IconButton, InputAdornment, Modal, TextField, Typography,} from '@mui/material';
import {AddCircleOutline, RemoveCircleOutline,} from '@mui/icons-material';

/** Modal form for creating or editing an estimate */
function EstimateFormModal({open, handleClose, vehicleId, estimate=null}) {
  // Store an array of estimate item values (i.e. description, part price, and labor price)
  const [rows, setRows] = useState([]);

  // Dynamically sets the rows based on which estimate is passed as a param, if any
  useEffect(() => {
    if (open) {
      if (estimate) {  // If estimate exists, use its estimate items for the rows
        setRows(estimate.estimate_items);
        console.log('setRows');
        console.log(rows);
      } else { //  If no estimate exists, set rows to have one empty estimate item dictionary
        setRows([{id: null, description: '', part_price: '', labor_price: ''}]);
      }
      // When modal updates, reset the array that tracks estimate items that are pending deletion
      setItemsToDelete([]);
    }
  }, [open, estimate]);

  /** Add new blank row for estimate */
  const handleAddRow = () => setRows([...rows, { id: null, description: '', part_price: '', labor_price: '' }]);

  const [itemsToDelete, setItemsToDelete] = useState([]);

  /** Remove row containing an estimate item */
  const handleRemoveRow = (index, id) => {
    if (rows.length === 1) return; // Ensure at least one row
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);

    // Set estimate item id to item to be deleted
    if (id) {
      console.log(`Adding ${id} to the itemsToDelete array.`)
      setItemsToDelete([...itemsToDelete, id]);
    }
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
    console.log('These estimate items should be deleted');
    console.log(itemsToDelete ? itemsToDelete : 'None');

    console.log('Attempting to submit estimate');
    console.log('Unmodified estimate items');
    console.log(rows);

    // Remove rows that do not have a description
    const estimate_items = rows.filter(row => row.description);
    console.log('Filtered estimate items');
    console.log(estimate_items);

    let values;
    if (estimate) {
      estimate.estimate_items = estimate_items
    } else

    // Construct POST values for creating an estimate
    values = {
      vehicle_id: vehicleId,
      estimate_items,
    }

    console.log('Values');
    console.log(values);

    // Estimate endpoint URL
    let url = 'http://127.0.0.1:8000/api/estimates/'

    // Send POST to create new estimate
    try {
      let response;
      if (estimate) {
        console.log('Attempting to PUT');
        console.log('itemsToDelete');
        console.log(itemsToDelete);
        for (const itemId of itemsToDelete) {
          console.log('Attempting to delete item #:', itemId);
          response = await axios.delete(`http://127.0.0.1:8000/api/estimate-items/${itemId}`)
        }
      } else {
        console.log('Attempting to POST');
        response = await axios.post(url, values);
      }
      console.log('Response');
      console.log(response);

      console.log('response.status');
      console.log(response.status);

      if (response.status === 201) {
        console.log('Estimate created successfully!');


        // Reset form
        setRows([{ id: null, description: '', labor_price: '', part_price: '' }]);

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
            {estimate ? 'Edit Estimate' : 'Create Estimate'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <Typography display="inline" sx={{ flexGrow: 1 }}>Description</Typography>
            <Typography display="inline" sx={{ width: '125px' }}>Part Price</Typography>
            <Typography display="inline" sx={{ width: '125px' }}>Labor Price</Typography>
            <Typography display="inline" sx={{ width: '40px' }}></Typography>
          </Box>
          {rows.map((row, index) => (
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
              <IconButton onClick={() => handleRemoveRow(index, row.id)} disabled={rows.length === 1}>
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
