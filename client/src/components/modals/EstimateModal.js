import React, { useState } from 'react';
import {Button, Modal, TextField, IconButton, Typography, Box, InputAdornment} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

function EstimateFormModal() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([{ description: '', price: '' }]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddRow = () => setRows([...rows, { description: '', price: '' }]);
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

  const handlePriceChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].price = value;
    setRows(newRows);
  };

  // Handle estimate form submission
  const handleSubmit = () => {
    console.log('Submitting estimate');
    console.log('Raw estimate items');
    console.log(rows);

    // Remove rows that have empty description and price
    const filteredRows = rows.filter(row => row.description && row.price);
    console.log('Filtered estimate items');
    console.log(filteredRows);
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
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
            <Typography display="inline" sx={{ flexGrow: 1 }}>Description</Typography>
            <Typography display="inline" sx={{ width: '200px' }}>Price</Typography>
          </Box>
          {rows.map((row, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'row', gap: '10px', marginY: '10px' }}>
              <TextField sx={{ flexGrow: 1 }} value={row.description} onChange={(e) => handleDescriptionChange(index, e.target.value)} />
              <TextField
                sx={{ width: '150px' }}
                value={row.price}
                onChange={(e) => handlePriceChange(index, e.target.value)}
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
