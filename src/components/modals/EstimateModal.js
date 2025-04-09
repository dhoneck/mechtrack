import { useEffect, useState } from 'react';

import { Autocomplete, Box, Button, IconButton, InputAdornment, Modal, TextField, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

import { getPricing } from '../../api/branchesAPI';
import { createEstimate, createEstimateItem, updateEstimateItem, deleteEstimateItem } from '../../api/estimatesAPI';
import { getCurrentBranch } from '../../api/usersAPI';

/** Modal form for creating or editing an estimate */
function EstimateModal({ open, handleClose, vehicleId, estimate=null }) {
  // Store an array of estimate item values (i.e. id, description, part price, labor price)
  const [rows, setRows] = useState([]);

  // Array of estimate item IDs that need to be deleted
  const [itemsToDelete, setItemsToDelete] = useState([]);

  // Default pricing for the current branch or use business pricing if not available
  const [defaultPricing, setDefaultPricing] = useState([]);

  // Dynamically sets the rows based on which estimate is passed as a param, if any
  useEffect(() => {
    console.log('In useEffect for EstimateModal');
    console.log('Estimate:');
    console.log(estimate);
    if (open) {
      if (estimate) {  // If estimate exists, use its estimate items for the rows
        setRows(estimate.estimate_items);
      } else {  // If no estimate exists, set rows to have one empty estimate item dictionary
        setRows([{ id: null, description: '', part_price: '', labor_price: '' }]);
      }
      // When modal updates, reset the array that tracks estimate items that are pending deletion
      setItemsToDelete([]);

      async function handlePricingGet() {
      try {
        const response = await getPricing();
        const pricing = response.data.default_pricing;
        setDefaultPricing(pricing);
      } catch (error) {
         console.error('Error fetching default pricing:', error);
      }
    }
    handlePricingGet();
    }
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
      if (!estimate) {  // Existing estimate wasn't provided - create new estimate and estimate items
        const currentBranchResponse = await getCurrentBranch();
        const branchId = currentBranchResponse.data.current_branch;

        // Construct values for creating an estimate, which can take estimate item values and create in same request
        let values = {
          vehicle_id: vehicleId,
          branch_id: branchId,
          estimate_items,
        };

        await createEstimate(values);
      } else if (estimate) {  // Existing estimate was provided - add, edit or remove estimate items to estimate
        // Edit existing or create new estimate item
        for (let i =0; i < rows.length; i++) {
          let value = {
            estimate: estimate.id,
            description: rows[i].description,
            part_price: rows[i].part_price,
            labor_price: rows[i].labor_price,
          };

          // Create new or update existing estimate item depending on if there was an id
          if (rows[i].id == null) {  // id is null, create new item
            await createEstimateItem(value);
          } else {  // id exists, update existing item
            await updateEstimateItem(rows[i].id);
          }
        }

        // Delete existing estimate items from database that were removed from estimate form
        if (itemsToDelete) {
          for (const itemId of itemsToDelete) {
            await deleteEstimateItem(itemId);
          }
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

export default EstimateModal;