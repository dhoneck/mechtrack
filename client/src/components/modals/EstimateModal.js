import {
  Box,
  Button,
  FormGroup,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import {useEffect, useRef, useState} from "react";

export default function EstimateModal() {
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

  // Store individual estimate items in state
  const [estimateItems, setEstimateItems] = useState([{ description: '', price: '' }]);

  useEffect(() => {
    console.log('Running useEffect hook.');

    // Add a new empty estimate item when the last item description
    if (estimateItems[estimateItems.length - 1].description !== '') {
      setEstimateItems([...estimateItems, { description: '', price: '' }]);
    }
  }, [estimateItems]);


  function handleDescriptionChange(index, event) {
    const newEstimateItems = [...estimateItems];
    newEstimateItems[index].description = event.target.value;
    setEstimateItems(newEstimateItems);
  }

  function handlePriceChange(index, event) {
    const newEstimateItems = [...estimateItems];
    newEstimateItems[index].price = event.target.value;
    setEstimateItems(newEstimateItems);
  }

  // Attempt to remove estimate item from the array by index
  function handleRemoveItem(index) {
    const newEstimateItems = [...estimateItems];

    if (newEstimateItems.length > 1) {
      console.log(`Removing item at index #${index}.`);
      newEstimateItems.splice(index, 1);
      setEstimateItems(newEstimateItems);
    } else {
      console.log('Cannot remove item as it is the last item left.');
    }
  }

  // Handle estimate form submission - currently just logging the estimate items
  function handleSubmit() {
    console.log(estimateItems);
  }

  function EstimateItem({ item, index }) {
    return (
      <FormGroup sx={{ display: 'flex-inline', flexDirection: 'row', gap: '5px', marginY: '5px' }}>
        <TextField
          id={`description-${index}`}
          key={index}
          value={item.description}
          onChange={(event) => handleDescriptionChange(index, event)}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          id={`price-${index}`}
          key={index + 1}
          value={item.price}
          onChange={(event) => handlePriceChange(index, event)}

          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          sx={{ width: '140px' }}
        />
        <IconButton onClick={() => handleRemoveItem(index)}>
          <CancelIcon></CancelIcon>
        </IconButton>
      </FormGroup>
    );
  }

  return (
    <Modal
      open={true}
      // onClose={handleCloseService}
      aria-labelledby="estimate-modal-title"
      aria-describedby="estimate-modal-description"
    >
      <Box sx={style}>
        <Typography id="estimate-modal-title" sx={{mb: 2}} variant="h6" component="h2">
          Create Estimate
        </Typography>
        <Box sx={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
          <Typography display="inline" sx={{ flexGrow: 1 }}>Description</Typography>
          <Typography display="inline" sx={{ width: '185px' }}>Price</Typography>
        </Box>
        <FormGroup>
          {estimateItems.map((item, index) => (
            <EstimateItem
              key={index} item={item} index={index} />
          ))}
        </FormGroup>
        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
      </Box>
    </Modal>
  );
}