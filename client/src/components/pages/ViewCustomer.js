import { Box, Button, Typography } from '@mui/material';
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { useEffect, useState} from 'react';

export default function ViewCustomer() {
  let { id } = useParams();

  const [result, setResult] = useState([]);

  const fetchData = async () => {
    // Make a GET request to the API
    try {
      let url = `http://127.0.0.1:8000/api/customers/${id}/`
      console.log(`API URL: ${url}`)
      const response = await axios.get(url)
        .then(function (response) {
          console.log('In then statement!')
          console.log(response.data);
          setResult(response.data);
        });
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [])


  return (
    <Box sx={{textAlign: 'center'}}>
      <Typography variant='h2'>Customer Detail</Typography>
      <br/>
      <Typography><strong>{result.first_name} {result.last_name}</strong></Typography>
      <br/>
      <Button variant='outlined'>Edit</Button>
      <br/>
      <br/>
      <Typography>{result.phone}</Typography>
      <Typography>Accepts Texts: {String(result.accepts_texts)}</Typography>
      <Typography>{result.email}</Typography>
      <Typography>Accepts Emails: {String(result.accepts_emails)}</Typography>
      <Typography>Flagged: {String(result.flagged)}</Typography>
      <Typography>Notes: {result.notes}</Typography>
      <br/>
      <Typography variant='h4'>Vehicles</Typography>
      <br/>
      <Button variant='outlined'>Add Vehicle</Button>
      <br/>
      <br/>
      <Typography>No vehicles for this customer</Typography>
      <br/>
      <Typography variant='h4'>Service Record</Typography>
      <br/>
      <Button variant='outlined'>Add Service</Button>
      <br/>
      <br/>
      <Typography>No service records for this customer</Typography>
    </Box>
  );
}