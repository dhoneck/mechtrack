import { Box, Button } from "@mui/material";
import { useParams } from "react-router-dom"
import axios from "axios";
import { useEffect, useState} from "react";

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
    <Box>
      <h2>Customer Detail</h2>
      <p>{result.first_name} {result.last_name}</p>
      <Button variant="outlined">Edit</Button>
      <p>{result.phone}</p>
      <p>Accepts Texts: {String(result.accepts_texts)}</p>
      <p>{result.email}</p>
      <p>Accepts Emails: {String(result.accepts_emails)}</p>
      <p>Flagged: {String(result.flagged)}</p>
      <p>Notes: {result.notes}</p>

      <h2>Vehicles</h2>
      <Button variant="outlined">Add Vehicle</Button>
      <p>No vehicles for this customer</p>

      <h2>Service Record</h2>
      <Button variant="outlined">Add Service</Button>
      <p>No service records for this customer</p>
    </Box>
  );
}