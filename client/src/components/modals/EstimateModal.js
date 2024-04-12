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
import {useEffect, useState} from "react";

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

  const [estimateItems, setEstimateItems] = useState([{ description: '', price: '' }]);

  useEffect(() => {
    if (estimateItems[estimateItems.length - 1].description !== '') {
      setEstimateItems([...estimateItems, { description: '', price: '' }]);
    }
  }, [estimateItems]);

  function handleDescriptionChange(index, event) {
    const newEstimateItems = [...estimateItems];
    newEstimateItems[index].description = event.target.value;
    setEstimateItems(newEstimateItems);
  }

  function handleRemoveItem(index) {
    const newEstimateItems = [...estimateItems];
    if (newEstimateItems.length > 1) {
      newEstimateItems.splice(index, 1);
      setEstimateItems(newEstimateItems);
    }
  }

  function handleSubmit() {
    // Handle the form submission here
    console.log(estimateItems);
  }

  function EstimateItem({ item, index }) {
    return (
      <FormGroup sx={{ display: 'flex-inline', flexDirection: 'row', gap: '5px', marginY: '5px' }}>
        <TextField
          value={item.description}
          onChange={(event) => handleDescriptionChange(index, event)}
          sx={{ flexGrow: 1 }}
          autoFocus={index === estimateItems.length - 2}
        />
        <TextField
          value={item.price}
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
        <Typography id="service-modal-title" sx={{mb: 2}} variant="h6" component="h2">
          Create Estimate
        </Typography>
        <Box sx={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
          <Typography display="inline" sx={{ flexGrow: 1 }}>Description</Typography>
          <Typography display="inline" sx={{ width: '185px' }}>Price</Typography>
        </Box>
        <FormGroup>
          {estimateItems.map((item, index) => (
            <EstimateItem key={index} item={item} index={index} />
          ))}
        </FormGroup>
        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
      </Box>
    </Modal>
  );
}