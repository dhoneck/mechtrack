import { useEffect, useState } from 'react';

import axios from 'axios';

import { Autocomplete, Box, Button, IconButton, InputAdornment, Modal, TextField, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

/** Modal form for creating or editing an estimate */
function EstimateFormModal({ open, handleClose, vehicleId, estimate=null }) {
  // Store an array of estimate item values (i.e. description, part price, and labor price)
  const [rows, setRows] = useState([]);

  // Store an array of estimate item IDs that need to be deleted
  const [itemsToDelete, setItemsToDelete] = useState([]);

  // TODO: Dynamically grab default pricing from the API
  const [defaultPricing, setDefaultPricing] = useState([]);

  // Dynamically sets the rows based on which estimate is passed as a param, if any
  useEffect(() => {
    console.log('In useEffect for EstimateModal');
    if (open) {
      if (estimate) {  // If estimate exists, use its estimate items for the rows
        setRows(estimate.estimate_items);
      } else {  // If no estimate exists, set rows to have one empty estimate item dictionary
        setRows([{ id: null, description: '', part_price: '', labor_price: '' }]);
      }
      // When modal updates, reset the array that tracks estimate items that are pending deletion
      setItemsToDelete([]);

      async function fetchDefaultPricing() {
      try {
        const response1 = await axios.get(`${process.env.REACT_APP_API_URL}users/get-current-branch/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        let currentBranch = response1.data.current_branch;
        if (!currentBranch) {
          console.warn('No current branch for user selected, will not look for service pricing');
          return;
        }

        const response2 = await axios.get(`${process.env.REACT_APP_API_URL}branches/${currentBranch}/pricing/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setDefaultPricing(response2.data.default_pricing);
      } catch (error) {
         console.error('Error fetching default pricing:', error);
      }
    }

    fetchDefaultPricing();
    }

    // Fetch default pricing from the API

  }, [open, estimate]);

  /** Add new blank row for estimate */
  const handleAddRow = () => setRows([...rows, { id: null, description: '', part_price: '', labor_price: '' }]);

  /** Remove row containing an estimate item */
  const handleRemoveRow = (index, id) => {
    console.log('Removing row index:', index);
    console.log('Removing row id:', id);
    console.log('Rows:', rows);
    if (rows.length === 1) return;  // Ensure at least one row exists
    // Remove the row and reset rows useState
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);

    // Add estimate item id to array that will be deleted upon form submission
    // An id means that it's an existing estimate item and will need to be deleted with a DELETE request, hence tracking
    // No id means that the row doesn't already exist and doesn't need a DELETE request
    if (id) {
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
    // Remove rows that do not have a description
    // NOTE: If you edit an existing estimate item to have no description, submitting the form shouldn't affect it
    const estimate_items = rows.filter(row => row.description);

    try {
      if (!estimate) {  // Estimate wasn't provided - create new estimate and estimate items

        // Construct values for creating an estimate, which can take estimate item values and create in same request
        let values = {
          vehicle_id: vehicleId,
          branch_id: localStorage.getItem('currentBranch'),
          estimate_items,
        };

        // Estimate endpoint URL
        console.log(`Bearer ${localStorage.getItem('token')}`);
        let estimateUrl = process.env.REACT_APP_API_URL + 'estimates/';
        let response = await axios.post(estimateUrl,
            values,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
        console.log('Estimate POST Response');
        console.log(response);

      } else if (estimate) {  // Estimate was provided - add, edit or remote estimate items to existing estimate
        // Edit existing or create new estimate item
        for (let i =0; i < rows.length; i++) {
          let value = {
            estimate: estimate.id,
            description: rows[i].description,
            part_price: rows[i].part_price,
            labor_price: rows[i].labor_price,
          };

          // If id is null, create new item
          if (rows[i].id == null) {
            console.log('value');
            let response = await axios.post(
                `${process.env.REACT_APP_API_URL}estimate-items/`,
                value,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
                });
            console.log('Estimate item POST Response');
            console.log(response);
          } else {
            let response = await axios.put(
                `${process.env.REACT_APP_API_URL}estimate-items/${rows[i].id}/`,
                value,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
                });
            console.log('Estimate item PUT Response');
            console.log(response);
          }
        }

        // Remove items from estimate
        if (itemsToDelete) {
          console.log('Attempting to DELETE estimate items');
          for (const itemId of itemsToDelete) {
            console.log('Attempting to delete item #:', itemId);
            let response = await axios.delete(
                `${process.env.REACT_APP_API_URL}estimate-items/${itemId}/`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
                });
          }
        } else {
          console.log('No estimate items to delete');
        }
      }

      // Reset useState values
      setRows([{ id: null, description: '', labor_price: '', part_price: '' }]);
      setItemsToDelete([]);

      // Close modal
      handleClose();
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
  }

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
              <Autocomplete
                disablePortal
                freeSolo
                sx={{ flexGrow: 1 }}
                options={defaultPricing}
                getOptionLabel={(option) => option.name}
                inputValue={row.description}
                onInputChange={(event, newInputValue) => {
                  handleDescriptionChange(index, newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // inputValue={row.description}
                    // onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  />
                )}
                onChange={(event, newValue) => {
                  if (newValue) {
                    console.log('newValue if:', newValue);
                    console.log('index:', index);
                    handleDescriptionChange(index, newValue.name);
                    handlePartPriceChange(index, newValue.part_price);
                    handleLaborPriceChange(index, newValue.labor_price);
                  } else {
                    console.log('newValue else:', newValue);
                    console.log('index:', index);
                    handleDescriptionChange(index, '');
                    handlePartPriceChange(index, '');
                    handleLaborPriceChange(index, '');
                  }
                }}
              />

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
