import React, { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, Modal, TextField, Typography, } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import axios from 'axios';

function EstimateFormModal({vehicle_id}) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([{ description: '', part_price: '', labor_price: '' }]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddRow = () => setRows([...rows, { description: '', part_price: '', labor_price: '' }]);
  const handleRemoveRow = (index) => {
    if (rows.length === 1) return; // Ensure at least one row
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleDescriptionChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].description = value;
    setRows(newRows);
  };

  const handlePartPriceChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].part_price = value;
    setRows(newRows);
  };

  const handleLaborPriceChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].labor_price = value;
    setRows(newRows);
  };

  // Handle estimate form submission
  const handleSubmit = () => {
    console.log('Submitting estimate');
    console.log('Unfiltered estimate items');
    console.log(rows);

    // Remove rows that have empty description and price
    const estimate_items = rows.filter(row => row.description && row.labor_price && row.part_price);
    console.log('Filtered estimate items');
    console.log(estimate_items);

    let data = {
      vehicle_id,
      estimate_items
    }

    let url = 'http://127.0.0.1:8000/api/estimates/'

    axios.post(url, data)
      .then(function (response) {
        console.log(response)
        if (response.status === 201) {
          console.log('Estimate created successfully!');
        }
      }
    );

    // Reset form
    setRows([{ description: '', labor_price: '', part_price: '' }]);

    handleClose();
  };

  return (
    <>
      <Button variant='outlined' onClick={handleOpen}>Create Estimate</Button>
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
